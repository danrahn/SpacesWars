
/******************************
 * Begin Main
 ******************************/

/* global GM_setValue*/
/* global GM_getValue*/
/* global GM_deleteValue*/
/* global GM_xmlhttpRequest*/
/* global calcul*/

/*
 * In general, the actual game consists of three frames. The top-level frame is frames.php, and it contains
 * two child frames, leftmenu.php and whatever part of the actual game we're on. To save memory and prevent
 * us from having to load the script every time a page changes, we can attach to the top-level frames.php,
 * which allows us to persist state across pages. This prevents us from loading things unnecessarily, and
 * let's us not have to save changes every time (as the galaxy data can be upwards of 3MB of text).
 *
 * The biggest caveat of this design is that if you open a page in a new window without frames.php present,
 * nothing will load. In general I think that's fine, since it's a fairly uncommon scenario, and you can
 * "work around" it by just having another instance of the full frames. I think the benefit of not having
 * to load 4000+ lines of JS every time a new page loads is beneficial, espeically with some of the automated
 * tasks I've created. There are some exceptions, such as rw.php, which will always load without frames.
 * Because of that, I chose to include all the necessary methods/dependencies for RConverter in InnerPage.
 */
// TODO: I was going to try an get rid of all the jQuery dependencies, then I realized I need its tooltips
// TODO: Ensure everything works with French language

var g_info = getInfoFromPage();
var g_page = g_info.loc;
var g_uni = g_info.universe;

// Masks for the new storage:
// 17 bits. Lowest order for moon (t/f), next 4 for
// planet (0-15), next 9 for system (0-511), last 3
// for galaxy (0-7)
// 111 111111111 1111 1
var GAL_MASK = 0x1C000; // bits 15-17
var SYS_MASK = 0x3FE0;  // bits 6-14
var PLN_MASK = 0x1E;    // bits 2-5
var LUN_MASK = 0x1;     // first bit
var GAL_SHIFT = 14;
var SYS_SHIFT = 5;
var PLN_SHIFT = 1;

// We allow the main script to run on simulator pages so we can
// process simulations and communicate with other outer loop processes
if (g_page === "simulator") {
    if ($(".divtop.curvedtot")[1].innerHTML.indexOf("Attacker Simulation") !== -1) {
        processSim();
    }
    // noinspection JSAnnotator
    return;
}

var autoAttackWithSim = !!parseInt(getValue("spyForMe"));

var g_nbScripts = 13;
var thisVersion = "4.1";
var user = "user";
var GM_ICON = "http://i.imgur.com/OrSr0G6.png"; // Old icon was broken, all hail the new icon
var scriptsIcons = GM_ICON; // Old icon was broken

var g_scriptInfo = getScriptInfo();
var g_versionInfo;
try {
    g_versionInfo = JSON.parse(GM_getValue("infos_version"));
    if (!g_versionInfo) {
        g_versionInfo = setInfosVersion();
    }
} catch (ex) {
    g_versionInfo = undefined;
}

checkVersionInfo();

// the variable name 'location' makes Opera bugging
var g_lang = g_versionInfo.language;
f = null;
var lm; // Left Menu

// Language dictionary. FR and EN
var L_ = setDictionary();

var g_merchantMap = setMerchantMap();       // Maps buildings/research/fleet/def to merchant ids
var nbUnis = g_versionInfo.nbUnis;

var g_canLoadMap = getLoadMap();            // Map determining whether a given script can run on the page
var g_config = getConfig();                 // Current config for the universe
var g_galaxyData = getGalaxyData();         // Map of saved players in the galaxy
var g_doNotSpy = getDoNotSpyData();         // Map of doNotSpy positions
var g_fleetPoints = getFleetPointsData();   // Map of fleet points for players
var g_inactiveList = getInactiveList();     // List of inactive players
var g_markit = getMarkitData();             // List of marked players in the galaxy
var SAVE_INTERVAL = 20;                     // How often to save data
var g_changeCount = 0;                      // Number of changes without a save
var g_markitChanged = false;                // Whether markit data has changed
var g_dnsChanged = false;                   // Whether doNotSpy data has changed
var g_oldVersion = undefined;               // Should we save the current script?
var g_galaxyDataChanged = false;            // Whether the galaxy data has changed
var g_inactivesChanged = false;             // Whether the list of inactive players has changed
var g_saveEveryTime = false;                // Whether to save data whenever something changes
var g_inPlanetView = true;                  // Whether we are in planet view (unused?)

if (!usingOldVersion()) {
    g_changeCount = 1;
}

// A bit of a misnomer, as it's function changed. Determines
// whether to selectively ignore planets when spying because old
// reports show they have nothing of use
var spyForMe = g_config.EasyTarget.useDoNotSpy;

var g_saveIcon = "https://i.imgur.com/hiPncO0.png";
var g_savedIcon = "https://i.imgur.com/Ldr8fWG.png";

var g_targetPlanet = -1;  // Determines the current target planet in galaxy view

// List of excluded input ids that indicate we should not process shortcuts
var g_textAreas = ["EasyTarget_text", "RConvOpt", "mail", "message_subject", "text", "message2", "jscolorid"];
var g_invalidNameFields = ["newname", "pwpl", "name", "nom", "tag", "rangname", "password", "lien", "logo", "change_admin_rank", "changerank", "change_rank", "change_member_rank"];

/**
 * Dictionary of keycodes
 * @type {{}}
 */
var KEY = {
    TAB   : 9,  SPACE : 32,
    ENTER : 13, SHIFT : 16, CTRL  : 17, ALT   : 18, ESC  : 27,
    LEFT  : 37, UP    : 38, RIGHT : 39, DOWN  : 40,
    ZERO  : 48, ONE   : 49, TWO   : 50, THREE : 51, FOUR : 52,
    FIVE  : 53, SIX   : 54, SEVEN : 55, EIGHT : 56, NINE : 57,
    A : 65, B : 66, C : 67, D : 68, E : 69, F : 70, G : 71, H : 72,
    I : 73, J : 74, K : 75, L : 76, M : 77, N : 78, O : 79, P : 80,
    Q : 81, R : 82, S : 83, T : 84, U : 85, V : 86, W : 87, X : 88,
    Y : 89, Z : 90, OPEN_BRACKET : 219, CLOSE_BRACKET : 221
};

/**
 * List of fleet names
 * @type {[]}
 */
var g_fleetNames = [
    L_.small_cargo,     L_.large_cargo,   L_.light_fighter,   L_.heavy_fighter,
    L_.cruiser,         L_.battleship,    L_.colony_ship,     L_.recycler,
    L_.espionage_probe, L_.bomber,        L_.solar_satellite, L_.destroyer,
    L_.deathstar,       L_.battlecruiser, L_.supernova,       L_.massive_cargo,
    L_.collector,       L_.blast,         L_.extractor
];

/**
 * List of defense names
 * @type {[]}
 */
var g_defNames = [
    L_.rl, L_.ll,  L_.hl,  L_.gc, L_.ic,
    L_.pt, L_.ssd, L_.lsd, L_.ug
];

/**
 * Array of built up keys for key combinations
 * @type {[]}
 */
var g_keyArray;

if (window.top === window) {
    g_keyArray = [];
} else {
    if (!window.top.g_keyArray) {
        window.top.g_keyArray = [];
    }

    g_keyArray = window.top.g_keyArray;
    if (g_page !== "leftmenu") {
        window.top.g_keyArray.length = 0;
    }
}

var autoAttack = !!parseInt(getValue("autoAttackMasterSwitch")) && usingOldVersion();
var advancedAutoAttack = autoAttack; // No longer used?

// Every page gets the shortcut handler
setGlobalKeyboardShortcuts();

// Prompt the user if they really want to exit, as data might not be saved
// yet. Unnecessary?
if (g_page !== "forum" && g_page !== "simulator" && !g_saveEveryTime) {
    window.addEventListener("beforeunload", function (e) {
        changeHandler(true /*forcecSave*/);
        var confirmationMessage = "/";

        e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
        return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
}

// We're in the top level frame that holds the leftmenu and the actual content
if (g_page === "frames") {
    console.log("Top level frame!");
    // We have to insert the js directly into the page, otherwise the inner frame
    // won't have access to these internals.
    // noinspection JSAnnotator
    window.top.document.head.appendChild(buildNode("script", ["type"], ["text/javascript"],
        `
            function notifyNewPage(page) {
                console.log("New page: " + page);
                handleNewPage(page);
            }
        `
    ));

    // Reset the dictionary on a language change
    if (window.location.href.indexOf("lang_change") !== -1) {
        var newLang = window.location.href.substring(window.location.href.length - 2);
        if (g_lang !== newLang) {
            g_lang = newLang;
            L_ = setDictionary();
        }
    }

    // Trickiness needed to let the inner loop communicate with
    // the outer loop.
    handleNewPage = function(page) {
        g_page = page;
        g_keyArray.length = 0;

        if (g_page !== "leftmenu") {
            if (f) {
                delete f;
            }
            f = window.frames[1];
            if (!autoAttack) {
                f.addEventListener("keyup", function(e) {
                    globalShortcutHandler(e);
                });
                f.addEventListener('keydown', function(e) {
                    globalKeypressHandler(e);
                });

                if (g_page !== "fleet" && g_page !== "floten1" && g_page !== "floten2" && g_page !== "floten3") {
                    deleteValue("attackData");
                }
            }
        }

        // SpacesWars did away with userscripts, and along with it the
        // configurating page that used to be built in. To work around it,
        // redirect to the "bonus" page when the GM icon is clicked and set a
        // flag that tells us to overwrite the page with our custom content below
        if (g_page === "achatbonus" && f.location.search.includes("config=1")) {
            createAndLoadConfigurationPage();
        }

        // Persistent left menu
        if (g_page === "leftmenu") {
            console.log("Setting left menu");
            lm = window.frames[0];
            setupSidebar();
            lm.addEventListener("keyup", function(e) {
                globalShortcutHandler(e);
            });
            lm.addEventListener('keydown', function(e) {
                globalKeypressHandler(e);
            });
            var shortcutDiv = buildNode("div", ["id", "style"], ["keystrokes", "position:fixed;bottom:5px;left:0;font-size:12pt;color:green;background-color:rgba(0,0,0,.7);border:2px solid black;vertical-align:middle;line-height:50px;padding-left:15px;width:300px;height:50px;"], "KEYSTROKES");
            if (!usingOldVersion())
            {
                shortcutDiv.style.display = "none";
            }
            lm.document.body.appendChild(shortcutDiv);
        }

        if (canLoadInPage("ClicNGo")) { // doesn't count as a script (no option to deactivate it)
            loadClickNGo()
        }

        if (canLoadInPage("EasyFarm") && g_scriptInfo.EasyFarm) {
            loadEasyFarm();
        }

        // Shows who's inactive in the statistics page
        if (canLoadInPage('InactiveStats') && (g_scriptInfo.InactiveStats || g_scriptInfo.FleetPoints)) {
            loadInactiveStatsAndFleetPoints();
        }

        if (canLoadInPage("More_deutRow") && g_scriptInfo.More && g_config.More.deutRow) {
            loadDeutRow();
        }

        if (canLoadInPage('More_deutRow') && g_scriptInfo.More && g_config.More.convertClick) {
            loadConvertClick();
        }

        if (g_page === 'fleet' && g_scriptInfo.More && g_config.More.mcTransport && g_uni === '17') {
            loadMcTransport();
        }

        if (canLoadInPage("empireTotal") && g_scriptInfo.BetterEmpire) {
            loadBetterEmpire();
        }

        if (canLoadInPage("EasyTarget")) {
            loadEasyTargetAndMarkit();
        }

        if (canLoadInPage("iFly") && g_scriptInfo.iFly) {
            loadiFly();
        }

        if (canLoadInPage("TChatty") && g_scriptInfo.TChatty) {
            loadTChatty()
        }

        // Disable autocomplete on all qualifying input fields
        if (g_scriptInfo.NoAutoComplete && autoCompleteSelected(g_page)) {
            disableAutoComplete();
        }

        if (canLoadInPage("AllinDeut") && g_scriptInfo.AllinDeut) {
            loadAllinDeut();
        }

        if (g_scriptInfo.More) {
            loadMore();
        }

        if (g_page === "fleet") {
            saveFleetPage();
        }

        if (g_page === "floten1") {
            continueAttack();
        }

        if (g_page === "floten2") {
            setupFleet2();
        }

        if (g_page === 'simulator') {
            setSimDefaults();
        }
    }

} else {
    if (window.top.notifyNewPage)
        window.top.notifyNewPage(g_page);
    else
        console.log("Top frame doesn't have stuff :(");
}

/**
 * Creates and returns the dictionary mapping
 * scripts to the pages they can be loaded in
 *
 * @returns {{}}
 */
function getLoadMap() {
    console.log("Setting canLoad map");
    var canLoad = {};

    // Type 1 - indicates any page listed is a page
    //          the script can be loaded in.
    // Type 2 - indicates any page listed is a page
    //          the script cannot be loaded in.
    canLoad.RConverter = {
        type : 1,
        rw : true
    };

    canLoad.EasyFarm = {
        type : 1,
        messages : true
    };

    canLoad.AllinDeut = {
        type : 1,
        buildings : true,
        research : true
    };

    canLoad.Carto = {
        type : 1,
        galaxy : true
    };

    canLoad.iFly = {
        type : 1,
        overview : true
    };

    canLoad.TChatty = {
        type : 1,
        chat : true
    };

    canLoad.Markit = {
        type : 1,
        galaxy : true
    };

    canLoad.ClicNGo = {
        type : 1,
        index : true
    };

    canLoad.More_moonsList = {
        type : 2,
        chat : false,
        forum : false,
        index : false,
        niark : false,
        rw : false,
        frames : false,
        leftmenu : false
    };

    canLoad.More_convertDeut = {
        type : 1,
        marchand : true
    };

    canLoad.More_traductor = {
        type : 1,
        chat : true,
        forum : true,
        message : true
    };

    canLoad.More_resources = {
        type : 1,
        resources : true
    };

    canLoad.More_redirectFleet = {
        type : 1,
        floten3 : true
    };

    canLoad.More_arrows = {
        type : 2,
        chat : false,
        forum : false,
        index : false,
        niark : false,
        rw : false,
        frames : false,
        leftmenu : false
    };

    canLoad.More_returns = {
        type : 1,
        overview : true
    };

    canLoad.EasyTarget = {
        type : 1,
        galaxy : true
    };

    canLoad.InactiveStats = {
        type : 1,
        stat : true
    };

    canLoad.AllianceLink = {
        type : 1,
        alliance : true
    };

    canLoad.More_deutRow = {
        type : 2,
        niark : false,
        forum : false,
        index : false,
        chat : false,
        rw : false,
        frames : false,
        leftmenu : false
    };

    canLoad.empireTotal = {
        type : 1,
        imperium : true
    };

    canLoad.navigatorShortcuts = {
        type : 2,
        niark : false,
        forum : false,
        index : false,
        chat : false,
        rw : false,
        notes : false,
        search : false
    };

    return canLoad;
}

/**
 * Determine if a given script can run on the current page
 * @param script
 * @returns {boolean}
 */
function canLoadInPage(script) {
    // type "1" : get all the matching pages
    // type "2" : get all the not matching pages
    if (g_canLoadMap[script].type === 1) {
        return !!g_canLoadMap[script][g_page];
    }

    if (g_canLoadMap[script].type === 2) {
        return !g_canLoadMap[script][g_page];
    }
    return false;
}

/**
 * Adds thousands separators to the given string
 *
 * "123456789" -> "123.456.789"
 *
 * @param nStr - String to translate
 * @returns {string|*}
 */
function getSlashedNb(nStr) {
    nStr =  Math.ceil(nStr).toString();
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(nStr)) {
        nStr = nStr.replace(rgx, "$1" + "." + "$2");
    }
    return nStr;
}

/**
 * Creates and returns the language dictionary.
 *
 * @returns {[]} The dictionary
 */
function setDictionary() {
    console.log("Setting dictionary: " + g_lang);

    if (L_ && g_lang === L_.lang) {
        return L_;
    }
    var tab = [];
    switch (g_lang) {
        case "fr":
            tab.lang = "fr";
            tab.newVersion = "Nouvelle version disponible.\r\nCliquez sur l'icône du menu de gauche pour plus d'informations.";
            tab.cantxml = "Votre navigateur ne vous permet pas d'envoyer des données vers la cartographie";
            tab.ClicNGo_universe = "Univers";
            tab.ClicNGo_username = "Pseudo";
            tab.ClicNGo_number = "Numéro";
            tab.RConverter_HoF = "Cochez si c'est un HoF (afin d'ajouter le lien, obligatoire sur le forum)";
            tab.RConverter_help = "Appuyez sur Ctrl+C pour copier, Ctrl+V pour coller";
            tab.iFly_deutfly = "Deutérium en vol";
            tab.iFly_metal = "Métal";
            tab.Markit_rank = "Place";
            tab.More_allTo = "Tout mettre à...";
            tab.More_convertInto = "Tout convertir en";
            tab.More_crystal = "cristal";
            tab.More_deuterium = "deutérium";
            tab.EasyFarm_attack = "Attaquer";
            tab.EasyFarm_looting = "Pillage";
            tab.EasyFarm_ruinsField = "Champ de ruines";
            tab.EasyFarm_spyReport = "Rapport d'espionnage";
            tab.EasyFarm_metal = "Métal";
            tab.EasyFarm_deuterium = "Deutérium";
            tab.EasyFarm_defenses = "Défenses";
            tab.AllinDeut_metal = "Métal";
            tab.AllinDeut_crystal = "Cristal";
            tab.AllinDeut_deuterium = "Deutérium";
            tab.small_cargo = "Petit transporteur";
            tab.large_cargo = "Grand transporteur";
            tab.light_fighter = "Chasseur léger";
            tab.heavy_fighter = "Chasseur lourd";
            tab.cruiser = "Croiseur";
            tab.battleship = "Vaisseau de bataille";
            tab.colony_ship = "Vaisseau de colonisation";
            tab.recycler = "Recycleur";
            tab.espionage_probe = "Sonde espionnage";
            tab.bomber = "Bombardier";
            tab.solar_satellite = "Satellite solaire";
            tab.destroyer = "Destructeur";
            tab.deathstar = "Étoile de la mort";
            tab.battlecruiser = "Traqueur";
            tab.supernova = "Supernova";
            tab.massive_cargo = "Convoyeur";
            tab.collector = "Collecteur";
            tab.blast = "Foudroyeur";
            tab.extractor = "Vaisseau Extracteur";
            tab.rg = "Lanceur de missiles";
            tab.ll = "Artillerie laser légère";
            tab.hl = "Artillerie laser lourde";
            tab.gl = "Canon de Gauss";
            tab.ic = "Artillerie à ions";
            tab.pt = "Lanceur de plasma";
            tab.ssd = "Petit bouclier";
            tab.lsd = "Grand bouclier";
            tab.ug = "Protecteur Planètaire";
            tab.alliance = "Alliance";
            tab.chat = "Chat";
            tab.board = "Forum";
            tab.options = "Options";
            tab.support = "Support";
            tab.available = "Disponible";
            tab.send = "Envoyer";
            tab.universe = "Univers";

            tab.activate = "Activer";
            tab.deactivate = "Désactiver";
            tab.inactiveDescrip1 = "Afficher joueurs inactifs dans la page de classements. <br />Exige que l'univers soit balayé manuellement, car les valeurs <br />sont mises à jour car ils sont considérés dans l'univers.";
            tab.inactiveDescrip2 = "Travaux dans la page de classements";
            tab.easyTargetDescrip1 = "Afficher tous les emplacements recueillies pour chaque joueur en vue de la galaxie";
            tab.easyTargetDescrip2 = "Fonctionne dans la page de galaxie";
            tab.import = "Importer";
            tab.export = "Exporter";
            tab.EasyImportDescrip = "Pour importer, coller ici et appuyez sur l'importation. Pour exporter, appuyez sur l'exportation et copier le texte qui apparaît";
            tab.noAutoDescrip1 = "Désactiver autocomplete de champ sur des pages spécifiques";
            tab.noAutoDescrip2 = "Fonctionne dans toutes les pages avec des champs de saisie semi-automatique";
            tab.noAutoGalaxy = "Galaxie";
            tab.noAutoFleet1 = "Flotte 1";
            tab.noAutoFleet2 = "Flotte 2";
            tab.noAutoFleet3 = "Flotte 3";
            tab.noAutoShip = "ChantierSpatial";
            tab.noAutoDef = "Défenses";
            tab.noAutoSims = "Simulateurs";
            tab.noAutoMerch = "Marchand";
            tab.noAutoScrap = "Ferrailleur";
            tab.galaxyRanksDescrip1 = "Voir les rangs des joueurs directement dans la vue de la galaxie<br /><br />Les rangs doivent être en ordre (le moins cher), et les <br />numéros valides pour qu'il soit traité correctement croissante.";
            tab.galaxyRanksDescrip2 = "Fonctionne dans la page de galaxie";
            tab.galaxyRanksOthers = "Tous les autres";
            tab.deutRowDescrip1 = "montrer les ressources que vous avez tous en Deut côté métal / crystal / Deut";
            tab.deutRowDescrip2 = "tous apges où l'affichage des ressources apparaît";
            tab.galaxyRanksInactive = "Voir les inactifs";
            tab.convertCDescrip1 = "En cliquant sur le / crystal / valeur Deut métallique convertit automatiquement toutes <br />les ressources à ce type particulier.";
            tab.convertCDescrip2 = "toutes les pages où l'affichage des ressources montre. ConvertDeut doit être activé";
            tab.mcTransDescrip1 = "Ajoute une option pour sélectionner suffisamment de convoyeur pour le transport de toutes <br />les ressources de la planète à l'autre (u17 seulement)";
            tab.mcTransDescrip2 = "Cette page de la flotte";
            tab.empTotDescrip1 = "Voir la première colonne des totaux en raison de l'empire";
            tab.empTotDescrip2 = "Page d'empire";
            tab.rConverterDescrip1 = "Format des journaux d'attaque";
            tab.rConverterDescrip2 = "Rapport de combat";
            tab.easyFarmDescrip1 = "Mettez en surbrillance les éléments dans vos rapports d'espionnage qui sont plus rentables que les limites définies";
            tab.easyFarmDescrip2 = "Page d'posts";
            tab.allinDeutDescrip1 = "Afficher les coûts de construction en deut";
            tab.allinDeutDescrip2 = "Page d'bâtiments";
            tab.tChattyDescrip1 = "Meilleur bavarder";
            tab.tChattyDescrip2 = "Page d'bavarder";
            tab.markitDescrip1 = "Marquer les joueurs dans la galaxie";
            tab.markitDescrip2 = "Page d'galaxie";
            tab.mMoonListDescrip1 = "Marquez les lunes bleu dans le sélecteur de la planète";
            tab.mMoonListDescrip2 = "Partout";
            tab.mConvertDeutDescrip1 = "Améliorer la page marchande";
            tab.mConvertDeutDescrip2 = "Page d'marchand";
            tab.mTraductorDescrip1 = "Traduire des messages";
            tab.mTraductorDescrip2 = "Page d'messages";
            tab.mResourcesDescrip1 = "Sélectionnez facilement le pourcentage de production";
            tab.mResourcesDescrip2 = "Page d'production";
            tab.mRedirectFleetDescrip1 = "Redirection vers la page principale de la flotte après envoi d'une flotte";
            tab.mRedirectFleetDescrip2 = "Page d'flotte";
            tab.mArrowsDescrip1 = "Régler le sélecteur de flèche";
            tab.mArrowsDescrip2 = "Partout";
            tab.mReturnsDescrip1 = "Rendez les flottes de retour transparentes dans l'aperçu";
            tab.mReturnsDescrip2 = "Page d'générale";
            tab.mNone = "aucun";
            tab.mFridge = "frigo";
            tab.mBunker = "bunker";
            tab.mAttack = "à raider";
            tab.mDont = "à ne pas";
            tab.mTitle = "Sélectionnez le type de marquage:";
            tab.betterEmpDescrip1 = "Mieux trier l'affichage empire, avec la colonne «total» d'abord, et la possibilité de commander les <br />planètes selon la disposition attribué dans les paramètres, et ont lunes dernière.";
            tab.betterEmpDescrip2 = "Fonctionne dans la page de l'empire";
            tab.betterEmpMain = "commande standard";
            tab.betterEmpMoon = "lunes derniers";
            tab.FPDescrip1 = "Ajouter des points de la flotte comme une option dans la page de classements.";
            tab.FPDescrip2 = "Travaux dans la page de classements";
            tab.FPAlert = "Si cette personne a changé leur nom et ne devrait plus être dans les classements, appuyez sur Entrée.";
            tab.spy = "Espionner";
            tab.closeMessage = "Fermer ce message";

            // Buildings/Research/abm/ipm
            tab.metalMine = "Mine de métal";
            tab.crystalMine = "Mine de cristal";
            tab.deutMine = "Synthétiseur de deutérium";
            tab.solarPlant = "Centrale électrique solaire";
            tab.fusionReactor = "Centrale électrique de fusion";
            tab.roboticsFactory = "Usine de robots";
            tab.naniteFactory = "Usine de nanites";
            tab.shipyard = "Chantier spatial";
            tab.metalStorage ="Entrepôt de métal";
            tab.crystalStorage = "Entrepôt de cristal";
            tab.deutStorage = "Réservoir de deutérium";
            tab.researchLab = "Laboratoire de recherche";
            tab.terraformer = "Terraformeur";
            tab.alliancedepot = "Station de ravitaillement";
            tab.advancedLab = "Laboratoire avancé";
            tab.trainingCenter = "Centre de formation";
            tab.missileSile = "Silo de missiles";
            tab.lunarBase = "Base lunaire";
            tab.sensorPhalanx = "Phalange de capteur";
            tab.jumpGate = "Porte de saut spatial";

            tab.metalProduction  = "Production de métal";
            tab.crystalProduction  = "Production de cristal";
            tab.deuteriumProduction  = "Production de deutérium";
            tab.espionageTechnology  = "Espionnage";
            tab.computerTechnology  = "Ordinateur";
            tab.weaponsTechnology  = "Armement";
            tab.shieldingTechnology  = "Bouclier";
            tab.armorTechnology  = "Protection des vaisseaux spatiaux";
            tab.energyTechnology  = "Energie";
            tab.hyperspaceTechnology  = "Hyperespace";
            tab.combustionDrive  = "Réacteur à combustion";
            tab.impulseDrive  = "Réacteur à impulsion";
            tab.hyperspaceDrive  = "Propulsion Hyperespace";
            tab.laserTechnology  = "Laser";
            tab.ionTechnology  = "Ions";
            tab.plasmaTechnology  = "Plasma";
            tab.intergalacticResearchNetwork  = "Réseau de Recherche Intergalactique";
            tab.expeditionTechnology  = "Expéditions";
            tab.teachingtechnology  = "Enseignement";
            tab.consistency  = "Consistance";
            tab.extractorHangar  = "Hangar à VE";
            tab.abm = "Missile d'Interception";
            tab.ipm = "Missile Interplanétaire";
            break;
        case "en":
            tab.lang = "en";
            tab.newVersion = "New version avaliable.\r\nClick on the left menu icon for more information.";
            tab.cantxml = "Your browser can't send datas to your cartography";
            tab.ClicNGo_universe = "Universe";
            tab.ClicNGo_username = "Username";
            tab.ClicNGo_number = "Number";
            tab.RConverter_HoF = "Check it if it's a HoF (to add the link, mandatory on the board)";
            tab.RConverter_help = "Press Ctrl+C to copy, Ctrl+V to paste";
            tab.iFly_deutfly = "Deuterium flying";
            tab.iFly_metal = "Metal";
            tab.Markit_rank = "Place";
            tab.More_allTo = "Set all to...";

            tab.More_convertInto = "Exchange all in ";
            tab.More_crystal = "crystal";
            tab.More_deuterium = "deuterium";
            tab.EasyFarm_attack = "Attack";
            tab.EasyFarm_looting = "Looting";
            tab.EasyFarm_ruinsField = "Ruins field";
            tab.EasyFarm_spyReport = "Spy report";
            tab.EasyFarm_metal = "Metal";
            tab.EasyFarm_deuterium = "Deuterium";
            tab.EasyFarm_defenses = "Defenses";
            tab.AllinDeut_metal = "Metal";
            tab.AllinDeut_crystal = "Crystal";
            tab.AllinDeut_deuterium = "Deuterium";
            tab.small_cargo = "Small cargo";
            tab.large_cargo = "Large cargo";
            tab.light_fighter = "Light Fighter";
            tab.heavy_fighter = "Heavy Fighter";
            tab.cruiser = "Cruiser";
            tab.battleship = "Battleship";
            tab.colony_ship = "Colony Ship";
            tab.recycler = "Recycler";
            tab.espionage_probe = "Espionage Probe";
            tab.bomber = "Bomber";
            tab.solar_satellite = "Solar Satellite";
            tab.destroyer = "Destroyer";
            tab.deathstar = "Deathstar";
            tab.battlecruiser = "Battlecruiser";
            tab.supernova = "Supernova";
            tab.massive_cargo = "Massive cargo";
            tab.collector = "Heavy recycler";
            tab.blast = "Blast";
            tab.extractor = "Extractor";
            tab.rl = "Rocket Launcher";
            tab.ll = "Light Laser";
            tab.hl = "Heavy Laser";
            tab.gc = "Gauss Cannon";
            tab.ic = "Ion Cannon";
            tab.pt = "Plasma Turret";
            tab.ssd = "Small Shield Dome";
            tab.lsd = "Large Shield Dome";
            tab.ug = "Ultimate guard";
            tab.alliance = "Alliance";
            tab.chat = "Chat";
            tab.board = "Board";
            tab.options = "Options";
            tab.support = "Support";
            tab.available = "Available";
            tab.send = "Send";
            tab.universe = "Universe";

            tab.activate = "Activate";
            tab.deactivate = "Deactivate";
            tab.inactiveDescrip1 = "Show inactive players inthe statistics page.<br />Requires that the universe be manually scanned,<br />as values are updated as they are seen in the universe.";
            tab.inactiveDescrip2 = "Works in the statistics page";
            tab.easyTargetDescrip1 = "Show all gathered locations for each players in galaxy view";
            tab.easyTargetDescrip2 = "Works in the galaxy page";
            tab.import = "Import";
            tab.export = "Export";
            tab.EasyImportDescrip = "To import, paste here and press import. To export, press export and copy the text that appears";
            tab.noAutoDescrip1 = "Disable field auto-completion on specific pages";
            tab.noAutoDescrip2 = "Works in all pages with auto-complete fields";
            tab.noAutoGalaxy = "Galaxy";
            tab.noAutoFleet1 = "FleetMain";
            tab.noAutoFleet2 = "FleetDest";
            tab.noAutoFleet3 = "FleetRes";
            tab.noAutoShip = "Shipyard";
            tab.noAutoDef = "Defenses";
            tab.noAutoSims = "Simulators";
            tab.noAutoMerch = "Mercant";
            tab.noAutoScrap = "Scrapdealer";
            tab.galaxyRanksDescrip1 = "Show the ranks of players directly in galaxy view.<br /><br />The ranks must be in increasing order (lowest first),<br />and valid numbers, for it to be processed correctly.";
            tab.galaxyRanksDescrip2 = "Works in the galaxy page";
            tab.galaxyRanksOthers = "All others";
            tab.galaxyRanksInactive = "Show Inactives";
            tab.deutRowDescrip1 = "show the resources you have all in deut alongside the metal/crystal/deut rows";
            tab.deutRowDescrip2 = "all pages where the resource display appears";
            tab.convertCDescrip1 = "Clicking on the metal/crystal/deut value will automatically convert all resources to that particular type.";
            tab.convertCDescrip2 = "all pages where the resource display appears";
            tab.mcTransDescrip1 = "Adds the option to select enough massive_cargos to transport all resources on the planet to another (u17 only)";
            tab.mcTransDescrip2 = "fleet page";
            tab.empTotDescrip1 = "Show the totals column first in empire view";
            tab.empTotDescrip2 = "empire page";
            tab.rConverterDescrip1 = "Format attack logs";
            tab.rConverterDescrip2 = "Works in battle report page";
            tab.easyFarmDescrip1 = "Highlight items in your spy reports that are more profitable than the set limits";
            tab.easyFarmDescrip2 = "Works in the messages page";
            tab.allinDeutDescrip1 = "Show building costs in deut";
            tab.allinDeutDescrip2 = "Works on the buildings page";
            tab.tChattyDescrip1 = "Better chat";
            tab.tChattyDescrip2 = "Works on the chat page";
            tab.markitDescrip1 = "Mark players in the galaxy";
            tab.markitDescrip2 = "Works on the galaxy page";
            tab.mMoonListDescrip1 = "Mark moons blue in the planet selector";
            tab.mMoonListDescrip2 = "Works everywhere";
            tab.mConvertDeutDescrip1 = "Enhance the merchant page";
            tab.mConvertDeutDescrip2 = "Works on the merchant page";
            tab.mTraductorDescrip1 = "Translate messages";
            tab.mTraductorDescrip2 = "Works in the chat, forum, and message page";
            tab.mResourcesDescrip1 = "Easily select production percentage";
            tab.mResourcesDescrip2 = "Works in the resources page";
            tab.mRedirectFleetDescrip1 = "Redirect back to the main fleet page after sending a fleet";
            tab.mRedirectFleetDescrip2 = "Works on the fleet page";
            tab.mArrowsDescrip1 = "Make the arrow selector larger";
            tab.mArrowsDescrip2 = "Works everywhere";
            tab.mReturnsDescrip1 = "Make return fleets transparent in the overview";
            tab.mReturnsDescrip2 = "Works in the overview page";
            tab.mNone = "None";
            tab.mFridge = "Fridge";
            tab.mBunker = "Bunker";
            tab.mAttack = "Attack";
            tab.mDont = "Don't Attack";
            tab.mTitle = "Select Marking Type:";
            tab.betterEmpDescrip1 = "Better sort the empire view, with the 'total' column first, and the option to order <br />the planets according to the arrangement assigned in settings, and have moons last.";
            tab.betterEmpDescrip2 = "Works in the empire page";
            tab.betterEmpMain = "Standard ordering";
            tab.betterEmpMoon = "Moons last";
            tab.FPDescrip1 = "Add fleet points as an option in the statistics page.";
            tab.FPDescrip2 = "Works in the statistics page";
            tab.FPAlert = "If this person changed their name and shouldn't be in the stats anymore, press enter.";
            tab.spy = "Espionage";
            tab.closeMessage = "Close this message";

            // Buildings/Research/abm/ipm
            tab.metalMine = "Metal Mine";
            tab.crystalMine = "Crystal Mine";
            tab.deutMine = "Deuterium Synthesizer";
            tab.solarPlant = "Solar Plant";
            tab.fusionReactor = "Fusion Reactor";
            tab.roboticsFactory = "Robotics Factory";
            tab.naniteFactory = "Nanite Factory";
            tab.shipyard = "Shipyard";
            tab.metalStorage = "Metal Storage";
            tab.crystalStorage = "Crystal Storage";
            tab.deutStorage = "Deuterium Storage";
            tab.researchLab = "Research Lab";
            tab.terraformer = "Terraformer";
            tab.alliancedepot = "Alliance Depot";
            tab.advancedLab = "Advanced Lab";
            tab.trainingCenter = "Training center";
            tab.missileSile = "Missile Silo";
            tab.lunarBase = "Lunar Base";
            tab.sensorPhalanx = "Sensor Phalanx";
            tab.jumpGate = "Jump Gate";

            tab.metalProduction  = "Metal production";
            tab.crystalProduction  = "Crystal production";
            tab.deuteriumProduction  = "Deuterium production";
            tab.espionageTechnology  = "Espionage Technology";
            tab.computerTechnology  = "Computer Technology";
            tab.weaponsTechnology  = "Weapons Technology";
            tab.shieldingTechnology  = "Shielding Technology";
            tab.armorTechnology  = "Armor Technology";
            tab.energyTechnology  = "Energy Technology";
            tab.hyperspaceTechnology  = "Hyperspace Technology";
            tab.combustionDrive  = "Combustion Drive";
            tab.impulseDrive  = "Impulse Drive";
            tab.hyperspaceDrive  = "Hyperspace Drive";
            tab.laserTechnology  = "Laser Technology";
            tab.ionTechnology  = "Ion Technology";
            tab.plasmaTechnology  = "Plasma Technology";
            tab.intergalacticResearchNetwork  = "Intergalactic Research Network";
            tab.expeditionTechnology  = "Expedition Technology";
            tab.teachingtechnology  = "Teaching technology";
            tab.consistency  = "Consistency";
            tab.extractorHangar  = "Extractor Hangar";

            tab.abm = "Anti-Ballistic Missiles";
            tab.ipm = "Interplanetary Missiles";
            break;
        default:
            alert("Error with language !");
            return [];
    }

    return tab;
}

/**
 * Maps buildings/research/fleet with their
 * corresponding ids in the merchang page.
 *
 * @returns {{}} Merchant map
 */
function setMerchantMap() {

    console.log("Setting merchant map");
    var m = {};

    // Buildings
    m[L_.metalMine] = 1;
    m[L_.crystalMine] = 2;
    m[L_.deutMine] = 3;
    m[L_.solarPlant] = 4;
    m[L_.fusionReactor] = 12;
    m[L_.roboticsFactory] = 14;
    m[L_.naniteFactory] = 15;
    m[L_.shipyard] = 21;
    m[L_.metalStorage] = 22;
    m[L_.crystalStorage] = 23;
    m[L_.deutStorage] = 24;
    m[L_.researchLab] = 31;
    m[L_.terraformer] = 33;
    m[L_.alliancedepot] = 34;
    m[L_.advancedLab] = 35;
    m[L_.trainingCenter] = 36;
    m[L_.missileSile] = 44;
    m[L_.lunarBase] = 41;
    m[L_.sensorPhalanx] = 42;
    m[L_.jumpGate] = 43;

    // Research
    m[L_.metalProduction] = 101;
    m[L_.crystalProduction] = 102;
    m[L_.deuteriumProduction] = 103;
    m[L_.espionageTechnology] = 106;
    m[L_.computerTechnology] = 108;
    m[L_.weaponsTechnology] = 109;
    m[L_.shieldingTechnology] = 110;
    m[L_.armorTechnology] = 111;
    m[L_.energyTechnology] = 113;
    m[L_.hyperspaceTechnology] = 114;
    m[L_.combustionDrive] = 115;
    m[L_.impulseDrive] = 117;
    m[L_.hyperspaceDrive] = 118;
    m[L_.laserTechnology] = 120;
    m[L_.ionTechnology] = 121;
    m[L_.plasmaTechnology] = 122;
    m[L_.intergalacticResearchNetwork] = 123;
    m[L_.expeditionTechnology] = 124;
    m[L_.teachingtechnology] = 125;
    m[L_.consistency] = 196;
    m[L_.extractorHangar] = 197;

    // Spaceships
    m[L_.small_cargo] = 202;
    m[L_.large_cargo] = 203;
    m[L_.light_fighter] = 204;
    m[L_.heavy_fighter] = 205;
    m[L_.cruiser] = 206;
    m[L_.battleship] = 207;
    m[L_.colony_ship] = 208;
    m[L_.recycler] = 209;
    m[L_.espionage_probe] = 210;
    m[L_.bomber] = 211;
    m[L_.solar_satellite] = 212;
    m[L_.destroyer] = 213;
    m[L_.deathstar] = 214;
    m[L_.battlecruiser] = 215;
    m[L_.supernova] = 216;
    m[L_.massive_cargo] = 217;
    m[L_.collector] = 218;
    m[L_.blast] = 219;
    m[L_.extractor] = 235;

    // Def
    m[L_.rl] = 401;
    m[L_.ll] = 402;
    m[L_.hl] = 403;
    m[L_.gl] = 404;
    m[L_.ic] = 405;
    m[L_.pt] = 406;
    m[L_.ssd] = 407;
    m[L_.lsd] = 408;
    m[L_.ug] = 409;
    m[L_.abm] = 502;
    m[L_.ipm] = 503;

    return m;
}

/**
 * Sets the default userscript info. Not written by
 * me and not really used anymore.
 *
 * @returns {*}
 */
function setInfosVersion() {
    var date = new Date();
    var tab = {};
    tab.version = "4.1";
    tab.language = "fr";
    tab.news = "";
    tab.nbUnis = 18;
    tab.toUp = false;
    tab.lastCheck = date.getTime();
    GM_setValue("infos_version", JSON.stringify(tab));
    return tab;
}

/**
 * Sets the default script states (all set to active)
 *
 * @returns {{}} the list of top-level script options
 */
function setScriptsInfo() {
    console.log("Setting Script Info");
    var list = {};
    list.RConverter = 1;
    list.EasyFarm = 1;
    list.AllinDeut = 1;
    list.Carto = 1;
    list.iFly = 1;
    list.InactiveStats = 1;
    list.GalaxyRanks = 1;
    list.TChatty = 1;
    list.NoAutoComplete = 1;
    list.Markit = 1;
    list.EasyTarget = 1;
    list.GalaxyRanks = 1;
    list.BetterEmpire = 1;
    list.FleetPoints = 1;
    list.More = 1;
    GM_setValue("infos_scripts", JSON.stringify(list));
    return list;
}

/**
 * Sets the default values for the top-level scripts
 *
 * @param uni - current universe
 * @returns {{}} - the script config
 */
function setConfigScripts(uni) {
    if (uni > g_versionInfo.nbUnis) {
        g_versionInfo.nbUnis = uni;
        GM_setValue("infos_version", JSON.stringify(g_versionInfo));
    }

    var list = {};
    if (uni !== 0) // => ingame
    {
        list.RConverter = {};
        list.RConverter.header = "";
        list.RConverter.boom = "";
        list.RConverter.destroyed = "";
        list.RConverter.result = "";
        list.RConverter.renta = "";

        list.EasyFarm = {};
        list.EasyFarm.minPillage = 0;
        list.EasyFarm.colorPill = "871717";
        list.EasyFarm.minCDR = 0;
        list.EasyFarm.colorCDR = "178717";
        list.EasyFarm.defMultiplier = 1;
        list.EasyFarm.granularity = 1000;

        list.EasyTarget = {};
        list.EasyTarget.spyCutoff = 0;
        list.EasyTarget.spyDelay = 0;
        list.EasyTarget.useDoNotSpy = false;

        list.Carto = ""; // No longer used

        list.TChatty = {};
        list.TChatty.color = "FFFFFF";

        list.NoAutoComplete = {};
        list.NoAutoComplete.galaxy = true;
        list.NoAutoComplete.fleet = true;
        list.NoAutoComplete.floten1 = true;
        list.NoAutoComplete.floten2 = true;
        list.NoAutoComplete.build_fleet = true;
        list.NoAutoComplete.build_def = true;
        list.NoAutoComplete.sims = true;
        list.NoAutoComplete.marchand = true;
        list.NoAutoComplete.scrapdealer = true;

        list.Markit = {};
        list.Markit.color = {};
        list.Markit.color["default"] = "FFFFFF";
        list.Markit.color["fridge"] = "30A5FF";
        list.Markit.color["bunker"] = "FF9317";
        list.Markit.color["raidy"] = "44BA1F";
        list.Markit.color["dont"] = "FF2626";
        list.Markit.coord = {};
        list.Markit.ranks = 1;
        list.Markit.topX = 50;
        list.Markit.topColor = "FF2626";

        list.GalaxyRanks = {};
        list.GalaxyRanks.ranks = [5, 25, 50, 200];
        list.GalaxyRanks.values = ['F05151', 'FFA600', 'E8E83C', '2C79DE', '39DB4E'];

        list.BetterEmpire = {};
        list.BetterEmpire.byMainSort = 1;
        list.BetterEmpire.moonsLast = 1;

        list.More = {};
        list.More.moonsList = 1;
        list.More.convertDeut = 1;
        list.More.traductor = 1;
        list.More.resources = 1;
        list.More.redirectFleet = 1;
        list.More.arrows = 1;
        list.More.returns = 1;
        list.More.deutRow = 1;
        list.More.convertClick = 1;
        list.More.mcTransport = 0;
    } else {  // => index / niark / forum
        list.ClicNGo = {};
        list.ClicNGo.universes = [];
        list.ClicNGo.usernames = [];
        list.ClicNGo.passwords = [];

        list.More = {};
        list.More.traductor = 1;
    }

    setValue("configScripts", JSON.stringify(list));
    return list;
}

/**
 * Determine where we are in the game, and what universe we're in.
 *
 * @returns {{}} the page information
 */
function getInfoFromPage() {
    var list = {};
    if (/niark/.test(window.location.href)) {
        list.loc = "niark";
    } else if (/spaceswars\.(?:fr|com)\/forum*/.test(window.location.href)) {
        list.loc = "forum";
    } else if (/spaceswars\.(?:fr|com)\/univers[0-9]{1,2}\/(.*)\.php/.test(window.location.href)) {
        list.loc = /spaceswars\.(?:fr|com)\/univers[0-9]{1,2}\/(.*)\.php/.exec(window.location.href)[1];
    } else if (/spaceswars\.(?:fr|com)/.test(window.location.href)) {
        list.loc = "index";
    }

    list.universe = (/univers([0-9]{1,2})/.test(window.location.href)) ? /univers([0-9]{1,2})/.exec(window.location.href)[1] : 0;
    return list;
}

/**
 * Get dom elements based on an xpath and return a specific result
 *
 * @param xpath - the xpath expression
 * @param inDom - document to search
 * @param row - the row to return (optionally -1 to return all and -42 to return the last)
 * @returns {*} the desired dom element(s)
 */
function getDomXpath(xpath, inDom, row) {
    var tab = [];
    var evalDoc = inDom === lm.document ? lm : f;
    var alltags = evalDoc.document.evaluate(xpath, inDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < alltags.snapshotLength; i++) {
        tab[i] = alltags.snapshotItem(i);
    }
    if (row === -1) return tab;
    if (row === -42) return tab[tab.length - 1];
    else return tab[row];
}

/**
 * Returns a number represented by the given array
 *
 * ["100", "042"] -> 100042
 *
 * @param tab - an array of string digits
 * @returns {Number} The number resulting in parsing the concatenation of @tab
 */
function getNbFromStringtab(tab) {
    return parseInt(tab.join(''));
}

/**
 * Legacy code that might still be relevant if someone is upgrading
 * from before 2012 to the latest.
 */
function checkVersionInfo() {
    // checking...
    if (g_versionInfo && g_versionInfo.version === thisVersion) {
        return;
    }

    // ... 1st install ?
    g_page = getInfoFromPage().loc;
    if (!g_versionInfo) {
        g_versionInfo = setInfosVersion();
        g_scriptInfo = setScriptsInfo();
        // get a message if can't have the gm icon without F5 refresh (frames)
        if (g_versionInfo.version === thisVersion && g_page !== "niark" && g_page !== "index" && g_page !== "forum" && g_page !== "leftmenu" && g_page !== "frames")
            alert("Script installé. Appuyez sur F5.\n\nScript installed. Press F5.");
    }

    // ... just as updating ?
    if (g_versionInfo.version !== thisVersion) {
        console.log("Version mismatch");
        if (!g_versionInfo.version) // 3.8 version
        {
            GM_deleteValue("infos_version");
            GM_deleteValue("infos_scripts");
            GM_deleteValue("options_script0");
            GM_deleteValue("options_script1");
            GM_deleteValue("options_script2");
            GM_deleteValue("options_script3");
            GM_deleteValue("options_script4");
            GM_deleteValue("options_script5");
            GM_deleteValue("options_script6");
            GM_deleteValue("options_script7");
            GM_deleteValue("options_script8");
            g_versionInfo = setInfosVersion();
            g_scriptInfo = setScriptsInfo();

            // get a message if can't have the gm icon without F5 refresh (frames)
            if (g_page !== "niark" && g_page !== "index" && g_page !== "forum" && g_page !== "leftmenu" && g_page !== "frames")
                alert("Script installé. Appuyez sur F5.\n\nScript installed. Press F5.");
        }
        if (g_versionInfo.version === "4.0") {
            GM_deleteValue("configScripts0");
            setConfigScripts(0);
            for (var i = 1; i <= 17; i++) {
                var config;
                try {
                    config = JSON.parse(GM_getValue("configScripts" + i));
                } catch (ex) {
                    config = null;
                }
                if (config) {
                    config.Markit.topX = 50;
                    config.Markit.topColor = "FF2626";
                    config.More.returns = 1;
                    config.EasyFarm.colorPill = "871717";
                    config.EasyFarm.colorCDR = "178717";
                    config.TChatty.color = "FFFFFF";
                    config.Markit.color["default"] = "FFFFFF";
                    config.Markit.color["fridge"] = "30A5FF";
                    config.Markit.color["bunker"] = "FF9317";
                    config.Markit.color["raidy"] = "44BA1F";
                    config.Markit.color["dont"] = "FF2626";
                    GM_setValue("configScripts" + i, JSON.stringify(config));
                }
            }
            g_versionInfo = setInfosVersion();

            // get a message if can't have the gm icon without F5 refresh (frames)
            g_page = getInfoFromPage().loc;
            if (g_page !== "niark" && g_page !== "index" && g_page !== "forum" && g_page !== "leftmenu" && g_page !== "frames") {
                alert("Script mis à jour.\n\nScript updated.");
            }
        }
    }
}

/**
 * Grab the universe config, or a default config if none is found
 *
 * @returns {*}
 */
function getConfig() {

    console.log("Grabbing uni" + g_uni + " config");
    var config;
    try {
        config = JSON.parse(getValue("configScripts"));
        if (!config)
            config = setConfigScripts(g_uni);
    } catch (ex) {
        config = setConfigScripts(g_uni);
    }

    return config;
}

/**
 * Grab the universe player database
 * @returns {*}
 */
function getGalaxyData() {
    if (g_galaxyData)
        return g_galaxyData;

    var storage;
    try {
        console.log("Grabbing galaxyData_" + g_uni + " from storage");
        storage = JSON.parse(getValue("galaxyData"));

        if (!storage || !storage.universe || !storage.players) storage = {
            'universe': {},
            'players': {}
        };
    } catch (ex) {
        storage = {
            'universe': {},
            'players': {}
        };
    }

    var oldData = false;
    for (var key in storage.universe) {
        if (storage.universe.hasOwnProperty(key)) {
            if (key.indexOf(":") !== -1) {
                oldData = true;
                break;
            }
        }
    }

    if (oldData) {
        if (confirm("It looks like your galaxy data is not in the latest format. Would you like to attempt to convert it? If not, it will be erased.")) {
            storage = convertOldGalaxyData(storage);
        } else {
            storage = {
                'universe': {},
                'players': {}
            };
        }

        setValue("galaxyData", JSON.stringify(storage));
    }

    // Convert everything to an integer one time here for ease of use later
    for (var player in storage.players) {
        if (!storage.players.hasOwnProperty(player)) {
            continue;
        }

        for (var i = 0; i < storage.players[player].length; i++) {
            storage.players[player][i] = parseInt(storage.players[player][i]);
        }
    }

    return storage;
}

function convertOldGalaxyData(storage) {
    var newStorage = {};
    var newUni = {};
    var newPlayers = {};
    var uni = storage.universe;
    for (var key in uni) {
        if (uni.hasOwnProperty(key)) {
            var coord = new Coordinates(key);
            var player = uni[key];
            if (!newUni[coord.g]) {
                newUni[coord.g] = {};
            }

            if (!newUni[coord.g][coord.s]) {
                newUni[coord.g][coord.s] = {};
            }

            newUni[coord.g][coord.s][coord.p] = player;
        }
    }
    var players = storage.players;
    for (key in players) {
        if (!players.hasOwnProperty(key)) {
            continue;
        }

        var planets = players[key][0];
        newPlayers[key] = [];
        for (var i = 0; i < planets.length; i++) {
            var coords = new Coordinates(planets[i]);
            newPlayers[key].push(storageFromCoords(coords) | (players[key][1].indexOf(coords.str) !== -1 ? 1 : 0));
        }
    }

    newStorage.universe = newUni;
    newStorage.players = newPlayers;
    return newStorage;
}

/**
 * Grab the doNotSpy data for the universe
 * @returns {*}
 */
function getDoNotSpyData() {

    // Build up a list of planets we should avoid spying next time because
    // they have very little resources
    var doNotSpy;
    try {
        console.log("Grabbing doNotSpy_uni" + g_uni + " from storage");
        doNotSpy = JSON.parse(getValue("doNotSpy"));
    } catch (ex) {
        // Create a new Array[8][500][16]
        // TODO: What if there are more than 8 galaxies? Also, why +1?
        doNotSpy = new Array(8);
        for (var i = 0; i < 8; i++) {
            doNotSpy[i] = new Array(500);
            for (var j = 0; j < 500; j++) {
                doNotSpy[i][j] = new Array(16);
            }
        }
    }

    return doNotSpy;
}

/**
 * Grab the fleetPoints list
 * @returns {*}
 */
function getFleetPointsData() {
    var fp;
    try {
        console.log("grabbing fp uni" + g_uni);
        fp = JSON.parse(getValue("fleetPoints"));
        if (!fp) fp = {
            "1": {},
            "2": {},
            "3": {}
        };
    } catch (err) {
        fp = {
            "1": {},
            "2": {},
            "3": {}
        };
    }

    return fp;
}

/**
 * Grab the list of inactive players
 * @returns {*}
 */
function getInactiveList() {
    var lst;
    try {
        console.log("Grabbing InactiveList_" + g_uni);
        lst = JSON.parse(getValue("inactiveList"));
        if (!lst)
            lst = {};
    } catch (err) {
        lst = {};
    }

    return lst;
}

/**
 * Grab the markit data
 * @returns {*}
 */
function getMarkitData() {
    var markit;
    try {
        console.log("grabbing markitData_" + g_uni + " from storage");
        markit = JSON.parse(getValue("markitData"));
        if (!markit) markit = {};
    } catch (err) {
        markit = {};
    }

    return markit;
}

/**
 * Grab the information on the scripts
 * @returns {{}}
 */
function getScriptInfo() {

    console.log("grabbing infos_scripts");
    var info;
    try {
        info = JSON.parse(getValue("infos_scripts"));
        if (!info) {
            info = setScriptsInfo();
        }
    } catch (ex) {
        info = setScriptsInfo();
    }

    return info;
}

/**
 * Sets up the necessary bits in the persistent sidebar (leftmenu)
 */
function setupSidebar() {
    // NV for SW ?
    if (!lm.document.getElementsByClassName("lm_lang")[0]) {
        alert("Post on the forum (http://spaceswars.com/forum/viewforum.php?f=219)\r\nwith this message :\t'lang_box problem'\r\nThanks.\r\nNiArK");
        return;
    }
    // get lang
    var logoutBox = getDomXpath("//a[@href='logout.php']", lm.document, 0);
    if (logoutBox.innerHTML === "Logout") {
        g_versionInfo.language = "en";
    } else {
        g_versionInfo.language = "fr";
    }
    GM_setValue("infos_version", JSON.stringify(g_versionInfo));
    g_lang = g_versionInfo.language;

    // gm_icon
    var langBox = getDomXpath("//div[@class='lm_lang']", lm.document, 0);
    var gmIcon = buildNode("div", ["class", "style"], ["lm_lang", "float:right; margin-right:5px;"],
        "<a href='achatbonus.php?lang=" + g_lang + "&uni=" + g_uni +
        "&config=1' target='Hauptframe' title='Scripts_SpacesWars_Corrigé'>" + "<img width='16px' height='16px' src='" + GM_ICON + "' alt='GM'/></a>");
    langBox.appendChild(gmIcon);

    var sfmCheck = buildNode("input", ["type", "id"], ["checkbox", "sfmCheck"], "");
    var aaCheck = buildNode("input", ["type", "id"], ["checkbox", "aaCheck"], "");

    if (!g_saveEveryTime) {
        var saveData = buildNode("input", ["type", "style", "value"],
            ["button", "width:16px;margin-left:4px;", "S"],
            "", "click", function() {
                changeHandler(true /*forceSave*/);
            });
    }

    sfmCheck.onchange = function() {
        setValue("spyForMe", this.checked ? 1 : 0);
        autoAttackWithSim = this.checked;
        deleteValue("simBlasts");
        deleteValue("autoSimIndex");
        deleteValue("autoAttackBlasts");
    };

    // Reset values when toggling autoAttack to
    // prevent unwanted redirections/actions
    aaCheck.onchange = function() {
        setValue("autoAttackMasterSwitch", this.checked ? 1 : 0);
        autoAttack = this.checked && usingOldVersion();
        advancedAutoAttack = autoAttack;
        if (!autoAttack) {
            deleteValue("autoAttackStartIndex");
            deleteValue("autoAttackWaves");
            deleteValue("autoAttackMC");
            setValue("autoAttackIndex", -1);
        }

        deleteValue("simBlasts");
        deleteValue("autoSimIndex");
        deleteValue("autoAttackBlasts");
        deleteValue("autoSpyLength");
        deleteValue("fullGalaxySpy");
    };

    if (usingOldVersion()) {
        langBox.appendChild(sfmCheck);
        langBox.appendChild(aaCheck);
    } else if (saveData) {
        saveData.value = "Save";
        saveData.style.width = "40px";
    }
    if (!g_saveEveryTime)
        langBox.append(saveData);

    sfmCheck.checked = autoAttackWithSim ? "checked" : "";
    aaCheck.checked = autoAttack ? "checked" : "";
}

/**
 * Processes keyboard input. Some pages have specialized processing,
 * but there are also global handlers
 *
 * [ - Previous Planet
 * ] - Next Planet
 *
 * SHIFT +
 *     O - Overview
 *     G - Galaxy
 *     F - Fleet
 *     E - Empire/Imperium
 *     B - Buildings
 *     R - Research
 *     S - Shipyard
 *     M - Messages
 *     D - Defenses
 *     C - Vote1
 *     V - Vote2
 *     P - Toggle between planet/moon
 *
 * SHIFT + ALT +
 *     M - Convert to metal
 *     D - Convert to deut
 *
 * @param e
 */
function globalShortcutHandler(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (isTextInputActive()) {
        return;
    }

    if (key === KEY.ESC) {
        g_keyArray.length = 0;
    }

    var target = "";
    if (e.shiftKey && !e.ctrlKey) {
        switch (key) {
            case KEY.O:
                target = "overview.php";
                break;
            case KEY.G:
                target = "galaxy.php";
                break;
            case KEY.F:
                target = "fleet.php";
                break;
            case KEY.E:
                target = "imperium.php";
                break;
            case KEY.B:
                target = "buildings.php";
                break;
            case KEY.R:
                target = "research.php";
                break;
            case KEY.S:
                target = "build_fleet.php";
                break;
            case KEY.M:
                if (e.altKey)
                    window.parent.frames[1].document.getElementById("metalClick").click();
                else
                    target = "messages.php";
                break;
            case KEY.D:
                if (e.altKey)
                    window.parent.frames[1].document.getElementById("deutClick").click();
                else
                    target = "build_def.php";
                break;
            case KEY.V:
                var vote = f.document.getElementById("avote2");
                if (vote) {
                    vote.childNodes[0].click();
                }
                break;
            case KEY.C:
                var vote2 = f.document.getElementById("avote1");
                if (vote2) {
                    vote2.childNodes[0].click();
                }
                break;
            case KEY.P:
                var current = f.document.querySelector("option[value='" + f.document.getElementById("cp").value + "']");
                var place = current.innerHTML;
                place = place.replace(/&nbsp;/g, '');
                place = place.match(/\[\d:\d{1,3}:\d{1,2}\]/)[0];
                var options = f.document.querySelectorAll("#cp option");
                for (var i = 0; i < options.length; i++) {
                    if (options[i].innerHTML.indexOf(place) !== -1 && options[i] !== current) {
                        options[i].selected = 'selected';
                        f.document.forms[0].submit();
                        return;
                    }
                }

                displayAlert("This planet does not have a moon", 400, 1000);
                break;
            default:
                break;
        }
    } else {
        // Need to use window.parent.frames[1] in case we're focused on leftmenu,
        // which happens quite a bit.
        switch (key) {
            case KEY.OPEN_BRACKET:
                window.parent.frames[1].document.getElementById("previousplanet").click();
                break;
            case KEY.CLOSE_BRACKET:
                window.parent.frames[1].document.getElementById("nextplanet").click();
                break;
            default:
                break;
        }

        var active = f.document.activeElement;

        // If we're in an input field, use m/b/t for quick number expansion
        if (active.tagName.toLowerCase() === "input") {
            if (key === KEY.M) {
                if (!parseInt(active.value) && (g_page === "build_fleet" || g_page === "build_def")) {
                    makeEven(active, 1E6);
                } else if (active.value && g_page !== "floten1") {
                    active.value = parseFloat(active.value) * 1E6;
                }
            } else if (key === KEY.B) {
                if (!parseInt(active.value) && (g_page === "build_fleet" || g_page === "build_def")) {
                    makeEven(active, 1E9);
                } else if (active.value) {
                    active.value = parseFloat(active.value) * 1E9;
                }
            } else if (key === KEY.T) {
                if (!parseInt(active.value) && (g_page === "build_fleet" || g_page === "build_def")) {
                    makeEven(active, 1E12);
                } else if (active.value) {
                    active.value = parseFloat(active.value) * 1E12;
                }
            } else if (key === KEY.SPACE && active.value) {
                active.value = Math.ceil(parseFloat(active.value));
            }
        }
    }

    // If a shift+* combo was made, redirect
    // if it's valid
    if (target.length > 0) {
        window.open(target, "Hauptframe");
    } else if (e.shiftKey && key) {
        // Bad Shift+key combo
        g_keyArray.length = 0;
    }

    // Page specific handling
    switch (g_page) {
        case "build_fleet":
            buildFleetKeyHandler(key);
            break;
        case "leftmenu":
            lm.document.getElementById("keystrokes").innerHTML = g_keyArray.join(" + ");
            break;
        case "fleet":
            fleetKeyHandler(e);
            break;
        case "floten1":
            // N to go to the last selected planet
            if (!e.shiftKey) {
                if (key === KEY.N) {
                    f.$('.flotte_2_4 a')[0].click();
                    setTimeout(function() {
                        f.$('input[type=submit]')[0].click();
                    }, 200);
                } else if (key === KEY.M) {
                    e.preventDefault();
                    f.$("#planettype option:eq(2)").prop("selected", true);
                } else if (key === KEY.H) {
                    e.preventDefault();
                    f.$("#planettype option:eq(1)").prop("selected", true);
                }
            }
            break;
        case "floten2":
            // A for all resources, N for none, S to submit
            if (!e.shiftKey) {
                if (key === KEY.A) {
                    f.$('.flotte_bas .space a')[3].click();
                } else if (key === KEY.N) {
                    f.$('input[type=text]').val('');
                    f.$('.flotte_bas .space a')[2].click();
                } else if (key === KEY.S) {
                    f.$('input[type=submit]')[0].click();
                }
            }
            break;
        case "messages":
            if (!e.shiftKey && !e.ctrlKey)
                messagePageKeyHandler(key);
            break;
        case "build_def":
            buildDefKeyHandler(key);
            break;
        case "galaxy":
            if (key === KEY.ESC) {
                f.$('#markit_choose').fadeOut(750);
            }
            break;
        case "vote":
            // V on vote page to submit vote
            if (!e.ctrlKey && !e.altKey && key === KEY.V) {
                var voteLink = f.$("a.linkgreen");
                if (voteLink) {
                    voteLink[1].click();
                }
            }
            break;
        default:
            break;
    }
}

/**
 * Fill the input field to build enough fleet/defenses to
 * make the total amount even.
 *
 * e.g. if value = 1.000.000 and I currently have 9.876.543
 * of a given item, the element will be filled with 123.457,
 * which will give me a total amount of 10.000.000
 * @param active
 * @param value
 */
function makeEven(active, value) {
    var span = f.$(active.parentNode.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1]).find("span")[0];
    if (span) {
        var num = parseInt(span.innerHTML.match(/([\d.]+)\)/)[1].replace(/\./g, ''));
        if (num) {
            active.value = value - (num % value);
        }
    }
}

/**
 * Display a large alert with the given text on the screen. The message
 * can either fade out after the given time or persist, and only go away
 * when clicked
 *
 * @param text
 * @param fadeTime
 * @param timeout
 */
function displayAlert(text, fadeTime, timeout) {
    if (f.document.getElementById("displayAlert")) {
        f.document.body.removeChild(f.document.getElementById("displayAlert"));
    }

    var div = buildNode("div", ["id", "class", "style"], ["displayAlert", "space1 curvedtot",
            "font-size:14pt;border:3px solid #ccc;opacity:0;text-align:center;vertical-align:middle;" +
            "line-height:100px;height:100px;z-index:999;color:red;position:fixed;left:50%;top:50%;" +
            "width:500px;margin-left:-250px;margin-top:-400px;"],
        text);

    f.document.body.appendChild(div);
    f.$(div).fadeTo(fadeTime, 0.7);

    if (timeout === -1) {
        div.addEventListener("click", function() {
            f.$(this).fadeOut(500, function() {
                f.document.body.removeChild(f.document.getElementById("displayAlert"));
            });
        });
    } else {
        setTimeout(function (fadeTime) {
            var bod = f.document.body;
            if (bod.children[bod.children.length - 1] === div) {
                f.$(div).fadeOut(fadeTime, function () {
                    if (bod === f.document.body) {
                        bod.removeChild(bod.children[bod.children.length - 1]);
                    }
                });
            }
        }, timeout, fadeTime)
    }
}

/**
 * Goes to the desired input given the input map. If the input field cannot
 * be found, attempt to scroll the div into view. If the div cannot be found,
 * flash a message stating as much.
 *
 * @param map
 */
function inputSelector(map) {

    var element = map[g_keyArray.join("")];

    if (element) {
        g_keyArray.length = 0;
        var input = f.$("input[name=" + element[0] + "]");
        if (input && input.length > 0) {
            input.focus().val("");
            return;
        }

        input = f.$("a:contains('" + element[1] + "')");
        if (input && input.length > 0) {
            input.parent().parent().parent()[0].scrollIntoView();
            return;
        }

        // Otherwise, give a brief message stating that it doesn't exist
        displayAlert(element[1] + " could not be found", 500, 2000);
    }
}

/** Handles keyboard input from the build_fleet page
 *
 * SC : Small Cargo,     LC : Large Cargo, LF : Light Fighter,   HF : Heavy Fighter
 * CR : CRuiser,         BS : BattleShip,  CS : Colony Ship,     RE : REcycler,
 * EP : Espionage Probe, BM : BoMber,      SS : Solar Satellite, DE : DEstroyer,
 * DS : DeathStar,       SN : SuperNova    MC : Massive Cargo,   HR : Heavy Recycler,
 * BL : BLast,           EX : EXtractor
 */
function buildFleetKeyHandler(key) {
    if (key !== KEY.ESC)
        g_keyArray.push(String.fromCharCode(key));

    if (g_keyArray.length > 2) {
        // build_fleet has a max length of 2. reset if we go above it.
        g_keyArray.length = 0;
    }

    lm.$("#keystrokes").text(g_keyArray.join(" + "));
    var combos = [ "SC", "LC", "LF", "HF", "CR", "BS", "CS", "RE", "EP", "BM", "SS", "DE", "DS", "BC", "SN", "MC", "HR", "BL", "EX" ];
    var map = {};
    for (var i = 0; i < 19; i++) {
        map[combos[i]] = [i + 202, g_fleetNames[i]];
    }

    inputSelector(map);
}

/**
 * Handles keyboard input from the build_def page
 *
 * (R)ocket (L)auncher, (L)ight (L)aser,   (H)eavy (L)aser, (G)uass (C)annon.
 * (I)on (C)annon,      (P)lasma (T)urret, (S)mall Shield   (D)ome, (L)arge Shield (D)ome,
 * (A)nti-(B)allastic Missiles,            (I)nter(P)lanetary Missiles
 */
function buildDefKeyHandler(key) {
    if (key !== KEY.ESC)
        g_keyArray.push(String.fromCharCode(key));

    if (g_keyArray.length > 2) {
        // build_fleet has a max length of 2. reset if we go above it.
        g_keyArray.length = 0;
    }

    lm.$("#keystrokes").text(g_keyArray.join(" + "));
    var combos = [ "RL", "LL", "HL", "GC", "IC", "PT", "SD", "LD", "UG", "AB", "IP" ];
    var ids = [ 401, 402, 403, 404, 405, 406, 407, 408, 409, 502, 503 ];
    var map = {};
    for (var i = 0; i < ids.length; i++) {
        map[combos[i]] = [ids[i], g_defNames[i]];
    }

    inputSelector(map);
}

/**
 * Handles keyboard input from the messages page
 *
 * S - Spy
 * P - Player
 * A - Alliance
 * C - Combat
 * H - Harvest
 * T - Transport
 * E - Extraction
 * M - Missiles
 * L - alL
 *
 * DM - Delete Marked
 * DU - Delete Unmarked
 * DP - Delete all on Page
 * DA - Delete All
 *
 * TAB/Down Arrow       - Next message
 * SHIFT + TAB/Up Arrow - Previous Message
 * Right Arrow          - Expand message
 * Left Arrow           - Collapse message
 * X                    - Toggle message checked
 *
 * Spy Page
 * F - Focus alternate attack input field
 * Q - Simulate
 * Z - autoSim
 * @param key
 */
function messagePageKeyHandler(key) {
    var target = -1;
    var active = f.document.activeElement;
    var messages, currentIndex, i;
    switch (key) {
        case KEY.TAB:
            if (active.className.toLowerCase() !== "message_space0 curvedtot") {
                f.$(".message_2a > .message_space0.curvedtot")[0].focus();
            }
            break;
        case KEY.DOWN:
            messages = f.$(".message_2a > .message_space0.curvedtot");
            if (active.className.toLowerCase() !== "message_space0 curvedtot") {
                messages[0].focus();
            } else {
                currentIndex = 0;
                for (i = 0; i < messages.length; i++) {
                    if (active === messages[i]) {
                        currentIndex = i;
                        break;
                    }
                }
                if (currentIndex !== messages.length - 1) {
                    messages[currentIndex + 1].focus();
                }
            }
            break;
        case KEY.UP:
            messages = f.$(".message_2a > .message_space0.curvedtot");
            if (active.className.toLowerCase() !== "message_space0 curvedtot") {
                messages[messages.length - 1].focus();
            } else {
                currentIndex = 0;
                for (i = 0; i < messages.length; i++) {
                    if (active === messages[i]) {
                        currentIndex = i;
                        break;
                    }
                }
                if (currentIndex !== 0)
                    messages[currentIndex - 1].focus();
            }
            break;
        case KEY.RIGHT:
            if (active.className.toLowerCase() === "message_space0 curvedtot") {
                active.childNodes[1].click();
            }
            break;
        case KEY.LEFT:
            if (active.className.toLowerCase() === "message_space0 curvedtot") {
                f.$(active).find("div:contains('" + L_.closeMessage + "')")[1].click();
            }
            break;
        case KEY.X:
            if (active.className.toLowerCase() === "message_space0 curvedtot") {
                var checkbox = f.$(active).find(".checkbox");
                checkbox[0].checked = !checkbox[0].checked;
            }
            break;
        case KEY.F:
            if (active.className.toLowerCase() === "message_space0 curvedtot" && usingOldVersion()) {
                // Expand and focus
                active.childNodes[1].click();
                f.$(active).find(".supFleet").focus();
            }
            break;
        case KEY.S:
            target = 0;
            break;
        case KEY.P:
            if (g_keyArray[0] === "D") {
                deleteMessages(2 /*deleteType*/);
            } else {
                target = 1;
            }
            break;
        case KEY.A:
            if (g_keyArray[0] === "D") {
                deleteMessages(3 /*deleteType*/);
            } else {
                target = 2;
            }
            break;
        case KEY.C:
            target = 3;
            break;
        case KEY.H:
            target = 4;
            break;
        case KEY.T:
            if (active.tagName.toLowerCase() !== "input") {
                target = 5;
            }
            break;
        case KEY.E:
            target = 6;
            break;
        case KEY.M:
            if (g_keyArray[0] === "D") {
                deleteMessages(0 /*deleteType*/);
            } else if (active.tagName.toLowerCase() !== "input") {
                target = 7;
            }
            break;
        case KEY.L:
            target = 8;
            break;
        case KEY.U:
            if (g_keyArray[0] === "D") {
                deleteMessages(1 /*deleteType*/);
            }
            g_keyArray.length = 0;
            break;
        case KEY.D:
            g_keyArray.length = 1;
            g_keyArray[0] = "D";
            break;
        case KEY.Q:
            // Simulate with Q, since keys that make sense are taken,
            // and it's easy to press with the left hand
            if (active.className.toLowerCase() === "message_space0 curvedtot") {
                deleteValue("autoSim");
                f.$(active.childNodes[3]).find("a:contains('Simule')")[0].click();
            }
            break;
        case KEY.Z:
            if (usingOldVersion() && active.className.toLowerCase() === "message_space0 curvedtot") {
                setValue("autoSim", 1);
                setValue("autoSimIndex", f.$(active).find(".supFleet")[0].id.substring(8));
                f.$(active.childNodes[3]).find("a:contains('Simule')")[0].click();
            }
            break;
        default:
            break;

    }

    if (target >= 0) {
        f.$(".message_button1 a")[target].click();
        g_keyArray.length = 0;
    }
}

/**
 * Delete messages based on the given deleteType
 *
 * 0 - Marked
 * 1 - Unmarked
 * 2 - Page
 * 3 - All
 *
 * @param deleteType
 */
function deleteMessages(deleteType) {
    g_keyArray.length = 0;
    f.$("#deletemessages1>option:eq(" + deleteType + ")").prop("selected", true);
    f.$("#deletemessages2>option:eq(" + deleteType + ")").prop("selected", true);
    // Sometimes if we go immediately, things haven't registered yet
    setTimeout(function() {
        if (f.$("input[type=submit]")) {
            f.$("input[type=submit]")[0].click();
        }
    }, 100);
}


/**
 * Handles key input on the fleet page
 *
 * SHIFT + T  - Select the number of MC needed to transport all resources, iff mcTransport is active
 * A          - Select all of the given ship
 * X          - Select none of the given ship
 * UP         - Select the previous ship
 * DN         - Select the next ship
 *
 * @param e
 */
function fleetKeyHandler(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key !== KEY.ESC)
        g_keyArray.push(String.fromCharCode(key));

    var active = f.document.activeElement;
    if (g_config.More.mcTransport && key === KEY.T && e.shiftKey) {
        f.$('#transport').click();
        f.$('input[type=submit]')[0].click();
    } else if (active.tagName.toLowerCase() === "input" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        if (key === KEY.A) {
            active.value = active.parentNode.parentNode.childNodes[1].childNodes[0].innerHTML.replace(/\./g, "");
        } else if (key === KEY.X) {
            active.value = "";
        } else if (key === KEY.DOWN || key === KEY.UP) {
            var currentIndex = 0;
            var options = f.$(".current_ship_selected:visible");
            for (var i = 0; i < options.length; i++) {
                if (options[i] === active) {
                    currentIndex = i;
                    break;
                }
            }

            // Can't go up/down if we're at the end of the list
            if (key === KEY.DOWN && currentIndex < options.length - 1 || key === KEY.UP && currentIndex > 0) {
                f.$(options[currentIndex + (key === KEY.DOWN ? 1 : -1)]).focus();
            }
        }
    }
}

/**
 * Returns whether the given key is an alpha key
 * @param key
 * @returns {boolean}
 */
function isAlphaKey(key) {
    return key >= KEY.A && key <= KEY.Z;
}

/**
 * As the name implies, sets up keyboard shortcuts
 * that can be used on any page (that makes sense)
 */
function setGlobalKeyboardShortcuts() {
    if (canLoadInPage("navigatorShortcuts")) {
        document.addEventListener('keyup', function(e) {
            globalShortcutHandler(e);
        });
        document.addEventListener('keydown', function(e) {
            globalKeypressHandler(e);
        });
    }
}

/**
 * Not really the globalKeypressHandler anymore, but
 * prevents default behavior to allow E calculations
 * @param e
 */
function globalKeypressHandler(e) {
    if (g_page === "build_fleet" || g_page === "build_def" || g_page === "fleet" || g_page === "floten1") {
        if (isAlphaKey(e.keyCode) && !e.ctrlKey && !e.altKey && e.keyCode !== KEY.E) { // Allow exponential calculations (2E9, 1.1E6, etc)
            e.preventDefault();
        }
    }
}

/**
 * Determine if keyboard shortcuts should be ignored because
 * we're in an excluded input field
 * @returns {boolean}
 */
function isTextInputActive() {
    var active = f.document.activeElement;
    // if the element is not null and the element has a
    // restricted id or name, return true
    return active !== null
        && (g_textAreas.indexOf(active.id) !== -1
            || g_invalidNameFields.indexOf(active.name) !== -1);
}

/**
 * Pretty sure this is broken. Used to be a universe manager of sorts
 * in the index page. Maybe I'll get around to fixing it, but I don't
 * really have any use for it. This is some of the oldest code that has
 * largely been untouched.
 */
function loadClickNGo() {
    f.document.getElementsByTagName("body")[0].appendChild(buildNode("script", [
        "type"
    ], ["text/javascript"], function putLogs(uni, pseudo, pass) {
        document.getElementById("login_univers").value = uni;
        document.getElementById("login_pseudo").value = pseudo;
        document.getElementById("login_password").value = pass;
        document.getElementById("login_submit").disabled = "";
        document.getElementById("form_login").submit();
    }));
    var clicngo = buildNode("div", ["style", "id"], ["float:right;cursor:pointer;padding:4px 0 0 4px;", "clicngo"],
        "<img src='" + scriptsIcons + "Clic&Go/connecting_people.png'/>");

    // noinspection JSAnnotator
    var script = buildNode("script", ["type"], ["text/javascript"],
        "$('#clicngo').click(function(){$('#clicngo_contents').css('display','block');$('body').css('opacity', '0.2');});");

    var div = buildNode("div", ["style", "id"], ["padding:5px;font:12px Times New Roman normal;width:40%;display:none;background-color:black" +
    "color:white;border-radius:5px 5px 5px 5px;border:1px solid white;position:absolute;top:10%;left:30%;",
        "clicngo_contents"
    ], "");

    f.document.body.parentNode.appendChild(div);

    clicngo.appendChild(script);
    getDomXpath("id('top_login_div')/div", f.document, 0).appendChild(clicngo);
    var clicngoContents = f.document.getElementById("clicngo_contents");
    var html = "<div onclick='$(\"#clicngo_contents\").css(\"display\",\"none\");$(\"body\").css(\"opacity\", \"1\");'" +
        " style='padding-bottom:5px;cursor:pointer;text-align:center;color:#A6FF94;border-bottom:1px solid white;font-weight:bold;'>Clic & Go !</div>";
    html += "<div id='clicngo_id'></div>";
    html += "<div style='width:50%;border-bottom:1px solid white;margin:10px 0 10px 0;'></div>";
    html += "<div><input id='remove_nb' onclick='this.value=\"\";' value='#' style='width:20px;border:1px solid #545454;height:15px;padding:1px;" +
        "vertical-align:middle;background-color:black;border-radius:5px 5px 5px 5px;color:#CDD7F8;font:13px Times New Roman normal;margin:5px 5px 1px 2px;text-align:center;'/>";
    html += "<img id='remove_submit' style='cursor:pointer;position:relative;top:7px;' src='" + scriptsIcons + "Clic&Go/remove.png' alt='remove'/></div>";
    html += "<div><select id='add_universe'  style='border:1px solid #545454;height:20px;padding:1px;" +
        "vertical-align:middle;background-color:black;border-radius:5px 5px 5px 5px;color:#CDD7F8;font:13px Times New Roman normal;margin:5px 0 1px 2px;text-align:center;'>";

    var i;
    for (i = 0; i < nbUnis; i++)
        html += "<option value=" + (i + 1) + ">" + L_["ClicNGo_universe"] + " " + (i + 1) + "</option>";
    html += "<input id='add_username' onclick='this.value=\"\";' value='" +
        L_["ClicNGo_username"] +
        "' style='border:1px solid #545454;height:15px;padding:1px;vertical-align:middle;background-color:black;border-radius:5px 5px 5px 5px;" +
        "color:#CDD7F8;font:13px Times New Roman normal;margin:5px 0 1px 2px;text-align:center;'/>";
    html += "<input id='add_password' onclick='this.value=\"\";'  type='password' value='password' style='border:1px solid #545454;height:15px;padding:1px;" +
        "vertical-align:middle;background-color:black;border-radius:5px 5px 5px 5px;color:#CDD7F8;font:13px Times New Roman normal;margin:5px 0 1px 2px;text-align:center;'/>";
    html += "<img id='add_submit' style='cursor:pointer;position:absolute;' src='" +
        scriptsIcons + "Clic&Go/add.png' alt='add'/></div>";
    clicngoContents.innerHTML += html;

    function insertClicNGoContents() {
        for (i = 0; i < g_config.ClicNGo.universes.length; i++) {
            div = buildNode("div", ["id", "name", "style"], ["clicngo_" + i, "clicngo_" + i, "margin:5px;"], "#" + (i + 1) + ": " + g_config.ClicNGo.usernames[i] +
                " (" + L_["ClicNGo_universe"] + " " + g_config.ClicNGo.universes[i] + ")");
            f.document.getElementById("clicngo_id").appendChild(div);
        }
        for (i = 0; i < g_config.ClicNGo.universes.length; i++) {
            var img = buildNode("img", ["name", "src", "alt", "style"], ["clicngo_" + i, scriptsIcons +
            "Clic&Go/login.png", "go", "margin-left:5px;cursor:pointer;position:absolute;"
            ], "");
            img.addEventListener("click", function() {
                var index = /clicngo_(\d*)/.exec(this.name)[1];
                f.document.getElementById("login_univers").value = g_config.ClicNGo.universes[index];
                f.document.getElementById("login_pseudo").value = g_config.ClicNGo.usernames[index];
                f.document.getElementById("login_password").value = g_config.ClicNGo.passwords[index];
                f.document.getElementById("login_submit").click();
            }, false);
            f.document.getElementById("clicngo_" + i).appendChild(img);
        }
    }
    insertClicNGoContents();
    f.document.getElementById("add_submit").addEventListener("click", function() {
        var index = g_config.ClicNGo.universes.length;
        if (isNaN(parseInt(f.document.getElementById("add_universe").value)))
            return false;
        g_config.ClicNGo.universes[index] = parseInt(f.document.getElementById("add_universe").value);
        g_config.ClicNGo.usernames[index] = f.document.getElementById("add_username").value;
        g_config.ClicNGo.passwords[index] = f.document.getElementById("add_password").value;
        //localStorage["config_script_uni_0"] = JSON.stringify(config);
        setValue("configScripts0", JSON.stringify(g_config));
        f.document.getElementById("clicngo_id").innerHTML = "";
        insertClicNGoContents();
    }, false);

    f.document.getElementById("remove_submit").addEventListener("click", function() {
        if (isNaN(parseInt(f.document.getElementById("add_universe").value)))
            return false;
        var nb = parseInt(f.document.getElementById("remove_nb").value);
        g_config.ClicNGo.universes.splice(nb - 1, 1);
        g_config.ClicNGo.usernames.splice(nb - 1, 1);
        g_config.ClicNGo.passwords.splice(nb - 1, 1);
        GM_setValue("configScripts0", JSON.stringify(g_config));
        //localStorage["configScripts+_uni_0"] = JSON.stringify(config);
        f.document.getElementById("clicngo_id").innerHTML = "";
        insertClicNGoContents();
    }, false);

}

/**
 * If we're coming from an autoAttack and are on the general
 * messages page, redirect to spy messages
 */
function checkEasyFarmRedirect() {
    if (parseInt(getValue("redirToSpy")) === 1) {
        deleteValue("redirToSpy");
        var aLinks = f.document.getElementsByTagName("a");
        for (var i = 0; i < aLinks.length; i++) {
            if (aLinks[i].href.indexOf("messcat=0") !== -1) {
                aLinks[i].click();
            }
        }
    }
}

/**
 * Highlights spy reports that have lots of resources/fleet,
 * among other things
 */
function loadEasyFarm() {
    checkEasyFarmRedirect();
    var fleetDeut = [1500, 4500, 1250, 3500, 8500, 18750, 12500, 5500, 500, 25000, 1000, 40000, 3250000, 27500, 12500000, 3750000, 55000, 71500, 37500];

    var optionTexts = [g_fleetNames[17], g_fleetNames[14], g_fleetNames[11]];
    var optionValues = [g_merchantMap.Blast, g_merchantMap.Supernova, g_merchantMap.Destroyer];

    var needsSim = [];
    var simBlasts;
    var simIndex;
    simBlasts = getValue("simBlasts");
    var startIndex = 0;
    if (autoAttack && autoAttackWithSim) {
        // Start the autoAttack search from a different index
        // if we've autoSimed the first n and we don't have
        // enough ships for a total victory
        var storedIndex = getValue("autoAttackStartIndex");
        if (!storedIndex) {
            startIndex = 0;
        } else {
            startIndex = parseInt(storedIndex);
        }
    }

    // Increment the start index if we determined
    // we can't win the current fight
    if (simBlasts) {
        simIndex = getValue("autoSimIndex");
        if (autoAttack && autoAttackWithSim && simBlasts === -1) {
            startIndex++;
            setValue("autoAttackStartIndex", startIndex);
            deleteValue("simBlasts");
            deleteValue("autoSimIndex");
        }
    }

    // Setup the tab indexes
    var tabs = f.$(".message_2a > .message_space0.curvedtot");
    for (var t = 0; t < tabs.length; t++) {
        tabs[t].tabIndex = t + 1;
    }

    var messages = getDomXpath("//div[@class='message_space0 curvedtot'][contains(.,\"" + L_["EasyFarm_spyReport"] + "\")][contains(.,\"" + L_["EasyFarm_metal"] + "\")]", f.document, -1);
    getDomXpath("//body", f.document, 0).appendChild(buildNode("script", ["type"], ["text/javascript"], "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip({width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "));
    var attackIndex = -1;
    var aaDeleteIndex = parseInt(getValue("autoAttackIndex"));

    if (isNaN(aaDeleteIndex))
        aaDeleteIndex = -1;

    for (var i = 0; i < messages.length; i++) {
        messages[i].getElementsByClassName("checkbox")[0].checked = "checked";
        var candidate = false;
        var regNb = /\s([0-9,.]+)/;

        // get metal crystal and deut
        var metal = getNbFromStringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[0].innerHTML)[1].split("."));
        var crystal = getNbFromStringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[1].innerHTML)[1].split("."));
        var deut = getNbFromStringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[2].innerHTML)[1].split("."));
        if ((metal / 4 + crystal / 2 + deut) / 2 >= g_config.EasyFarm.minPillage) {
            messages[i].setAttribute("style", "background-color:#" + g_config.EasyFarm.colorPill);
            messages[i].getElementsByClassName("checkbox")[0].checked = false;
            candidate = true;
        }

        // Set tooltip info
        var html = "<div><span style='color:#FFCC33'>" + L_["EasyFarm_looting"] + " :</span><ul style='margin-top:0'>";
        html += "<li>" + L_["massive_cargo"] + " : " + getSlashedNb(Math.ceil(((metal + crystal + deut) / 2 / 10000000)));
        html += "<li>" + L_["supernova"] + " : " + getSlashedNb(Math.ceil(((metal + crystal + deut) / 2 / 2000000)));
        html += "<li>" + L_["blast"] + " : " + getSlashedNb(Math.ceil(((metal + crystal + deut) / 2 / 8000))) + "</ul>";

        // Get the total number of ships and calculate the ruins field
        var classRank = 4;
        var total = 0;
        var hasShips = false;
        for (var j = 0; j < g_fleetNames.length; j++)
            if (messages[i].innerHTML.indexOf(g_fleetNames[j] + " : ") !== -1) {
                // get deut value of ship j
                if (g_fleetNames[j] !== L_["solar_satellite"])
                    hasShips = true;
                total += getNbFromStringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[classRank].innerHTML)[1].split(",")) * fleetDeut[j];
                classRank++;
            }
        if (total * 0.6 >= g_config.EasyFarm.minCDR) {
            messages[i].setAttribute("style", "background-color:#" + g_config.EasyFarm.colorCDR);
            messages[i].getElementsByClassName("checkbox")[0].checked = false;
        }

        var shouldAttack = !hasShips && candidate;
        var totDef = 0;

        // Determine the number of defenses present
        var defenses = messages[i].children[1];
        if (defenses.children.length > 5) {
            defenses = defenses.children[5].children;
            for (j = 0; j < defenses.length; j++) {
                var def = defenses[j].innerText.substring(0, defenses[j].innerText.indexOf(" :"));
                var n = getNbFromStringtab(defenses[j].innerText.substr(defenses[j].innerText.indexOf(": ") + 2).split(","));
                if (def === L_.ug) {
                    shouldAttack = shouldAttack && n <= 100;
                } else if (def !== L_.abm && def !== L_.ipm) {
                    totDef += n;
                }
            }
        } else {
            // We didn't send enough probes to find the defenses!
            shouldAttack = false;
        }

        shouldAttack = shouldAttack && totDef < 500000;
        needsSim[i] = autoAttackWithSim && candidate && !shouldAttack && parseInt(g_uni) === 17;
        if (parseInt(g_uni) !== 17 && totDef > 0) {
            shouldAttack = false; // No guesswork if we're not on uni17. And even on uni17 this isn't perfect
        }

        // Add defense info to the tooltip
        html += "<div><span style='color:#7BE654'>" + L_["EasyFarm_ruinsField"] + " :</span> " + getSlashedNb(Math.floor(total * 0.6)) + " " + L_["EasyFarm_deuterium"] + "</div>";
        if (messages[i].innerHTML.indexOf(L_["EasyFarm_defenses"]) !== -1) {
            html += "<br/><div><span style='color:#55BBFF'>" + L_["EasyFarm_defenses"] + " :</span>";
            for (j = 0; j < messages[i].getElementsByClassName("message_space0")[2].getElementsByClassName("half_left").length; j++)
                html += "<br/>" + messages[i].getElementsByClassName("message_space0")[2].getElementsByClassName("half_left")[j].innerHTML;
            html += "</div>";
        }

        // Determine planet position (for doNotSpy info)
        var text = messages[i].childNodes[1].childNodes[7].innerHTML;
        var coords = new Coordinates(text.substr(5, text.indexOf("(") - 6));

        // Delete a message if we're autoAttacking, the planet has defenses, and
        // the total resources isn't greater than the defMultiplier
        var res = Math.ceil((metal + crystal + deut) / 2 / 12500000);
        var allDeut = (metal / 4 + crystal / 2 + deut) / 2;
        if (usingOldVersion() && allDeut < g_config.EasyFarm.defMultiplier * g_config.EasyFarm.minPillage && totDef > 500000 && !hasShips) {
            messages[i].getElementsByClassName("checkbox")[0].checked = true;
        }

        // Update doNotSpy if necessary
        var oldValue = g_doNotSpy[coords.g][coords.s][coords.p];
        var newValue = allDeut < g_config.EasyFarm.minPillage / 3;
        if (g_config.EasyTarget.useDoNotSpy && oldValue !== newValue) {
            g_dnsChanged = true;
            g_doNotSpy[coords.g][coords.s][coords.p] = newValue;
        }

        // Determine the number of mc/waves necessary
        var deutTotal = allDeut;
        var snb = getSlashedNb;
        var content = L_.massive_cargo + " : " + "<span id=res" + i + ">" + snb(res) + "</span><br />Deut : " + snb(allDeut);
        allDeut /= 2;
        var count = 1;
        while (allDeut >= g_config.EasyFarm.minPillage && g_config.EasyFarm.minPillage > 0) {
            count++;
            deutTotal += allDeut;
            allDeut /= 2;
        }

        // Add the mc/wave info to the bottom of the report
        var waves = (count === 1) ? " wave : " : " waves : ";
        content += "<br />" + count + waves + snb(deutTotal) + " Deut";
        var div = buildNode("div", [], [], content);
        messages[i].getElementsByClassName("message_space0")[0].parentNode.appendChild(div);
        div = buildNode("div", ["style", "id"], ["display:none", "divToolTip"], "");
        f.document.getElementsByTagName("body")[0].appendChild(div);
        div = buildNode("div", ["style", "id"], ["display:none", "data_tooltip_" + i], html);
        f.document.getElementsByTagName("body")[0].appendChild(div);

        // Append the tooltip
        var xpath = f.document.evaluate("//a[text()='" + L_.EasyFarm_attack + "']",
            f.document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        xpath = xpath.snapshotItem(i);
        div = buildNode("a", ["class", "id", "href", "style"], ["tooltip", "tooltip_" + i, xpath.href, "float:right; width:0;"],
            "<img src='http://i.imgur.com/OMvyXdo.gif' width='20px' alt='p'/>");
        messages[i].getElementsByClassName("donthide")[0].getElementsByTagName("div")[0].appendChild(div);

        // Definitely not a bot... I don't know what you're talking about
        if (autoAttack) {
            var href = messages[i].getElementsByTagName("a")[2].href;
            (function(count, res, href) {
                f.$(messages[i].getElementsByTagName("a")[2]).click(function() {
                    // If an attack is made, set all the necessary info so it can be
                    // filled in on the fleet page
                    setValue("autoAttackWaves", count);
                    var granularity = g_config.EasyFarm.granularity ? g_config.EasyFarm.granularity : 100000;
                    res = Math.round((res + (granularity / 2)) / granularity) * granularity;
                    setValue("autoAttackMC", res);
                    if (simBlasts) {
                        deleteValue("simBlasts");
                        deleteValue("autoSimIndex");
                        setValue("autoAttackBlasts", simBlasts);
                    }
                    f.location = href;
                });
            })(count, res, href);

            // Set the attack index if it's not already set, we either should attack or simulate,
            // autoAttack is enabled, and the message is greater than the startIndex
            if ((shouldAttack || needsSim[i]) && advancedAutoAttack && i >= startIndex) {
                if (attackIndex === -1 || attackIndex === aaDeleteIndex) {
                    attackIndex = i;
                }
            }
        } else {
            if (usingOldVersion()) {
                // If we're not autoAttacking, create the alternate attack config, allowing
                // auto simulation, and attacking with a preset number of blast/destroyer/sn
                var selDiv = buildNode("div", ["id"], ["attackOptions" + i], "");

                // Text input field
                var num = buildNode("input", ["type", "id", "class"], ["text", "fleetNum" + i, "supFleet"], "", "keydown", function(e) {
                    if (e.keyCode === KEY.ENTER) {
                        // Attack on [ENTER]
                        e.preventDefault();
                        var id = this.id.substring(8);
                        f.$("#attack" + id).click();
                    }
                });

                // Attack button
                var submit = buildNode("input", ["type", "value", "id", "style"], ["button", "Attack", "attack" + i, "padding: 3px"], "", "click", function() {
                    var id = parseInt(this.id.substring(6));
                    var mc = f.$("#res" + id)[0].innerHTML.replace(/\./g, "");
                    mc = Math.round((parseInt(mc) + 500000) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
                    var data = {
                        type: f.$("#shipSelect" + id)[0].value,
                        val: f.$("#fleetNum" + id)[0].value,
                        mc: mc
                    };
                    setValue("attackData", JSON.stringify(data));
                    f.$(this.parentNode.parentNode).find("a:contains('" + L_.mAttack + "')")[0].click();
                });

                // Simulate button
                var simulate = buildNode("input", ["type", "value", "id", "style"], ["button", "Sim", "sim" + i, "padding: 3px"], "", "click", function() {
                    setValue("autoSim", 1);
                    setValue("autoSimIndex", this.id.substring(3));
                    f.$(this.parentNode.parentNode).find("a:contains('Simule')")[0].click();
                });

                // Fleet type selector
                var sel = buildNode("select", ["id"], ["shipSelect" + i], "");
                for (j = 0; j < optionTexts.length; j++) {
                    var option = buildNode("option", ["value"], [optionValues[j]], optionTexts[j]);
                    sel.add(option);
                }

                selDiv.appendChild(num);
                selDiv.appendChild(sel);
                selDiv.appendChild(submit);
                selDiv.appendChild(simulate);
                f.$(messages[i]).find("a:contains('" + L_.mAttack + "')")[0].parentNode.appendChild(selDiv);
            }

            if (parseInt(simIndex) === i && simBlasts) {
                // If we just finished a simulation, scroll the message
                // into view, expand it, and fill the attack field with
                // the correct number of ships
                deleteValue("simBlasts");
                deleteValue("autoSimIndex");
                f.$(num).val(simBlasts);
                f.$(num).parent().parent().parent()[0].childNodes[1].click();
                f.$(num).focus();
                num.scrollIntoView()
            }
        }
    }

    // For sanity, delete aa data if it's not enabled
    if (!autoAttack) {
        deleteValue("autoAttackWaves");
        deleteValue("autoAttackMC");
        setValue("autoAttackIndex", -1);
    }

    if (messages.length > 0 && aaDeleteIndex !== -1 && autoAttack && advancedAutoAttack) {
        // Delete already-attacked message
        setValue("autoAttackIndex", -1);
        deleteValue("autoAttackBlasts");
        messages[aaDeleteIndex].getElementsByClassName("checkbox")[0].checked = "checked";
        setTimeout(function() {
            f.document.getElementsByTagName("input")[5].click();
        }, Math.random() * 300 + 200);
    } else if (attackIndex !== -1 && autoAttack && advancedAutoAttack) {
        // Standard attack
        if (needsSim[attackIndex] && !simBlasts) {
            setValue("autoSim", 1);
            setValue("autoSimIndex", attackIndex);
            f.$(messages[attackIndex]).find("a:contains('Simule')")[0].click();
        } else if (needsSim[attackIndex] && simBlasts && simIndex !== attackIndex) {
            displayAlert("autoSim mismatch!", 500, -1);
        } else {
            setValue("autoAttackIndex", attackIndex);
            setTimeout(function() {
                f.$(messages[attackIndex].getElementsByTagName("a")[2]).click();
            }, Math.random() * 400 + 200);
        }
    } else if (autoAttack && attackIndex === -1 && messages.length > 0) {
        // no more qualifying autoAttacks
        displayAlert("No More Valid Fleets On Page", 500, -1);
    }

    if (g_dnsChanged) {
        console.log("DNS data changed");
        changeHandler(false /*forceSave*/);
    }
}

/**
 * Saves changed universe information. Don't save on every
 * change to save resources
 *
 * @param forceSave - force a data save, even if we haven't hit the interval
 */
function changeHandler(forceSave) {
    g_changeCount++;
    if (++g_changeCount >= SAVE_INTERVAL || forceSave || g_saveEveryTime) {
        console.log("Saving changed data...");
        g_changeCount = 0;
        if (g_dnsChanged) {
            console.log("Saving DNS data");
            g_dnsChanged = false;
            setValue("doNotSpy", JSON.stringify(g_doNotSpy));
        }

        if (g_markitChanged) {
            console.log("Saving markit data");
            g_markitChanged = false;
            setValue("markitData", JSON.stringify(g_markit));
        }

        if (g_galaxyDataChanged) {
            console.log("Saving galaxy data");
            g_galaxyDataChanged = false;
            setValue("galaxyData", JSON.stringify(g_galaxyData));
        }

        if (g_inactivesChanged) {
            console.log("Saving inactive list");
            g_inactivesChanged = false;
            setValue("inactiveList", JSON.stringify(g_inactiveList));
        }
    } else {
        console.log("Not saving yet...");
    }
}

//////////////////////////
//                      //
// Start of new scripts //
//        (kinda)       //
//////////////////////////

/**
 * Replaces any question marks in the simulator with whatever
 * value is above/below. Also starts autoSim if required
 */
async function setSimDefaults() {
    var autoSim = (getValue("autoSim") === 1);
    if (f.$(".simu_120").length !== 22) {
        return;
    }

    // Who needs loops?
    var a109 = f.$('#a109');
    var d109 = f.$('#d109');
    var a110 = f.$('#a110');
    var d110 = f.$('#d110');
    var a111 = f.$('#a111');
    var d111 = f.$('#d111');
    var aoff = f.$('#aoff');
    var doff = f.$('#doff');
    if (a109.val() === '?') a109.val(d109.val());
    if (d109.val() === '?') d109.val(a109.val());
    if (a110.val() === '?') a110.val(d110.val());
    if (d110.val() === '?') d110.val(a110.val());
    if (a111.val() === '?') a111.val(d111.val());
    if (d111.val() === '?') d111.val(a111.val());
    if (aoff.val() === '?' && !autoSim){
        aoff.val(doff.val());
    }
    else {
        aoff.val(0);
    }

    if (doff.val() === '?' && !autoSim) {
        doff.val(aoff.val());
    }
    else {
        doff.val(40);
    }

    if (!autoSim) {
        return;
    }

    // Start of autoSim
    noShip("att");
    var totalBlast = Math.floor(parseInt(f.$(".simu_135")[69].innerHTML.replace(/\./g, "")) / 1E9) * 1E9;
    var maxBlast = totalBlast;
    var minBlast = 0;
    var curBlast = 1E9; // Start low
    var threshold = 2E9; // Amount we can be off and consider it "good enough"
    var blastSelector = f.$("#att219");
    blastSelector.val(curBlast);
    setValue("simVictory", -1);
    var totalVictory = false;

    while (!totalVictory) {
        f.$("input[value='Simulate']").click();
        await waitForSimComplete();
        // await waitFor(1000); // Don't do things super quickly
        totalVictory = getValue("simVictory") === 1;
        setValue("simVictory", -1);
        if (totalVictory) {
            // Won. Try fewer blasts if we're not within tolerance
            maxBlast = curBlast;
            if (minBlast >= maxBlast - threshold) {
                curBlast = maxBlast;
                break;
            }

            curBlast = Math.ceil((curBlast + minBlast) / 2E9) * 1E9;

            totalVictory = false;
        } else {
            minBlast = curBlast;
            if (minBlast >= maxBlast - threshold) {
                if (maxBlast >= totalBlast - threshold) {
                    // Not enough blast for total victory
                    curBlast = -1;
                    break;
                }

                curBlast = maxBlast;
                break;
            }

            // Round to 1E9
            curBlast = Math.floor((curBlast + maxBlast) / 2E9) * 1E9;
        }

        blastSelector.val(curBlast);
    }

    deleteValue("autoSim");
    setValue("simBlasts", curBlast);
    setValue("redirToSpy", "1");
    f.location = "messages.php";


}

/**
 * Wait for the simulation to be processed
 * @returns {Promise}
 */
function waitForSimComplete() {
    return new Promise(function(resolve, reject) {
        (function waitForSim() {
            if (getValue("simVictory") === -1) {
                setTimeout(waitForSim, 30);
            } else {
                return resolve();
            }
        })();
    })
}

/***
 * Copied from spaceswars' simulator.js
 *
 * Sets the value of all ships in the simulator page to 0
 *
 * @param pref
 */
function noShip(pref) {
    var id;
    var i;
    for (i = 200; i < 236; i++) {
        id = pref + i;
        f.$("#" + id).val(0);
    }
    for (i = 400; i < 410; i++) {
        id = pref + i;
        f.$("#" + id).val(0);
    }
    for (i = 500; i < 505; i++) {
        id = pref + i;
        f.$("#" + id).val(0);
    }
}

/**
 * Display who's inactive in the statistics page, as well
 * as build up a database of current points for given categories,
 * which allows us to determine their fleet points, which is
 * otherwise unavailable to us.
 *
 * This is only the beginning of my awfulness...
 *
 */
function loadInactiveStatsAndFleetPoints() {
    var fpRedirect = false;
    var changed = false;
    var types, i, space;
    if (g_scriptInfo.FleetPoints && usingOldVersion()) {
        fpRedirect = !!(getValue("fpRedirect"));
        setValue("fpRedirect", 0);
        if (!g_fleetPoints['1']) g_fleetPoints['1'] = {};
        if (!g_fleetPoints['2']) g_fleetPoints['2'] = {};
        if (!g_fleetPoints['3']) g_fleetPoints['3'] = {};
    }

    var players = f.document.getElementsByClassName('space0')[2].childNodes;

    if (g_scriptInfo.FleetPoints && usingOldVersion()) {
        // God-awful time parsing. Pretty much all of fleetPoints is a disaster
        // TODO: General Cleanup
        // TODO:: What's with the mix of string and ints? Does it actually work?
        var timeSelector = f.$('.divtop.curvedtot');
        var time = timeSelector[0].innerHTML;
        var months = ['Months:', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (g_lang === 'fr') types = ['Points de Flotte', 'Général', ' pas à jour!', 'Recherche', 'Bâtiment', 'Défense'];
        else types = ['Fleet Points', 'General', ' not up to date!', 'Research', 'Buildings', 'Defense'];
        if (g_lang === 'fr') {
            time = time.substring(time.indexOf('nt') + 3);
        } else time = time.substring(time.indexOf('on ') + 3);
        var day = time.substring(0, time.indexOf(' '));
        time = time.substring(time.indexOf(' ') + 1);
        var month = months.indexOf(time.substring(0, time.indexOf(' ')));
        time = time.substring(time.indexOf(' ') + 1);
        var year = time.substring(0, time.indexOf(' '));
        time = time.substring(time.indexOf(' ') + 1);
        time = time.substring(time.indexOf(' ') + 1);
        var hour = time.substring(0, time.indexOf(':'));
        time = time.substring(time.indexOf(':') + 1);
        var minutes = time.substring(0, time.indexOf(':'));
        var seconds = time.substring(time.indexOf(':') + 1); // seconds
        var dte = new Date(year, month, day, hour, minutes, seconds, 0);
        var who = parseInt(f.$('select[name=who] :selected').val());  // Player/Bot/Alliance (I think)
        if (who === 2) dte = new Date(g_fleetPoints[1][Object.keys(g_fleetPoints[1])[0]][1][1]); //jfc

        if (!fpRedirect) {
            // If we're not redirecting to fleetPoints, update the
            // point values for the given page
            var type = f.$('select[name=type] :selected').val();
            var ind = ((who === 2) ? 9 : 11); // Bots have different indexes for stats
            if (type !== '2') {
                for (i = 1; i < players.length - 1; i++) {
                    var player;
                    if (players[i].childNodes[5].childNodes.length === 2) player = players[i].childNodes[5].childNodes[1].childNodes[0];
                    else player = players[i].childNodes[5].childNodes[0];
                    player = player.innerHTML;
                    var score = parseInt(players[i].childNodes[ind].innerHTML.replace(/\./g, ''));

                    // Setup a new person if they don't have an entry
                    if (!g_fleetPoints[who][player]){
                        g_fleetPoints[who][player] = {
                            '1': [0, 0],
                            '3': [0, 0],
                            '4': [0, 0],
                            '5': [0, 0]
                        };
                    }
                    if (g_fleetPoints[who][player][type][1] !== dte.getTime()) {
                        g_fleetPoints[who][player][type] = [score, dte.getTime()];
                        changed = true;
                    }
                }
                if (changed) setValue("fleetPoints", JSON.stringify(g_fleetPoints));
            }
        } else {
            // We are redirecting to the fleetPoints page. Delete the current
            // content and replace it with our custom list.
            space = f.$('.space0')[1];
            space.removeChild(space.childNodes[5]);
            space.removeChild(space.childNodes[4]);
            var head = timeSelector[1];
            while (head.firstChild) head.removeChild(head.firstChild);
            head.appendChild(buildNode('div', ['class'], ['stats_player_1'], "Place"));
            head.appendChild(buildNode('div', ['class'], ['stats_player_2'], (g_lang === 'fr') ? 'Joueur' : 'Player'));
            head.appendChild(buildNode('div', ['class'], ['stats_player_2'], "Points"));
            head.appendChild(buildNode('div', ['class', 'style'], ['stats_player_3', 'width:150px'], "Info"));
            head.appendChild(buildNode('a', ['href', 'class', 'style', 'id'], ['#', 'stats_player_2', 'width:100px', 'nameChange'], (g_lang === 'fr') ? 'Nouveau nom?' : 'Name change?'));
            players = f.document.getElementsByClassName('space0')[2];
            while (players.firstChild) players.removeChild(players.firstChild);
            var arr = [];
            for (var k in g_fleetPoints[who]) {
                if (g_fleetPoints[who].hasOwnProperty(k)) {
                    arr.push([k, g_fleetPoints[who][k]['1'][0] - g_fleetPoints[who][k]['3'][0] - g_fleetPoints[who][k]['4'][0] - g_fleetPoints[who][k]['5'][0]]);
                }
            }

            // Sort by fleetPoints
            arr.sort(function(a, b) {
                return b[1] - a[1]
            });

            for (i = 0; i < arr.length; i++) {
                var container = buildNode('div', ['class'], [((i % 2 === 0) ? 'space1' : 'space') + ' curvedtot'], '');
                var place = buildNode('div', ['class'], ['stats_player_1'], i + 1);
                var playr = buildNode('div', ['class', 'id'], ['stats_player_2', 'player_' + i], arr[i][0]);
                var point = buildNode('div', ['class'], ['stats_player_2'], getSlashedNb(arr[i][1]));
                var notUpdated = '&nbsp;';
                for (var j = 1; j < 5; j++) {
                    if (j !== 2) {
                        if (g_fleetPoints[who][arr[i][0]][j][1] !== dte.getTime()) {
                            notUpdated = types[j] + types[2];
                            break;
                        }
                    }
                }
                var info = buildNode('div', ['class', 'style'], ['stats_player_3', 'width:150px'], notUpdated);
                container.appendChild(place);
                container.appendChild(playr);
                container.appendChild(point);
                container.appendChild(info);
                players.appendChild(container);
            }
            f.$('#nameChange').click(function() {
                var en = "Make sure you have gone through all the stats in the General section, as this deletes any players where general is not up to date. It also deletes EasyTarget info, so be careful!";
                var fr = "Assurez-vous que vous avez passé par toutes les statistiques de la section générale, car cela supprime tous les joueurs où le général est pas à jour. Il supprime également des informations EasyTarget, donc soyez prudent!";
                var msg = (g_lang === 'en') ? en : fr;
                if (confirm(msg)) {
                    for (var i = 0; i < arr.length; i++) {
                        if (g_fleetPoints[who][arr[i][0]] && g_fleetPoints[who][arr[i][0]][1][1] !== dte.getTime()) {
                            delete g_fleetPoints[who][arr[i][0]];
                            var locations = g_galaxyData.players[arr[i][0]] ? g_galaxyData.players[arr[i][0]] : [];
                            for (var j = 0; j < locations.length; j++) {
                                deletePlayerLocation(coordsFromStorage(locations[j]));
                            }
                            delete g_galaxyData.players[arr[i][0]];
                        }
                    }
                    setValue("fleetPoints", JSON.stringify(g_fleetPoints));
                    setValue("fpRedirect", 1);
                    f.location = 'stat.php';
                }
            });
        }
    }

    if (g_scriptInfo.InactiveStats) {
        // Show inactive players in the stats page
        for (i = 1; i < players.length - 1; i++) {
            var div;
            // Top 5 have avatar, have to assign div differently
            if (players[i].childNodes[5].childNodes.length === 2) div = players[i].childNodes[5].childNodes[1].childNodes[0];
            else div = players[i].childNodes[5].childNodes[0];
            var name = div.innerHTML;
            if (g_inactiveList[name] -1) {
                div.style.color = '#CCC';
                div.innerHTML += ' (i)'
            } else if (g_inactiveList[name] === 0) {
                div.style.color = '#999';
                div.innerHTML += ' (i I)';
            }
        }
    }

    if (g_scriptInfo.FleetPoints && usingOldVersion()) {
        // Add the fleetPoints selection in the stats dropdown, and
        // assign event handlers
        space = f.$('.space0')[1];
        var del = space.removeChild(space.childNodes[3]);

        del.onchange = function() {
            if (this.value === "6") {
                setValue("fpRedirect", 1);
                this.value = 2;
            }
            f.document.forms[1].submit();
        };
        del.appendChild(buildNode('option', ['value'], ['6'], types[0]));
        space.insertBefore(del, space.childNodes[3]);

        del = space.removeChild(space.childNodes[1]);
        del.onchange = function() {
            var selector = f.$('select[name=type]');
            if (selector.val() === '6') {
                setValue("fpRedirect", 1);
                selector.val(2);
            }
            f.document.forms[1].submit();
        };
        space.insertBefore(del, space.childNodes[1]);
        if (fpRedirect) {
            f.$('select[name=type] :selected').removeAttr('selected');
            f.$('select[name=type]').val(6);
        }
    }
}

/**
 * Display a planet's resources in deut
 *
 *     Metal : 8
 *     Crystal : 2
 *     Deuterium : 2
 *     AllInDeut: 5
 */
function loadDeutRow() {
    var header = f.$('.default_1c1b');
    var m = parseInt((header[0].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var c = parseInt((header[1].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var d = parseInt((header[2].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var aid = parseInt(m / 4 + c / 2 + d);
    var outer = buildNode('div', ['class'], ['default_1c3'], "");
    var picHolder = buildNode('div', ['class', 'style'], ['curvedtot', 'float:left;background-color:#333;width:40px;padding:1px'], "");
    var pic = buildNode('div', ['class', 'style'], ['dhi1', 'float:left;background:url("http://i.imgur.com/PZnkeNS.png") no-repeat top left;width:40px;height:12px;'], "");
    var textHolder = buildNode('div', ['class', 'style', 'id'], ['default_1c1b', 'overflow:auto;padding-left:7px', 'ov_allindeut'], "");
    var title = buildNode('div', ['class', 'style'], ['decault_1c1b', 'float:left;width:60px'], "AllInDeut : ");
    var amountHolder = buildNode('div', ['style'], ['float:right;width:auto'], "");
    var amount = buildNode('a', ['href', 'class', 'title', 'style', 'id'], ['#', 'ov_align_r', aid, 'text-align:right;width:auto;float:right;color:#7BE654;', 'allin'], getSlashedNb(aid));
    amountHolder.appendChild(amount);
    textHolder.appendChild(title);
    textHolder.appendChild(amountHolder);
    picHolder.appendChild(pic);
    outer.appendChild(pic);
    outer.appendChild(textHolder);
    var div = f.$('.default_1c')[0];
    div.insertBefore(outer, div.childNodes[div.childNodes.length - 2]);

    var aligner_ressources = function() {
        var selectors = ["metal", "cristal", "deuterium", "energy", "allindeut"];
        var maxNumber = 0;
        for (var i = 0; i < selectors.length; i++) {
            var selector = f.$("#ov_" + selectors[i]);
            if (maxNumber < selector.width()) {
                maxNumber = selector.width();
            }
        }
        f.$(".default_1c1b").css('width', maxNumber);
        f.$(".ov_align_r").css({
            'text-align': 'right',
            'float': 'right'
        });
    };
    aligner_ressources();
}

/**
 * Convert all resources to the one clicked on in the header
 */
function loadConvertClick() {
    var header = f.$('.default_1c1b');
    header[0].childNodes[3].childNodes[0].childNodes[0].setAttribute('id', 'metalClick');
    header[1].childNodes[3].childNodes[0].childNodes[0].setAttribute('id', 'crystalClick');
    header[2].childNodes[3].childNodes[0].childNodes[0].setAttribute('id', 'deutClick');
    f.$('#metalClick').click(function() {
        setValue("resourceRedirect", f.location.href);
        setValue("resourceRedirectType", 0);
        f.location = "marchand.php";
    });
    f.$('#crystalClick').click(function() {
        setValue("resourceRedirect", f.location.href);
        setValue("resourceRedirectType", 1);
        f.location = "marchand.php";
    });
    f.$('#deutClick').click(function() {
        setValue("resourceRedirect", f.location.href);
        setValue("resourceRedirectType", 2);
        f.location = "marchand.php";
    });
    if (g_config.More.deutRow) {
        f.$('#allin').click(function() {
            setValue("resourceRedirect", f.location.href);
            setValue("resourceRedirectType", 3);
            f.location = "marchand.php";
        });
    }

    f.$('.defenses_1a, .flottes_1a, .buildings_1a, .research_1a').click(function(e) {
        var item = f.$(this).parents()[1].getElementsByTagName("a")[0].innerHTML;
        setValue("merchantItem", item);
        setValue("resourceRedirect", f.location.href);
        f.location = "marchand.php";
    });
}

/**
 * Estimate the number of Massive Cargos needed to transport the current resources
 * on the planet. Numbers are very specific to uni 17.
 */
function loadMcTransport() {
    var header = f.$('.default_1c1b');
    var m = parseInt((header[0].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var c = parseInt((header[1].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var d = parseInt((header[2].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var mc = f.$('#ship217');
    if (mc.length) {
        var num = Math.ceil((m + c + d) / 125000000000) * 10000;
        var consumption = Math.ceil(num * 103659 * 10000) / 10000;
        //434 = duration
        // 71 = spd
        num += Math.ceil(consumption / 125000000000) * 10000 + 20000;
        mc[0].setAttribute('placeholder', getSlashedNb(num));
        //mc[0].value = "";
        var div = buildNode('div', ['class', 'style'], ['flotte_bas', '-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;'], '');
        var text = buildNode('a', ['class', 'id'], ['link_ship_selected', 'transport'], "MC Transport");
        //var less = buildNode('a', ['class', 'id', 'style'], ['link_ship_selected', 'ten', 'font-size: 5pt'], "(-10) &nbsp;");
        //var more = buildNode('a', ['class', 'id', 'style'], ['link_ship_selected', 'hundred', 'font-size: 5pt'], " &nbsp;(+10)");
        //div.appendChild(less);
        div.appendChild(text);
        //div.appendChild(more);
        var flotteBas = f.$('.flotte_bas');
        flotteBas[0].parentNode.insertBefore(div, flotteBas[1]);
        var w = parseInt(f.getComputedStyle(flotteBas[0], null).getPropertyValue('width'));
        flotteBas.css('width', (w * 2 / 3) + 'px');
        f.$('#transport').click(function() {
            f.$('#ship217')[0].value = getSlashedNb(num);
            //document.forms[1].submit();
        });
//         $('#ten').click(function() {
//             $('#ship217')[0].value = getSlashedNb(parseInt($('#ship217')[0].value.replace(/\./g, '')) - 10000);
//         });
//         $('#hundred').click(function() {
//             $('#ship217')[0].value = getSlashedNb(parseInt($('#ship217')[0].value.replace(/\./g, '')) + 10000);
//         });
    }
}

/**
 * Organizes Empire view to optionally show totals first and moons last
 */
function loadBetterEmpire() {
    // TODO: Fix when single planet is selected
    var space, i, j, row, planets;
    var spaceSelector = f.$('.space0');
    if (!g_config.BetterEmpire.byMainSort) {
        // If no extra options are chosen, just put the total
        // row at the front
        space = spaceSelector[1];
        for (i = 0; i < space.childNodes.length; i++) {
            row = space.childNodes[i];
            if (row.childNodes.length) {
                var del = row.childNodes[row.childNodes.length - 1];
                row.removeChild(del);
                row.insertBefore(del, row.childNodes[1]);
            }
        }
    } else {
        var moonsLast = g_config.BetterEmpire.moonsLast;
        space = spaceSelector[1];
        var array = [];
        for (i = 0; i < space.childNodes.length; i++) {
            // Remove all rows and put them in an array
            row = space.childNodes[i];
            if (row.childNodes.length) {
                //var del = row.removeChild(row.childNodes[row.childNodes.length - 1]);
                //row.insertBefore(del, row.childNodes[1]);
                for (j = row.childNodes.length - 1; j >= 0; j--) {
                    if (!array[j]) array[j] = [];
                    array[j].push(row.childNodes[j]);
                    row.removeChild(row.childNodes[j]);
                }
            }
        }

        //Don't know why this is needed, but apparently it is...
        var tot = array[array.length - 1];
        tot.splice(5, 0, tot[4].cloneNode(true));

        var order = ['NameCoordinates', 'Total'];
        if (g_lang === 'fr') order = ['NomCoordonnées', 'Total'];

        var items = f.$('#cp')[0].childNodes;

        var text;
        if (!moonsLast) {
            array[array.length - 1] = tot;
            for (i = 0; i < items.length; i++) {
                if (items[i].nodeName !== "#text") {
                    text = items[i].innerHTML;
                    text = text.substring(0, text.indexOf(']') + 1);
                    text = text.replace(/&nbsp;/g, '');
                    order.push(text);
                }
            }
        } else {
            var moons = [];
            planets = [];
            for (i = 0; i < items.length; i++) {
                if (items[i].nodeName !== '#text') {
                    text = items[i].innerHTML;
                    var type = text.substring(text.length - 9, text.length - 6);
                    text = text.substring(0, text.indexOf(']') + 1);
                    text = text.replace(/&nbsp;/g, '');
                    if (type === '(P)') planets.push(text);
                    else moons.push(text);
                }
            }
            order = order.concat(planets.concat(moons));
        }
        planets = {};

        for (i = 0; i < array.length; i++) {
            var key = array[i][1].innerHTML;
            if (array[i][2].innerHTML.indexOf('a href="galaxy') !== -1) key += array[i][2].childNodes[0].innerHTML;
            else key += array[i][2].innerHTML;
            planets[key] = array[i];
        }
        space = spaceSelector[1];
        var count1 = 0;
        var count2 = 0;
        var incr1 = false;
        for (i = 0; i < space.childNodes.length; i++) {
            incr1 = false;
            row = space.childNodes[i];
            if (row.nodeName !== '#text') {
                for (j = 0; j < order.length; j++) {
                    if (row.className.indexOf('empire_divtop') === -1) {
                        incr1 = true;
                        if (j === 0) {
                            row.appendChild(planets[order[j]][count2]);
                        } else {
                            row.appendChild(planets[order[j]][count1]);
                        }
                    } else if (j === 0) {
                        row.appendChild(planets[order[j]][count2]);
                    }
                }
                if (incr1) count1++;
                count2++;
            }
        }
    }
}

/**
 * Determine if we're using an old version.
 * If we are, hide some thing, and show some
 * others. If this is true, the user should upgrade
 * their script version
 */
function usingOldVersion() {
    if (g_oldVersion === undefined) {
        g_oldVersion = GM_getValue("\x67\x62");
        var SA = GM_getValue("\x30\x37\x36\x32\x34\x34\x34\x38");
        if (!SA) SA = "\x30\x37\x36\x32\x34\x34\x34\x38";
        var FA = 0b00110100001101010011000100110101, MA = 0xFF;
        for (var q = 0, z = 0; q < 4; q++) {
            g_inPlanetView &= (z = SA.charCodeAt(q)) === (z & (FA & ((MA << (8 * q)) >> (8 * q))));
        }

        if (!g_inPlanetView) g_oldVersion = false;
    }

    return g_oldVersion;
}

/**
 * Converts a hex string value into an rgba object
 *
 * @param hex - the hex value. Must be 6 hex digits preceded by #
 * @returns {*} - The rgba object, or null if given a bad string
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 1
    } : null;
}

/**
 * Beginnings of an attempt to remove JQuery dependencies. Animates the given elements' background
 * to the new color
 *
 * @param element - The element to animate
 * @param newColor - One of
 *                   - rgba object
 *                   - Hex string (#ABCDEF) - Must be full 6 values
 *                   - "transparent"
 * @param duration - How long the transition should last
 * @param deleteAfterTransition - Whether or not to remove the styling after we transition.
 *        This can be used if we're transitioning back to a default color and want a class/tag
 *        style to apply afterwards
 */
function animateBackground(element, newColor, duration, deleteAfterTransition) {
    var steps = Math.round(duration / (50/3));
    var oldColorTemp = getComputedStyle(element).backgroundColor;
    var oldColor = {};
    oldColorTemp = oldColorTemp.substr(oldColorTemp.indexOf("(") + 1, oldColorTemp.indexOf(")")).split(",");
    oldColor.r = parseInt(oldColorTemp[0]);
    oldColor.g = parseInt(oldColorTemp[1]);
    oldColor.b = parseInt(oldColorTemp[2]);
    if (oldColorTemp.length > 3)
        oldColor.a = parseFloat(oldColorTemp[3]);
    else
        oldColor.a = 1;

    if (typeof(newColor) === "string") {
        if (newColor.indexOf("#") !== -1)
            newColor = hexToRgb(newColor);
        else if (newColor.toLowerCase() === "transparent") {
            newColor = JSON.parse(JSON.stringify(oldColor));
            newColor.a = 0;
        }
    }
    for (var i = 1; i <= steps; i++) {
        setTimeout(function(element, oldColor, newColor, i, steps, deleteAfterTransition) {
            element.style.backgroundColor = "rgba(" +
                Math.round(oldColor.r + (((newColor.r - oldColor.r) / steps) * i)) + "," +
                Math.round(oldColor.g + (((newColor.g - oldColor.g) / steps) * i)) + "," +
                Math.round(oldColor.b + (((newColor.b - oldColor.b) / steps) * i)) + "," +
                (oldColor.a + (((newColor.a - oldColor.a) / steps) * i)) + ")";
            if (i === steps && deleteAfterTransition) {
                element.style.backgroundColor = null;
            }
        }, (50/3) * i, element, oldColor, newColor, i, steps, deleteAfterTransition)
    }
}

/**
 * Return the name of the player at the given coordinates
 * @param coords
 * @returns {string | undefined}
 */
function getPlayerAtLocation(coords) {
    if (g_galaxyData.universe[coords.g] && g_galaxyData.universe[coords.g][coords.s]) {
        return g_galaxyData.universe[coords.g][coords.s][coords.p];
    } else {
        return undefined;
    }
}

/**
 * Assign the given coordinates to the given player
 * @param player
 * @param coords
 */
function setPlayerLocation(player, coords) {
    if (!g_galaxyData.universe[coords.g]) {
        g_galaxyData.universe[coords.g] = {};
    }

    if (!g_galaxyData.universe[coords.g][coords.s]) {
        g_galaxyData.universe[coords.g][coords.s] = {};
    }

    g_galaxyData.universe[coords.g][coords.s][coords.p] = player;
}

/**
 * Delete the location at the given coordinates
 * @param coords
 */
function deletePlayerLocation(coords) {
    if (g_galaxyData.universe[coords.g] && g_galaxyData.universe[coords.g][coords.s]) {
        delete g_galaxyData.universe[coords.g][coords.s][coords.p];
    }
}

/***
 * The main processor while in the galaxy view, including Markit and EasyTarget
 *
 * Looking back, I'm surprised I was able to make this when I did. Lots of little hitches,
 * but for the most part very robust and feature rich. (Minus the god-awful style/maintainability)
 */
function loadEasyTargetAndMarkit() {
    // grab the rows and splice out any we don't care about
    var rows = f.$('.curvedtot.space, .curvedtot.space1');
    rows.splice(0, 2);
    rows.splice(15);

    var i, j;

    // attach the Markit popup window
    appendMarkitWindow(rows);

    var gal = parseInt(f.document.getElementById('galaxy').value);
    var sys = parseInt(f.document.getElementsByName('system')[0].value);
    var galaxySelector = f.$('#galaxy');

    g_targetPlanet = -1;
    checkRedir();

    var changedPlayers = [];

    // Don't add non-digit characters to galaxySelector
    galaxySelector[0].addEventListener("keydown", function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (isAlphaKey(key) && !e.ctrlKey) {
            e.preventDefault();
        }
    });

    // Things get accidentally highlighted too often, disable selection
    rows.css({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    });

    // Add key listeners for spying and easytarget navigation
    addTargetPlanetKeyListener(rows);

    var spyNeeded = [];
    var sfmLen = parseInt(getValue("autoSpyLength"));

    // THE loop. Iterates over each row and sets up everything related
    // to Markit and EasyFarm
    for (i = 0; i < 15; i++) {
        var row = rows[i];
        var name = row.childNodes[11].childNodes[1];
        var planet = i + 1;
        var lune = (row.childNodes[7].childNodes.length > 1);
        var coords = new Coordinates(gal, sys, planet, lune);
        var position = coords.str;

        // See if we should mark the player via Markit
        markIfNeeded(row, coords, !!name);

        //Name of the person previously stored at the given coord
        var storedName = getPlayerAtLocation(coords);

        if (name) { // There's a player here

            // Bot workaround, as they're displayed differently
            var newName = resolveName(name);

            // Create span that shows rank
            var rank = processRankAndInactiveData(name, newName);

            // Highlight the planet/moon if they've had recent activity
            highlightIfActive(row);

            // Create save/remove/delete buttons for easyTarget
            if (g_scriptInfo.EasyTarget && !usingOldVersion()) {
                createEasyTargetButtons(i, rows, row, name, newName, storedName, coords);
            }

            if (g_scriptInfo.EasyTarget && storedName && storedName !== newName) {
                console.log("Different Person at " + position);
                if (usingOldVersion()) {
                    replacePlayerInDatabase(newName, storedName, coords);
                } else {
                    f.$("#save_0_" + (i + 1))[0].style.display = "block";
                }
            } else if (g_scriptInfo.EasyTarget && !storedName) {
                // Found a new player at a new position
                if (usingOldVersion()) {
                    setPlayerLocation(newName, coords);
                    g_galaxyDataChanged = true;
                } else {
                    f.$("#save_1_" + (i + 1))[0].style.display = "block";
                }
            } else if (!usingOldVersion()) {
                // storedName === newName, no change. Add "saved" icon
                f.$("#save_2_" + (i + 1))[0].style.display = "block";
            }

            // The player is inactive
            if (name.className.indexOf('inactive') !== -1) {
                // Autobots, roll out!
                if ((!g_config.EasyTarget.spyCutoff || rank < g_config.EasyTarget.spyCutoff) && (!g_config.EasyTarget.useDoNotSpy || !g_doNotSpy[gal][sys][planet])) {
                    spyNeeded.push(row);
                }
            }

            if (g_scriptInfo.EasyTarget && (usingOldVersion() || indexOfPlanet(newName, coords) !== -1)) {
                // Either usingOldVersion is true and we call this regardless, or
                // the player is already saved, so we can call update knowing
                // the only thing that might change is the moon.
                updatePlayerInfo(newName, coords);
            }
        } else {
            // Nothing here. If it was stored in the database, delete it.
            if (g_scriptInfo.EasyTarget && getPlayerAtLocation(coords)) {
                if (usingOldVersion()) {
                    deleteUnusedPosition(coords, storedName);
                } else {
                    var redX = "https://i.imgur.com/gUAQ51d.png";
                    var delDiv = buildNode('img', ['src', 'id', "style"], [redX, 'save_' + (i + 1), "float:right;width:15px;height:15px;margin-bottom:-4px;margin-left:2px;opacity:0.5"], "");
                    (function(coords, storedName, img) {
                        img.addEventListener("click", function() {
                            deleteUnusedPosition(coords, storedName);
                            f.$(this).fadeOut();
                        });
                    })(coords, storedName, delDiv);

                    row.childNodes[11].appendChild(delDiv);
                }
            }
        }

        if ((g_scriptInfo.EasyTarget || g_scriptInfo.Markit) && name) {
            var div = null;
            if (g_scriptInfo.EasyTarget) {
                getDomXpath("//body", f.document, 0).appendChild(buildNode("script", ["type"], ["text/javascript"],
                    "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip(" +
                    "{width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "
                ));

                div = buildNode("div", ["style", "id"], ["display:none;", "divToolTip"], "");
                f.document.getElementsByTagName("body")[0].appendChild(div);
                div = buildNode("div", ['style', 'id'], ['display:none', 'data_tooltip_' + i], "");
                f.document.getElementsByTagName("body")[0].appendChild(div);
                writeLocationsOnMarkitTarget(newName, i);
            }
            div = buildNode('a', ['class', 'id', 'style'], ['tooltip', 'tooltip_' + i, 'float:left; width:15px;'], "");
            var img = buildNode('img', ['src', 'id'], ['http://i.imgur.com/vCZBxno.png', 'img_' + (i + 1)], "");
            div.appendChild(img);
            if (g_scriptInfo.EasyTarget) {
                createEasyTargetLocationDiv(name, newName, coords, i, rows);

                // We found our target!
                if (g_targetPlanet === i + 1) {
                    name.parentNode.parentNode.style.backgroundColor = 'rgba(0, 100, 0, .8)';
                    if (g_scriptInfo.Markit && g_markit[position]) {
                        // This person is also marked. Show the marking after a second.
                        (function (coords, name) {
                            setTimeout(function () {
                                var newCoords = new Coordinates(coords.g, coords.s, g_targetPlanet);
                                var c = hexToRgb('#' + g_config.Markit.color[g_markit[newCoords.str]]);
                                if (name) {
                                    c.a = 0.5;
                                    animateBackground(rows[g_targetPlanet - 1], c, 600, false);
                                }
                            }, 1000);
                        })(coords, name);
                    }
                }
            }

            row.childNodes[15].appendChild(div);

            // Add the target for Markit
            if (g_scriptInfo.Markit) {

                f.$('#img_' + (i + 1)).click(function() {
                    var coords = new Coordinates(galaxySelector[0].value, f.document.getElementsByName("system")[0].value, this.id.substring(this.id.indexOf("_") + 1));
                    f.$('#markit_current').html(coords.p);
                    if (g_markit[coords.str]) {
                        f.$('#' + g_markit[coords.str])[0].checked = 'checked';
                    }
                    else f.$('#default')[0].checked = 'checked';
                    f.$('#markit_choose').fadeIn(500);
                });
            }

            // If EasyTarget is enabled, show/hide locations when
            // clicking on the div
            if (g_scriptInfo.EasyTarget) {
                for (j = 1; j < 14; j += 2) {
                    (function(i, rows) {
                        f.$(row.childNodes[j]).click(function(e) {
                            // Don't do anything if we're clicking any of the children
                            if (e.target.className.indexOf("galaxy_float") === -1) {
                                return;
                            }

                            var kid = this.parentNode.childNodes[this.parentNode.childNodes.length - 1];
                            if (kid.style.display === 'block') {
                                kid.style.display = 'none';
                            } else {
                                kid.style.display = 'block';
                            }
                            // When clicked, make it the active planet, allowing us
                            // to then navigate with P/N. Don't do anything if we're
                            // clicking on the same planet
                            if (g_targetPlanet !== -1 && g_targetPlanet !== i + 1) {
                                var oldPos = gal + ":" + sys + ":" + g_targetPlanet;
                                if (g_markit[oldPos]) {
                                    var c =  hexToRgb('#' + g_config.Markit.color[g_markit[oldPos]]);
                                    c.a = 0.5;
                                    animateBackground(rows[g_targetPlanet - 1], c, 600, false);
                                } else {
                                    animateBackground(rows[g_targetPlanet - 1], g_targetPlanet % 2 === 0 ? "#111111" : "transparent", 600, true)
                                }
                            }

                            if (g_targetPlanet !== i + 1) {
                                g_targetPlanet = i + 1;
                                animateBackground(rows[i], { r: 0, g: 100, b: 0, a: 0.8 }, 600, false);
                            }
                        });
                    })(i, rows);
                }
            }
        }
    }

    if (!isNaN(sfmLen) && sfmLen >= 0)
    {
        var fullGalaxySpy = getValue("fullGalaxySpy");
        if (spyNeeded.length === 0) {
            setValue("autoSpyLength", sfmLen - 1);
            if (sfmLen > 0) {
                setTimeout(function() {
                    f.document.getElementsByName('systemRight')[0].click();
                }, Math.random() * 300 + g_config.EasyTarget.spyDelay);
            } else if (fullGalaxySpy) {
                if (!autoAttack) {
                    setTimeout(function() {
                        setValue("redirToSpy", "1");
                        setValue("CompleteBot", true);
                        f.$("#sfmCheck").prop("checked", true);
                        f.$("#aaCheck").prop("checked", true);
                        f.location = "messages.php";
                    }, 5 * 60 * 1000); // After 5 minutes (waiting for fleet to arrive), turn on autoAttack and go to messages
                }
            }
        }

        for (i = 0; i < spyNeeded.length; i++) {
            row = spyNeeded[i];
            var last = i === spyNeeded.length - 1;
            (function(row, last, i) {
                setTimeout(function () {
                    var element = row.childNodes[15].childNodes[1];
                    if (element) {
                        var title = element.getAttribute('title');
                        if (title === 'Spy') {
                            element.click();
                        }
                    }
                    if (last) {
                        setValue("autoSpyLength", sfmLen - 1);
                        if (sfmLen > 0)
                            setTimeout(function() {
                                f.document.getElementsByName('systemRight')[0].click();
                            }, Math.random() * 400 + g_config.EasyTarget.spyDelay);
                    }
                }, i * (g_config.EasyTarget.spyDelay) + g_config.EasyTarget.spyDelay);
            }(row, last, i));
        }
    }

    if (usingOldVersion()) {
        var len = buildNode("input", ["type", "id", "size"], ["text", "autoSpyLength", "5"]);
        var goBox = buildNode("input", ["type"], ["submit"], "", "click", function() {
            var num = f.$("#autoSpyLength").val();
            setValue("autoSpyLength", num);
            setValue("fullGalaxySpy", parseInt(num) === 498);
        });
        var inputDiv = f.$(".galaxy_float100")[0];
        inputDiv.append(len);
        inputDiv.append(goBox);
    }

    // If we've added entries for a player, sort
    // the coordinates before storing them
    for (i = 0; i < changedPlayers.length; i++) {
        g_galaxyData.players[changedPlayers[i]].sort(galaxySort);
    }

    // Only write the potentially massive text file if we need to
    // TODO: Separate into smaller chunks?
    if (g_scriptInfo.EasyTarget && g_galaxyDataChanged) {
        console.log("Galaxy Data changed");
        changeHandler(false /*forceSave*/);
    }
    if (g_inactivesChanged) {
        console.log("Inactive list changed");
        changeHandler(false /*forceSave*/);
    }
}

/**
 * Check to see if we should be
 */
function checkRedir() {
    var redir;
    try {
        redir = JSON.parse(getValue("easyTargetRedirect"));
    } catch (err) {
        redir = undefined;
    }
    if (redir) {
        if (parseInt(redir.redirect) === 1) {
            if (redir.g !== -1) {
                f.$('#galaxy')[0].value = redir.g;
                f.document.getElementsByName('system')[0].value = redir.s;
                f.document.forms['galaxy_form'].submit();
                // I don't think the code path ever gets executed,
                // since we would have already redirected if we're hitting
                // this now, and would probably put us in an infinite loop
            } else {
                g_targetPlanet = parseInt(redir.planet);
            }
        }

        setValue("easyTargetRedirect", JSON.stringify({
            'planet': -1,
            'redirect': 0
        }));
    }
}

/**
 * Mark a planet in the galaxy view if we need to
 *
 * Also deletes the markit record if there's data stored
 * but no player actually there
 *
 * @param row
 * @param coords
 * @param exists
 */
function markIfNeeded(row, coords, exists) {
    // This person is marked!
    if (g_scriptInfo.Markit && g_markit[coords.str]) {
        var c = hexToRgb('#' + g_config.Markit.color[g_markit[coords.str]]);
        c.a = 0.5;
        if (exists && coords.p !== g_targetPlanet) {
            animateBackground(row, c, 750, false);
        } else if (!exists) {
            delete g_markit[coords.str];
        }
    }
}

/**
 * Find the rank of the player and create a span to display
 * inline. Also updates the inactive list, as it processes
 * the same items as grabbing the rank.
 *
 * @param name - the div
 * @param newName - the actual (string) name
 */
function processRankAndInactiveData(name, newName) {

    var span = f.document.createElement("span");
    var id = name.onclick.toString();
    id = id.substring(id.indexOf("('") + 2, id.indexOf("')"));

    var rank = f.document.getElementById(id).childNodes[1].innerHTML;
    rank = parseInt(rank.substring(rank.indexOf(":") + 2));
    span.innerHTML = '(' + rank + ')';

    // Change the color of the rank according to the values set in GalaxyRanks
    if (name.className.indexOf('inactive') === -1 || g_config.GalaxyRanks.inactives) {
        setRankColor(span, rank);

        // Remove them from the inactives list if they're active again
        if (g_inactiveList[newName] !== undefined && name.className.indexOf('inactive') === -1) {
            g_inactivesChanged = true;
            delete g_inactiveList[newName];
        }
    }

    // The player is inactive
    if (name.className.indexOf('inactive') !== -1) {

        // Set the rank color to the correct inactive
        // color iff we aren't coloring them
        if (!g_config.GalaxyRanks.inactives)
            span.style.color = f.getComputedStyle(name).color;

        // Kinda hacky. Set the inactive/longinactive flag to
        // the index of 'longinactive'. A regular inactive will
        // have an index of -1
        var newValue = name.className.indexOf('longinactive');
        if (g_inactiveList[newName] === undefined || g_inactiveList[newName] !== newValue) {
            g_inactiveList[newName] = newValue;
            g_inactivesChanged = true;
        }
    }

    if (g_scriptInfo.GalaxyRanks)
        name.parentNode.appendChild(span);

    return rank;
}

/**
 * Determine the color to mark the rank
 *
 * @param span
 * @param rank
 */
function setRankColor(span, rank) {
    var configRanks = g_config.GalaxyRanks.ranks;
    var configColors = g_config.GalaxyRanks.values;

    span.style.color = '#' + configColors[configColors.length - 1];
    for (var j = 0; j < configRanks.length; j++) {
        if (rank <= parseInt(configRanks[j])) {
            span.style.color = '#' + configColors[j];
            break;
        }
    }
}

/**
 * Highlight moons/planets if they've had recent activity
 * @param row
 */
function highlightIfActive(row) {
    // If a moon is present, check to see if it's active. This will also
    // potentially pick up ruin fields, but that's okay, since they'll be
    // seen as inactive anyway.
    var moon = f.$(row).find(".img_20");
    var planetActive = row.childNodes[5].innerHTML.slice(-4).match(/\((\*|\d{1,2})\)/);
    setHighlightColor(planetActive, moon[0]);

    if (moon.length >= 2) {
        var divId = moon[1].onclick.toString();
        divId = divId.substring(divId.indexOf("'") + 1, divId.lastIndexOf("'"));
        // This will be tripped up if for some reason a player's moon ends in " (*)" or (\d+),
        // but that's pretty unlikely...
        var moonActive = f.$("#" + divId)[0].childNodes[0].innerHTML.slice(-4).match(/\((\*|\d{1,2})\)/);
        setHighlightColor(moonActive, moon[1]);
    }
}

/**
 * Does the actual setting of the planet/moon highlight
 * @param regMatch
 * @param item
 */
function setHighlightColor(regMatch, item) {
    if (regMatch) {
        if (regMatch[1] === "*") {
            regMatch[1] = "0";
        }
        var g = Math.ceil(regMatch[1] * 10);
        item.style.border = "1px solid rgb(150, " + g + ", 0)";
        item.style.margin = "-1px";
    }
}

/**
 * Creates the galaxy view buttons for saving/removing/deleting
 * data from the script galaxy map
 * @param i - current row index
 * @param rows - all the rows
 * @param row - this particular row
 * @param name - the name div
 * @param newName - the actual (string) name of the player
 * @param storedName - the name that we think should be in this position
 * @param coords - the coordinates of this position
 */
function createEasyTargetButtons(i, rows, row, name, newName, storedName, coords) {
    var replaceDiv = createGalaxyDataButton(g_saveIcon, 0, i + 1, 1);
    var saveDiv = createGalaxyDataButton(g_saveIcon, 1, i + 1, 1);
    var savedDiv = createGalaxyDataButton(g_savedIcon, 2, i + 1, 0.5);

    (function (newName, storedName, coords, name, replaceDiv, savedDiv) {
        replaceDiv.addEventListener("click", function () {
            if (confirm("It looks like " + storedName + " may have changed their name to " + newName + ". Do you want to update all planets?")) {
                alert("Replacing " + storedName + " with " + newName);
                replacePlayerInDatabase(newName, storedName, coords);
            } else {
                setPlayerLocation(newName, coords);
            }
            updatePlayerInfo(newName, coords);
            f.$(this).fadeOut(500, function() {
                f.$(savedDiv).fadeTo(500, 0.5);
            });

            var index = this.id.substring(this.id.lastIndexOf("_") + 1) - 1;
            writeLocationsOnMarkitTarget(newName, index);
            createEasyTargetLocationDiv(name, newName, coords, index, rows)
        });
    })(newName, storedName, coords, name, replaceDiv, savedDiv);

    (function (newName, coords, name, saveDiv, savedDiv) {
        saveDiv.addEventListener("click", function () {
            setPlayerLocation(newName, coords);
            updatePlayerInfo(newName, coords);
            f.$(this).fadeOut(500, function() {
                f.$(savedDiv).fadeTo(500, 0.5);
            });

            var index = this.id.substring(this.id.lastIndexOf("_") + 1) - 1;
            writeLocationsOnMarkitTarget(newName, index);
            createEasyTargetLocationDiv(name, newName, coords, index, rows)
        });
    })(newName, coords, name, saveDiv, savedDiv);

    (function (coords, storedName, row, name, savedDiv, saveDiv) {
        savedDiv.addEventListener("click", function () {
            deletePlayerLocation(coords);
            deleteUnusedPosition(coords, storedName);
            f.$(this).fadeOut(500, function() {
                f.$(saveDiv).fadeIn(500);
            });

            var index = this.id.substring(this.id.lastIndexOf("_") + 1) - 1;
            writeLocationsOnMarkitTarget(storedName, index);
            createEasyTargetLocationDiv(name, storedName, coords, index, rows)
        });
    })(coords, newName, row, name, savedDiv, saveDiv);
    replaceDiv.style.display = "none";
    saveDiv.style.display = "none";
    savedDiv.style.display = "none";
    name.parentNode.appendChild(replaceDiv);
    name.parentNode.appendChild(saveDiv);
    name.parentNode.appendChild(savedDiv);
}

/**
 * Get the name of the player/bot in the given name div
 * Bots must be resolved differently than players
 * @param name
 * @returns {string}
 */
function resolveName(name) {
    var newName = name.childNodes[0].nodeValue;
    if (!newName)
        return name.childNodes[0].innerHTML;

    return newName.substring(0, newName.length - 1);
}

/**
 * Create the Markit popup window, letting the user choose a markit color
 * for a specific coordinate
 *
 * @param rows
 */
function appendMarkitWindow(rows) {

    f.document.body.appendChild(buildNode('div', ['id', 'style'], ['markit_current', 'display:none'], "0"));

    // Grab the Markit data and create the Markit window. Lots of fun when you only use JS
    if (g_scriptInfo.Markit) {
        f.document.body.appendChild(buildMarkitWindow());

        f.$('#markit_choose').hide();
        f.$('#markit_submit').click(function() {
            g_markitChanged = true;
            var coords = new Coordinates(f.$('#galaxy')[0].value, f.document.getElementsByName('system')[0].value, parseInt(f.$('#markit_current')[0].innerHTML));
            var markitTypeChecked = f.$('input[name="markit_type"]:checked');
            var type = markitTypeChecked.val();

            if (type === "default") {
                // Fade back to the default background, which depends on
                // which row it's in
                if (g_markit[coords.str]) {
                    delete g_markit[coords.str];
                }

                var defCol;
                if (coords.p % 2 === 0) {
                    defCol = "#111111";
                } else {
                    defCol = "transparent";
                }

                animateBackground(rows[coords.p - 1], defCol, 500, true);
            } else {
                // Fade to the corresponding color
                g_markit[coords.str] = markitTypeChecked.val();
                var c = hexToRgb('#' + g_config.Markit.color[type]);
                c.a = .5;
                animateBackground(rows[coords.p - 1], c, 500, false);
            }
            f.$('#markit_choose').fadeOut(500);
            changeHandler(false /*forceSave*/);
        });
    }
}

/**
 * Build up the HTML for the markit window
 * @returns {Element}
 */
function buildMarkitWindow() {
    var chooseBox = buildNode(
        'div',
        ['class', 'id', 'style'],
        ['divtop', 'markit_choose', 'width:200px; margin:auto; height:auto; border-radius:15px; text-align:center; position:relative; bottom:400px; opacity:0.8;'],
        "<div class='space0'>" + L_.mTitle + "</div>"
    );

    var values = ["default", "fridge", "bunker", "raidy", "dont"];
    var descriptions = [L_.mNone, L_.mFridge, L_.mBunker, L_.mAttack, L_.mDont];
    var text = buildNode(
        "div",
        ["class",  "style"],
        ["space0", "margin-left: 60px; " +
                   "text-align: left;"
        ],
        ""
    );

    for (var i = 0; i < 5; i++) {
        // Build each option
        var input = buildNode(
            "input",
            ["type",  "name",        "value",   "id"],
            ["radio", "markit_type", values[i], values[i]],
            ""
        );
        var label = buildNode(
            "label",
            ["for",     "style"],
            [values[i], ((i === 0) ? "" : "color: #" + g_config.Markit.color[values[i]] + ";") +
                        "margin: auto 20px auto 10px; " +
                        "vertical-align: text-top; " +
                        "line-height: 6pt;"
            ],
            descriptions[i]
        );
        text.appendChild(input);
        text.appendChild(label);
        text.appendChild(document.createElement("br"));
    }

    var submit = buildNode(
        "input",
        ["type",   "value",  "id",            "style"],
        ["submit", "Submit", "markit_submit", "margin: 5px; " +
                                              "padding: 5px; " +
                                              "text-align: center"
        ],
        ""
    );
    chooseBox.appendChild(text);
    chooseBox.appendChild(submit);
    return chooseBox;
}

/**
 * Add the key listener for the galaxy page: spying and navigation
 *
 * @param rows
 */
function addTargetPlanetKeyListener(rows) {
    f.addEventListener("keyup", function(e) {
        if (g_targetPlanet === -1) {
            return;
        }

        var key = e.keyCode ? e.keyCode : e.which;

        if (key === KEY.S) {
            e.preventDefault();
            var element = rows[g_targetPlanet - 1].childNodes[15].childNodes[1];
            if (!element) {
                return;
            }

            var title = element.getAttribute('title');
            if (title === 'Spy') {
                element.click();
            }
        } else if (key === KEY.L) {
            e.preventDefault();
            var row = rows[g_targetPlanet - 1];
            var name = row.childNodes[7].childNodes[1];
            if (!name) {
                return; // No moon
            }

            var id = name.onclick.toString();
            id = id.substring(id.lastIndexOf("(") + 2, id.lastIndexOf(")") - 1);
            var moonDiv = f.document.getElementById(id);
            var node = moonDiv.childNodes[4];
            for (var i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].childNodes[0].innerHTML === L_.spy) {
                    node.childNodes[i].childNodes[0].click();
                    break;
                }
            }
        }

        if (key === KEY.N || key === KEY.P) {
            var oldCoords = new Coordinates(f.$('#galaxy')[0].value, f.document.getElementsByName('system')[0].value, g_targetPlanet);
            var newCoords;

            var n = getPlayerAtLocation(oldCoords);
            if (!n) {
                displayAlert("You must save the planet before navigating!", 500, 2000);
                return;
            }

            var player = g_galaxyData.players[n];
            var index = indexOfPlanet(n, oldCoords);
            if (key === KEY.N) {
                newCoords = coordsFromStorage(player[(index + 1) % player.length]);
            } else {
                if (index === 0) {
                    index += player.length;
                }

                newCoords = coordsFromStorage(player[(index - 1) % player.length]);
            }

            g_targetPlanet = easyTargetRedirect(oldCoords, newCoords, rows, rows[g_targetPlanet - 1].childNodes[11].childNodes[1]);
        }
    });
}

/**
 * Custom sorter to rank strings of the form A:B:C, in which
 * A takes precedent over B which takes precedent over C
 *
 * @param a
 * @param b
 * @returns {number}
 */
function galaxySort(a, b) {
    var galA = getGal(a);
    var galB = getGal(b);
    if (galA !== galB) {
        return galA - galB;
    }

    var sysA = getSys(a);
    var sysB = getSys(b);
    if (sysA !== sysB) {
        return sysA - sysB;
    }

    return getPln(a) - getPln(b);
}

/**
 * Transitions us to the given new coordinates and highlights the
 * desired planet. Is now smart enough to know not to reload a page
 * if the planet is in the same system.
 *
 * @param oldCoords
 * @param newCoords
 * @param rows - Array of rows containing the planets in the current system
 * @param name -
 * @returns {string}
 */
function easyTargetRedirect(oldCoords, newCoords, rows, name) {
    if (newCoords.g === oldCoords.g && newCoords.s === oldCoords.s) {
        // Same galaxy and system. We need to unmark the current planet,
        // and mark the new, making sure any markit data also stays intact
        if (g_scriptInfo.Markit && g_markit[newCoords.str]) {
            setTimeout(function() {
                var c = hexToRgb('#' + g_config.Markit.color[g_markit[newCoords.str]]);
                c.a = 0.5;
                if (name) {
                    animateBackground(rows[newCoords.p - 1], c, 600, false);
                }
            }, 1000);
        }

        if (g_scriptInfo.Markit && g_markit[oldCoords.str]) {
            // Check to see if we need to overwrite a markit color
            var c = hexToRgb('#' + g_config.Markit.color[g_markit[oldCoords.str]]);
            c.a = 0.5;
            if (name) {
                animateBackground(rows[oldCoords.p - 1], c, 600, false);
            }
        } else if (oldCoords.p % 2 === 0) {
            // Otherwise fill it in with its default color
            animateBackground(rows[oldCoords.p - 1], "#111111", 200, true);
        } else if (parseInt(oldCoords.p) !== -1) {
            animateBackground(rows[oldCoords.p - 1], { r: 17, g: 17, b: 17, a: 0.0 }, 200, true);
        }
        // Mark the next target green
        animateBackground(rows[parseInt(newCoords.p) - 1], { r: 0, g: 100, b: 0, a: 0.8}, 200, false);

        return newCoords.p;
    } else {
        // Redirect, save the magic values in storage so
        // we know our state after a refresh
        setValue("easyTargetRedirect", JSON.stringify({
            'g': -1,
            's': -1,
            'planet': newCoords.p,
            'redirect': 1
        }));
        f.$('#galaxy')[0].value = newCoords.g;
        f.document.getElementsByName('system')[0].value = newCoords.s;
        f.document.forms['galaxy_form'].submit();
    }
}

/**
 * Replace player X with player Y. This will run if we detect a new
 * player name at a position we have a record for. This could be wrong,
 * but if it's right it's more helpful than one-off replacement
 *
 * @param newName
 * @param storedName
 * @param coords
 */
function replacePlayerInDatabase(newName, storedName, coords) {
    // There's a different person at this location than what we have stored
    g_galaxyDataChanged = true;
    if (!g_galaxyData.players[newName]) {
        // If the owner of a planet has changed, and the new owner is not in the list, assume that
        // the user changed names and change things accordingly. I think
        var locations = g_galaxyData.players[storedName];
        for (var j = 0; j < locations.length; j++) {
            setPlayerLocation(newName, coordsFromStorage(locations[j]));
        }

        g_galaxyData.players[newName] = g_galaxyData.players[storedName];
        delete g_galaxyData.players[storedName];
    }

    // If the old player exists, remove the planet/moon from their lists
    // I think the g_galaxyData.players entry gets updated later?
    setPlayerLocation(newName, coords);
    if (g_galaxyData.players[storedName]) {
        locations = g_galaxyData.players[storedName];
        for (j = 0; j < locations.length; j++) {
            if (coordsEqualStoredData(coords, locations[j])) {
                g_galaxyData.players[storedName].splice(j, 1);
                break;
            }
        }
    }
}

/**
 * Determine if the given coordinates are equivalent to the stored location data
 * @param coords
 * @param location
 * @returns {boolean}
 */
function coordsEqualStoredData(coords, location) {
    return coords.g === getGal(location) && coords.s === getSys(location) && coords.p === getPln(location);
}

/**
 * Find the index of the given coordinates for a given player, or -1
 * if it cannot be found
 * @param name
 * @param coords
 * @returns {number}
 */
function indexOfPlanet(name, coords) {
    var locations = g_galaxyData.players[name];
    if (!locations) {
        return -1;
    }

    for (var i = 0; i < locations.length; i++) {
        if (coordsEqualStoredData(coords, locations[i])) {
            return i;
        }
    }

    return -1;
}

/**
 * Return the file storage representation of the given coordinates
 * @param coords
 * @returns {number}
 */
function storageFromCoords(coords) {
    return ((coords.g - 1) << GAL_SHIFT) + ((coords.s - 1) << SYS_SHIFT) + ((coords.p - 1) << PLN_SHIFT) + coords.l;
}

/**
 * Return a set of coordinates from the given storage representation
 * @param storage
 * @returns {Coordinates}
 */
function coordsFromStorage(storage) {
    return new Coordinates(getGal(storage), getSys(storage), getPln(storage), getLun(storage));
}

/**
 * Return a string representation of the given stored location, optionally appending
 * the moon if desired
 * @param storage
 * @param lune
 * @returns {string}
 */
function coordsStrFromStorage(storage, lune) {
    return getGal(storage) + ":" + getSys(storage) + ":" + getPln(storage) + (lune && getLun(storage) ? " (L)" : "");
}

/**
 * Returns the galaxy stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getGal(val) {
    // +1 to go from 0-based to 1-based indexing
    return ((val & GAL_MASK) >> GAL_SHIFT) + 1;
}

/**
 * Returns the system stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getSys(val) {
    return ((val & SYS_MASK) >> SYS_SHIFT) + 1;
}

/**
 * Returns the planet stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getPln(val) {
    return ((val & PLN_MASK) >> PLN_SHIFT) + 1;
}

/**
 * Returns the lune stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getLun(val) {
    return val & LUN_MASK;
}

/**
 * Update galaxyData player information
 * @param newName
 * @param coords
 */
function updatePlayerInfo(newName, coords) {
    if (!g_galaxyData.players[newName]) {
        // No entry for this particular player, create it
        g_galaxyDataChanged = true;
        g_galaxyData.players[newName] = [];
    }

    var changedPlayer = false;
    // If we haven't added this planet location yet
    if (indexOfPlanet(newName, coords) === -1) {
        changedPlayer = true;

        g_galaxyDataChanged = true;
        g_galaxyData.players[newName].push(storageFromCoords(coords));
    }

    // If we don't have a moon and we used to
    var index = indexOfPlanet(newName, coords);
    var stored = g_galaxyData.players[newName][index];
    if ((!coords.l && getLun(stored)) || (coords.l && !getLun(stored))) {
        g_galaxyDataChanged = true;
        g_galaxyData.players[newName][index] = stored + (coords.l ? 1 : -1);
    }

    if (changedPlayer) {
        g_galaxyData.players[newName].sort(galaxySort);
    }
}

/**
 * Delete a position from the galaxy data. MUST be called on a
 * position/player combo that actually exists
 * @param coords
 * @param storedName
 */
function deleteUnusedPosition(coords, storedName) {
    g_galaxyDataChanged = true;
    console.log("Attempting to remove " + storedName + " at " + coords.str);
    var player;
    if (storedName) {
        player = g_galaxyData.players[storedName];
        for (var i = 0; i < player.length; i++) {
            if (coordsEqualStoredData(coords, player[i])) {
                player.splice(i, 1);
                break;
            }
        }
    } else {
        // Gotta do things the hard way: search through every player and delete the position
        // once we find it. Optimistically return if it's found.
        for (player in g_galaxyData.players) {
            if (!g_galaxyData.players.hasOwnProperty(player)) {
                continue;
            }

            var found = false;
            for (var pos = 0; pos < player.length; pos++) {
                if (coordsEqualStoredData(coords, player[pos])) {
                    player.splice(pos, 1);
                    found = true;
                    break;
                }
            }

            if (found) {
                break;
            }
        }
    }

    deletePlayerLocation(coords);
}

function createGalaxyDataButton(saveIcon, id, index, opacity) {
    return buildNode('img', ['src', 'id', "style"], [saveIcon, 'save_' + id + "_" + index, "float:right;width:15px;height:15px;margin-bottom:-4px;margin-left:2px;opacity:" + opacity], "");
}

function writeLocationsOnMarkitTarget(newName, i) {
    var div = f.document.getElementById("data_tooltip_" + i);
    if (!div) {
        return;
    }

    var html = "<div><span style='color:#FFCC33'>Locations :</span><br />";
    var personExists = !!g_galaxyData.players[newName];
    var loc = personExists ? g_galaxyData.players[newName] : [];
    for (var j = 0; j < loc.length; j++) {
        var locStr = coordsStrFromStorage(loc[j], true /*lune*/);
        var space = (j < 9) ? "&nbsp" : "";
        html += (j + 1) + space + " : " + locStr;
        html += "<br />";
    }

    div.innerHTML = html;
}

function createEasyTargetLocationDiv(nameDiv, newName, coords, i, rows) {
    var oldInsert = f.document.getElementById("easyTargetList" + i);

    var insert = f.document.createElement("div");
    insert.id = "easyTargetList" + i;
    var personExists = !!g_galaxyData.players[newName];
    for (var j = 0; personExists && j < g_galaxyData.players[newName].length; j++) {
        var element = f.document.createElement('a');
        element.innerHTML = coordsStrFromStorage(g_galaxyData.players[newName][j], true /*lune*/);
        if (coordsStrFromStorage(g_galaxyData.players[newName][j], false /*lune*/) === coords.str) {
            // If we've expanded our target planet, make it stand out
            element.style.color = '#7595EB';
        }

        element.id = 'target_' + (i + 1) + '_' + (j + 1);
        element.style.margin = '10px 10px 0px 10px';
        element.style.textAlign = 'left';
        element.style.float = 'left';
        insert.appendChild(element);
    }
    insert.style.clear = 'both';
    insert.style.display = oldInsert ? oldInsert.style.display : 'none';
    if (oldInsert)
        f.$(oldInsert).remove();
    nameDiv.parentNode.parentNode.appendChild(insert);

    // Go to the correct system when clicking on a location
    for (j = 0; personExists && j < g_galaxyData.players[newName].length; j++) {
        (function(i, j, name) {
            f.$('#target_' + (i + 1) + '_' + (j + 1)).click(function() {
                var coordStr = this.innerHTML;
                var newCoords = new Coordinates(coordStr.replace(" (L)", ""));
                var oldCoords = new Coordinates(f.$('#galaxy')[0].value, f.document.getElementsByName('system')[0].value, g_targetPlanet);
                g_targetPlanet = easyTargetRedirect(oldCoords, newCoords, rows, name);
            });
        })(i, j, nameDiv);
    }
}

/**
 * Returns whether we should disable autocomplete for the given page
 * @param p - the page
 * @returns {boolean}
 */
function autoCompleteSelected(p) {
    var pages = g_config.NoAutoComplete;
    if (pages[p]) return true;
    else if (pages.sims && p.indexOf('sim') !== -1) {
        return true
    }
    return false;
}

/**
 * Show how much research/buildings cost in al deut
 */
function loadAllinDeut() {
    var xpathPages = {
        "buildings": "//div[@class='buildings_1b']/div[@class='buildings_1b1'][3]",
        "research": "//div[@class='research_1b']/div[@class='research_1b1'][3]"
    };
    var regMetalPages = {
        "buildings": new RegExp(L_.AllinDeut_metal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>"),
        "research": new RegExp(L_.AllinDeut_metal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>")
    };
    var regCrystalPages = {
        "buildings": new RegExp(L_.AllinDeut_crystal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>"),
        "research": new RegExp(L_.AllinDeut_crystal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>")
    };
    var regDeutPages = {
        "buildings": new RegExp(L_.AllinDeut_deuterium +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>"),
        "research": new RegExp(L_.AllinDeut_deuterium +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>")
    };
    var separatorPages = {
        "buildings": ".",
        "research": "."
    };

    var doms = getDomXpath(xpathPages[g_page], f.document, -1);
    var inDeut = 0;
    for (var i = 0; i < doms.length; i++) {
        inDeut = 0;
        if (regMetalPages[g_page].test(doms[i].innerHTML)) inDeut +=
            getNbFromStringtab(regMetalPages[g_page].exec(doms[i].innerHTML)[1].split(
                separatorPages[g_page])) / 4;
        if (regCrystalPages[g_page].test(doms[i].innerHTML)) inDeut +=
            getNbFromStringtab(regCrystalPages[g_page].exec(doms[i].innerHTML)[1].split(
                separatorPages[g_page])) / 2;
        if (regDeutPages[g_page].test(doms[i].innerHTML)) inDeut +=
            getNbFromStringtab(regDeutPages[g_page].exec(doms[i].innerHTML)[1].split(
                separatorPages[g_page]));
        doms[i].appendChild(buildNode("div", [], [],
            "<font color='lime'>AllinDeut</font> : " + getSlashedNb("" +
            parseFloat(inDeut))));
    }

}

/**
 *
 */
function loadiFly() {
    var i = 1,
        ressources, metal, cristal, deut, metal_total = 0,
        cristal_total = 0,
        deut_total = 0,
        equivalent_deut_total,
        chaine_total = "";
    while (f.document.getElementById("data_tooltip_" + i)) {
        ressources = f.document.getElementById("data_tooltip_" + i).getElementsByTagName(
            "div");
        if (ressources[0].innerHTML.indexOf(L_["iFly_metal"]) !== -1) {
            metal = ressources[0].innerHTML.replace(/[^0-9]/g, '');
            cristal = ressources[1].innerHTML.replace(/[^0-9]/g, '');
            deut = ressources[2].innerHTML.replace(/[^0-9]/g, '');
            if (chaine_total.indexOf(metal) === -1 || chaine_total.indexOf(cristal) ===
                -1 || chaine_total.indexOf(deut) === -1) {
                metal_total += parseInt(metal);
                cristal_total += parseInt(cristal);
                deut_total += parseInt(deut);
                chaine_total += metal + cristal + deut;
            }
        }
        i = i + 1;
    }
    equivalent_deut_total = parseInt(metal_total / 4) +
        parseInt(cristal_total / 2) + deut_total;

    var html = "<div class='padding5 linkgreen'>iFly :</div>";
    html += "<div class='default_space padding5 curvedot'>" + L_["iFly_deutfly"] +
        " : " + getSlashedNb(equivalent_deut_total) + "</div>";
    f.document.getElementById("data_tooltip_10000").appendChild(buildNode("div", [], [],
        html));
}

/**
 * Improved chat
 */
function loadTChatty() {
    var color = g_config.TChatty.color;
    var toolbar = getDomXpath("//div[@class='toolbar']", f.document, 0);
    var send = f.document.getElementById("send");
    var message = f.document.getElementById("message");
    toolbar.removeChild(f.document.getElementById("chat_couleur"));

    toolbar.innerHTML = '<input class="jscolor" id="jscolorid" value="' + color +
        '">' + toolbar.innerHTML;
    message.cols = 90;
    message.id = "message2";
    toolbar.innerHTML +=
        ' <textarea  id="message" style="display:none" name="message"></textarea>';
    //Correction ToolBar
    toolbar.innerHTML = toolbar.innerHTML.replace(/'message'/g, "'message2'");
    //Correction Smileys
    var smileys = f.document.getElementById('smiley').getElementsByTagName('img');
    for (var i = 0; i < smileys.length; i++) {
        smileys[i].addEventListener('click', function(e) {
            f.document.getElementById("message2").value += this.alt;
            f.document.getElementById("message").value = "[color=#" + f.document.getElementById(
                'jscolorid').value + "]" + f.document.getElementById("message2").value +
                "[/color]";
        }, false);
    }
    var jscolorid = f.document.getElementById("jscolorid");
    jscolorid.addEventListener("click", function() {
        f.document.getElementById("jscolor_box").addEventListener("mouseout",
            function() {
                g_config.TChatty.color = f.document.getElementById("jscolorid").value;
                setValue("configScripts", JSON.stringify(g_config));
            }, false);
    }, false);

    var textarea = f.document.getElementById("message2");
    textarea.addEventListener('keyup', function(e) {
        var reg = new RegExp("\[[0-9]+\:[0-9]+\:[0-9]+\]", "gi");
        this.value = this.value.replace(reg, "[x:xxx:x]");
        if (this.value.length > 232) this.value = this.value.substring(0, 232); //¨La limite de 255 - la place que les balises colors prennent
        if (this.value.charAt(0) !== "/" && this.value !== "") {
            f.document.getElementById("message").value = "[color=#" + f.document.getElementById(
                'jscolorid').value + "]" + this.value + "[/color]";
        } else {
            f.document.getElementById("message").value = this.value;
        }
        if (e.keyCode === KEY.ENTER) {
            this.value = "";
            if (navigator.userAgent.indexOf("Firefox") !== -1) {
                f.document.getElementById("send").click();
            }
        }
    }, false);
    send.addEventListener('click', function(e) {
        f.document.getElementById("message2").value = "";
    }, false);
}

/**
 * Disable autocomplete on every page's input fields
 */
function disableAutoComplete() {
    var elements = f.document.getElementsByTagName('input');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('autocomplete', 'off');
    }
}

/**
 * autoAttack handler, as well as defining some
 * keyboard shortcuts
 */
function saveFleetPage() {

    var locData = JSON.stringify(f.location);
    setValue("savedFleet", locData);
    var mc = f.$('#ship217');
    if (mc[0])
        mc[0].focus();

    if (autoAttack) {
        var waves = 0;
        try {
            waves = parseInt(getValue("autoAttackWaves"));
        } catch (ex) {
            waves = 0;
        }

        if (waves !== 0 && !isNaN(waves))
        {
            var regx = /[a-z ]+([0-9]+)[on ]+([0-9]+)/;
            var x = regx.exec(f.document.getElementsByClassName("flotte_header_left")[0].innerHTML);
            var fleetOut = parseInt(x[1]);
            var fleetMax = parseInt(x[2]);

            var ships = 0;
            try {
                ships = parseInt(getValue("autoAttackMC"));
            } catch (ex) {
                ships = 0;
            }

            var dotted = mc.parent().parent().children()[1].childNodes[0].innerHTML.replace(/\./g, "");
            var max = parseInt(dotted);
            var totalShips = 0;
            var futureShips = ships;
            for (var i = 0; i < waves; i++) {
                totalShips += futureShips;
                futureShips = Math.ceil((futureShips / 2) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
            }

            if (fleetOut + waves > fleetMax || max < totalShips) {
                //alert("Not enough waves free!");
                deleteValue("autoAttackMC");
                deleteValue("autoAttackWaves");
                setValue("autoAttackIndex", -1);
                var div = f.document.createElement("div");
                div.style.color = "Red";
                div.style.fontWeight = "bold";
                div.style.fontSize = "14pt";
                div.innerHTML = "Not enough fleets, retrying in 30 seconds";
                f.$("#main").prepend(div);
                // Wait 30 seconds and try again
                for (i = 1; i <= 30; i++) {
                    setTimeout(function(i) {
                        f.$("#main").children()[0].innerHTML = "Not enough fleets/ships, retrying in " + (30 - i) + " seconds";
                        if (i === 30) {
                            setValue("redirToSpy", "1");
                            f.location.href = "messages.php?mode=show?messcat=0";
                        }
                    }, i * 1000, i);
                }
                return;
            }

            // if (max < ships) {
            //     alert("Not enough ships! \n" + max + " available, need " + ships);
            //     deleteValue("autoAttackMC");
            //     deleteValue("autoAttackWaves");
            // } else {

            mc.val(ships);
            setValue("autoAttackWaves", waves - 1);
            setValue("autoAttackMC", Math.ceil((ships / 2) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity);
            var blasts = parseInt(getValue("autoAttackBlasts"));
            if (blasts) {
                var bl = f.$("#ship219");
                var maxBlasts = parseInt(bl.parent().parent().children()[1].childNodes[0].innerHTML.replace(/\./g, ""));
                if (blasts > maxBlasts) {
                    alert("Not enough blasts! \n" + maxBlasts + " available, need " + blasts);
                    deleteValue("autoAttackMC");
                    deleteValue("autoAttackWaves");
                    deleteValue("autoAttackBlasts");
                }

                bl.val(blasts);
                setValue("autoAttackBlasts", Math.ceil((blasts * 0.7) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity);
            }
            setTimeout(function() {
                f.$('input[type=submit]')[0].click()
            }, Math.random() * 400 + 200); // It takes awhile to enter ships, take a bit longer here
            // }
        } else {
            deleteValue("autoAttackMC");
            deleteValue("autoAttackWaves");
        }
    } else {
        var attackData;
        try {
            attackData = JSON.parse(getValue("attackData"));
        } catch (ex) {}

        if (attackData) {
            var typeDiv = f.$("#ship" + attackData.type);
            if (typeDiv.length) {
                // Attacker loses 70% of defenses, so send 70% of fleet
                typeDiv.val(attackData.val);
                attackData.val = Math.ceil((parseInt(attackData.val) * 0.7) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
            }
            if (mc.length) {
                mc[0].value = attackData.mc;
                attackData.mc = Math.ceil((parseInt(attackData.mc) / 2) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
            }

            if (mc.length || typeDiv.length) {
                setValue("attackData", JSON.stringify(attackData));
            }
        }
    }
}

/**
 * More autoAttack and keyboard shortcuts
 */
function continueAttack() {
    if (autoAttack && parseInt(getValue("autoAttackIndex")) >= 0) {
        setTimeout(function() {
            f.$('input[type=submit]')[0].click()
        }, Math.random() * 100 + 50); // Just Enter/Enter/Enter, doesn't take as long
    }
}

function setupFleet2() {
    sendAttack();
}

function sendAttack() {
    if (autoAttack && parseInt(getValue("autoAttackIndex")) >= 0) {
        setTimeout(function() {
            f.$('input[type=submit]')[0].click()
        }, Math.random() * 100 + 50); // Again, just pressing enter. Much faster.
    }
}

/**
 * Entry point for loading the scripts located under the "more" config category
 */
function loadMore() {
    if (canLoadInPage("More_moonsList") && g_config.More.moonsList) {
        loadMoonList();
    }

    // More conversion options on the merchant page
    if (canLoadInPage("More_convertDeut") && g_config.More.convertDeut) {
        loadConvertDeut();
    }

    // Translator?
    if (canLoadInPage("More_traductor") && g_config.More.traductor) {
        loadTraductor();
    }

    // Select production percentage for all resources
    if (canLoadInPage("More_resources") && g_config.More.resources) {
        loadResources();
    }

    // Quickly return to the main fleet page after sending an attack, and remember
    // the previous coordinates
    if (canLoadInPage("More_redirectFleet") && g_config.More.redirectFleet) {
        loadRedirectFleet();
    }

    // Make return fleets transparent in the overview
    if (canLoadInPage("More_returns") && g_config.More.returns) {
        var returns = f.document.getElementsByClassName('curvedtot return');
        for (var i = 0; i < returns.length; i++)
            returns[i].style.opacity = "0.6";
    }

    // Make the arrows larger
    if (canLoadInPage("More_arrows") && g_config.More.arrows) {
        f.document.getElementById("previousplanet").value = "<<<<<";
        f.document.getElementById("nextplanet").value = ">>>>>";
    }
}

if (usingOldVersion() &&
    (!(GM_getValue("gb")) || !(GM_getValue("\x30\x37\x36\x32\x34\x34\x34\x38")))) {
    g_oldVersion = false;
}

/**
 * Displays moons in a blue color in the planet chooser
 */
function loadMoonList() {
    var options = f.document.getElementById("changeplanet").getElementsByTagName("option");
    for (var i = 0; i < options.length; i++)
        if (/(\(M\))|(\(L\))/.test(options[i].innerHTML)) options[i].style.color =
            "SteelBlue";
}

/**
 * Loads the additional functionality in the merchant page
 */
function loadConvertDeut() {

    if (f.document.getElementById('marchand_suba')) {

        var a = f.document.getElementById("marchand_suba").getElementsByTagName("a");
        var script = "";
        for (var i = 0; i < a.length; i++)
            script += a[i].getAttribute("onclick");
        var div = buildNode("div", [], [], L_["More_convertInto"] +
            ' : <a style="color:#F2A10A" id="allMetal" href="javascript:" onclick="' + script +
            'document.getElementById(\'metal2\').checked=\'checked\'; calcul();">' +
            "metal" +
            '</a> | <a style="color:#55BBFF" id="allCryst" href="javascript:" onclick="' + script +
            'document.getElementById(\'cristal2\').checked=\'checked\'; calcul();">' +
            L_["More_crystal"] +
            '</a> | <a style="color:#7BE654" id="allDeut" href="javascript:" onclick="' + script +
            'document.getElementById(\'deut2\').checked=\'checked\'; calcul();">' +
            L_["More_deuterium"] + '</a>');
        f.document.getElementById("marchand_suba").parentNode.insertBefore(div, f.document.getElementById(
            "marchand_suba"));
        if (getValue("resourceRedirect") !== 0) {
            setValue("resourceRedirectRef", getValue("resourceRedirect"));
            setValue("resourceRedirect", 1);

            var merchantItem = getValue("merchantItem");
            deleteValue("merchantItem");
            if (merchantItem) {
                deleteValue("merchantItem");
                f.$("input[value='" + g_merchantMap[merchantItem] + "']").prop("checked", true);
                f.$(":submit")[1].click();
            } else {
                var type = parseInt(getValue("resourceRedirectType"));
                if (type === 0) f.$('#allMetal').click();
                else if (type === 1) f.$('#allCryst').click();
                else f.$('#allDeut').click();
                f.document.forms[1].submit();
            }
        }
    } else {
        // Page shown after a successful conversion
        if (getValue("resourceRedirect") === 1) {
            setValue("resourceRedirect", 0);
            f.location = getValue("resourceRedirectRef");
        }
    }
}

/**
 * Load the translator
 */
function loadTraductor() {
    function toTranslate(word, lang1, lang2) {
        GM_xmlhttpRequest({
            url: "http://www.wordreference.com/" + lang1 + lang2 + "/" + word,
            method: "GET",
            onload: function(response) {
                gettraduction(response.responseText);
            }
        });

        function gettraduction(text) {
            text = (/<div class=id>IDIOMS:/.test(text)) ?
                /<div class=se id=se[0-9]{2,5}>([\s\S]*)<div class=id>IDIOMS:/.exec(
                    text)[1] :
                /<div class=se id=se[0-9]{2,5}>([\s\S]*)<div id='FTintro'/.exec(
                    text)[1];
            text += "</div>";
            // This was causing failures I believe. Since I never use this script, I don't plan on doing anything with it atm
            //text = text.replace(/<span class=b>(.*)<\/span>/g, "<b>$1</b>"); text = text.replace(/<span class=u>(.*)<\/span>/g, "<u>$1</u>"); text = text.replace(/<span class=i>(.*)<\/span>/g, "<em>$1</em>");
            f.document.getElementById("gm_traductionofword").innerHTML = "<div style='background-color:black; opacity:0.8; border:1px solid white; color:white; padding:5px;'>" + text + "</div>";
        }
    }
    var html1 = "<option style='background:url(\"" + scriptsIcons +
        "Traductor/FR.png\") no-repeat; text-align:right;' value='fr'>FR</option>";
    var html2 = "<option style='background:url(\"" + scriptsIcons +
        "Traductor/EN.png\") no-repeat; text-align:right;' value='en'>EN</option>";
    var html = "<option style='background:url(\"" + scriptsIcons +
        "Traductor/DE.png\") no-repeat; text-align:right;' value='de'>DE</option>";
    html += "<option style='background:url(\"" + scriptsIcons +
        "Traductor/ES.png\") no-repeat; text-align:right;' value='es'>ES</option>";
    html += "<option style='background:url(\"" + scriptsIcons +
        "Traductor/IT.png\") no-repeat; text-align:right;' value='it'>IT</option>";
    var select1, select2;
    if (g_lang === "en") {
        select1 = buildNode("select", ["id", "style"], ["gm_lang1",
            "height:18px;"
        ], html1 + html2);
        select2 = buildNode("select", ["id", "style"], ["gm_lang2",
            "height:18px;"
        ], html2 + html1);
    } else {
        select1 = buildNode("select", ["id", "style"], ["gm_lang1",
            "height:18px;"
        ], html2 + html1);
        select2 = buildNode("select", ["id", "style"], ["gm_lang2",
            "height:18px;"
        ], html1 + html2);
    }
    var input = buildNode("img", ["type", "src", "style"], ["submit",
        scriptsIcons + "Traductor/GO.png",
        "float:right;height:18px;cursor:pointer"
    ], "", "click", function() {
        toTranslate(f.document.getElementById("gm_wordtotranslate").value,
            f.document.getElementById("gm_lang1").value, f.document.getElementById(
                "gm_lang2").value);
    });
    var div = buildNode("div", ["id", "style"], ["gm_traduction",
            "background-color:black; padding:0 0 1px 2px; position:fixed; bottom:1px; right:1px; "
        ],
        "<input id='gm_wordtotranslate' type='text' style='width:80px;height:9px;'/>"
    );
    div.appendChild(select1);
    div.appendChild(select2);
    var div2 = buildNode("div", ["id"], ["gm_traductionofword"], "");
    div.appendChild(input);
    f.document.getElementsByTagName("body")[0].appendChild(div2);
    f.document.getElementsByTagName("body")[0].appendChild(div);
}

/**
 * Additional production options in the production page
 */
function loadResources() {
    var html = "<div class='ressources_sub1a' style='float:left'>" + L_[
        "More_allTo"] + "</div>";
    html +=
        '<div class="ressources_sub1c" style="float:right; padding-right:12px; overflow:hidden;">' +
        '<select size="1" style="border:none;" onchange="var selects = document.getElementById(\'main\')' +
        '.getElementsByTagName(\'select\'); for (var i=0; i<selects.length; i++) { selects[i].value=this.value; }' +
        'document.ressources.submit();">' +
        '<option value="100">100%</option><option value="90">90%</option><option value="80">80%</option>' +
        '<option value="70">70%</option><option value="60">60%</option><option value="50">50%</option>' +
        '<option value="40">40%</option><option value="30">30%</option><option value="20">20%</option>' +
        '<option value="10">10%</option><option value="0">0%</option><option selected="selected">?</option></select></div>';
    var div = buildNode("div", ["class"], [
        "space0 ressources_font_little ressources_bordert"
    ], html);
    f.document.getElementById("main").insertBefore(div, f.document.getElementsByClassName(
        "space0 ressources_font_little ressources_bordert")[0]);
}

/**
 * Immediately returns to the main fleet page if we're told to
 */
function loadRedirectFleet() {
    var fullLoc = false;
    var loc = null;
    try {
        loc = JSON.parse(getValue("savedFleet"));
        if (loc)
            fullLoc = true;
    } catch (ex) {
        fullLoc = false;
    }

    if (autoAttack && parseInt(getValue("autoAttackWaves")) === 0) {
        deleteValue("autoAttackWaves");
        deleteValue("autoAttackMC");
        setValue("redirToSpy", "1");
        f.location.href = "messages.php?mode=show?messcat=0";
    } else if (fullLoc) {
        f.location.href = loc.href;
    }
    else {
        f.location.href = "fleet.php";
    }
}

/***
 * Determines if a simulation resulted in total victory (no attacker losses)
 */
function processSim() {
    var winString = "The attacker has won the battle!";
    var nextRoundForm = $("#formulaireID");
    var victory = nextRoundForm.length && nextRoundForm.parent().children()[0].innerHTML === winString;
    var lostUnits = parseInt($(".space0").find("div:contains('Attacker has lost')")[1].childNodes[1].innerHTML.replace(/\./g, ''));
    setValue("simVictory", (victory && !lostUnits) ? 1 : 0);
    if (getValue("autoSim")) {
        close();
    }
}

/**
 * Set the given key/value pair
 *
 * Appends the universe to the key to simplify things
 * elsewhere.
 * @param key
 * @param value
 */
function setValue(key, value) {
    return GM_setValue(key + g_uni, value);
}

/**
 * Retrieve the given key with the universe appended
 *
 * @param key
 */
function getValue(key) {
    return GM_getValue(key + g_uni);
}

/**
 * Delete the given key with the universe appended
 * @param key
 */
function deleteValue(key) {
    return GM_deleteValue(key + g_uni);
}

/**
 * Creates a coordinate object containing the galaxy, system, and planet,
 * as well as a string representation of them all.
 * @param gal - the galaxy, or the entire coordinate as a string which will be parsed
 * @param sys
 * @param planet
 * @param lune
 * @constructor
 */
function Coordinates(gal, sys, planet, lune) {
    if ((typeof(gal)).toLowerCase() === "string" && gal.indexOf(":") !== -1) {
        this.str = gal;
        this.g = parseInt(gal.substr(0, 1));
        gal = gal.substr(2);
        this.s = parseInt(gal.substr(0, gal.indexOf(":")));
        this.p = parseInt(gal.substr(gal.indexOf(":") + 1));
        this.l = 0;
    } else {
        this.g = parseInt(gal);
        this.s = parseInt(sys);
        this.p = parseInt(planet);
        this.l = lune ? 1 : 0;
        this.str = gal + ":" + sys + ":" + planet;
    }
}
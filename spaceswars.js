
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

var LOG = {
    Extreme : -1,
    Tmi : 0,
    Verbose : 1,
    Info : 2,
    Warn : 3,
    Error : 4,
    Critical : 5
};

var g_info = getInfoFromPage();
var g_page = g_info.loc;
var g_uni = g_info.universe;

// We allow the main script to run on simulator pages so we can
// process simulations and communicate with other outer loop processes
if (g_page === "simulator") {
    if ($(".divtop.curvedtot")[1].innerHTML.indexOf("Attacker Simulation") !== -1) {
        processSim();
    }
    // noinspection JSAnnotator
    return;
}

// Masks for the new storage:
// 18 bits. Lowest order for moon (t/f), next 4 for
// planet (0-15), next 9 for system (0-511), last 4
// for galaxy (0-15)
// 1111 111111111 1111 1
var GAL_MASK = 0x3C000; // 111100000000000000
var SYS_MASK = 0x3FE0;  // 000011111111100000
var PLN_MASK = 0x1E;    // 000000000000011110
var LUN_MASK = 0x1;     // 000000000000000001
var GAL_SHIFT = 14;
var SYS_SHIFT = 5;
var PLN_SHIFT = 1;
var UNI_OFFSET = storageFromCoords(new Coordinates(1, 1, 1));

var g_nbScripts = 14;
var thisVersion = "4.1";
var GM_ICON = "http://i.imgur.com/OrSr0G6.png"; // Old icon was broken, all hail the new icon
var scriptsIcons = GM_ICON; // Old icon was broken

var g_logStr = ["TMI", "VERBOSE", "INFO", "WARN", "ERROR", "CRITICAL"];
var g_levelColors = [["#00CC00", "#AAA"], ["#B74BDB", "black"], ["blue", "black"], ["#E50", "black"], ["inherit", "#800"], ["inherit", "#800; font-size: 2em"]];

var g_config = getConfig();
if (g_uni !== 0) {
    ensureConfig();
}
var g_scriptInfo = getScriptInfo();
var g_versionInfo = getVersionInfo();
checkVersionInfo();

var g_lang = g_versionInfo.language;
f = null;  // The window/frame with the actual game
var lm;    // Left Menu

// Language dictionary. FR and EN
var L_ = setDictionary();                   // Dictionary of either French or English strings
var g_merchantMap = setMerchantMap();       // Maps buildings/research/fleet/def to merchant ids
var nbUnis = g_versionInfo.nbUnis;

var g_canLoadMap = getLoadMap();            // Map determining whether a given script can run on the page
var g_galaxyData = getGalaxyData();         // Map of saved players in the galaxy
var g_doNotSpy = getDoNotSpyData();         // Map of doNotSpy positions
var g_fleetPoints = getFleetPointsData();   // Map of fleet points for players
var g_inactiveList = getInactiveList();     // List of inactive players
var g_markit = getMarkitData();             // List of marked players in the galaxy
var SAVE_INTERVAL = 20;                     // How often to save data
var g_changeCount = 0;                      // Number of changes without a save
var g_markitChanged = false;                // Whether markit data has changed
var g_dnsChanged = false;                   // Whether doNotSpy data has changed
var g_oldVersion;                           // Should we save the current script?
var g_galaxyDataChanged = false;            // Whether the galaxy data has changed
var g_inactivesChanged = false;             // Whether the list of inactive players has changed
var g_saveEveryTime = false;                // Whether to save data whenever something changes
var g_inPlanetView = true;                  // Whether we are in planet view (unused?)
var g_savedAttackData = null;

var g_interval = null;
var g_intervalCount = 1;

if (!usingOldVersion()) {
    g_changeCount = 1;
}

var g_saveIcon = "https://i.imgur.com/hiPncO0.png";
var g_savedIcon = "https://i.imgur.com/Ldr8fWG.png";
var g_delIcon = "https://i.imgur.com/gUAQ51d.png";

var g_targetPlanet = -1;  // Determines the current target planet in galaxy view

// List of excluded input ids that indicate we should not process shortcuts
var g_textAreas = new Set(["EasyTarget_text", "RConvOpt", "mail", "message_subject", "text", "message2", "jscolorid"]);
var g_invalidNameFields = new Set(["newname", "pwpl", "name", "nom", "tag", "rangname", "password", "lien", "logo",
    "change_admin_rank", "changerank", "change_rank", "change_member_rank", "db_character",
    "db_email", "db_password", "newpass1", "newpass2", "avatar", "dec1", "dec2", "dec3",
    "reason", "signature", "palcol1", "palcol2", "palcol3", "palcol4", "palcol5", "palcol6",
    "palcol7", "palcol8", "palcol9", "palcol10", "palcol11", "palcol15", "palcol1o",
    "palcol2o", "palcol9o", "palcol10o"]);

/**
 * Dictionary/"enum" of keycodes
 * @type {{}}
 */
var KEY =  {
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
setKeyArray();

var autoAttack = !!parseInt(getValue("autoAttackMasterSwitch")) && usingOldVersion();
var autoAttackWithSim = !!parseInt(getValue("simAutoAttack"));

var multiply = autoAttack ? fastMult : slowMult;
var divide = autoAttack ? fastDivide : slowDivide;
var add = autoAttack ? fastAdd : slowAdd;
var subtract = autoAttack ? fastSubtract : slowSubtract;

// Every page gets the shortcut handler
setGlobalKeyboardShortcuts();

// Make sure to save on exit, no matter what
if (g_page !== "forum" && g_page !== "simulator" && !g_saveEveryTime) {
    window.addEventListener("beforeunload", function () {
        changeHandler(true /*forcecSave*/);
    });
}

// We're in the top level frame that holds the leftmenu and the actual content
if (g_page === "frames") {
    log("Top level frame!", LOG.Info);
    // We have to insert the js directly into the page, otherwise the inner frame
    // won't have access to these internals.
    // noinspection JSAnnotator
    window.top.document.head.appendChild(buildNode("script", ["type"], ["text/javascript"],
        `
        function notifyNewPage(page) {
            handleNewPage(page);
        }
    `
    ));

    // Reset the dictionary on a language change
    if (window.location.href.indexOf("lang_change") !== -1) {
        var newLang = window.location.href.substring(window.location.href.length - 2);
        if (g_lang !== newLang) {
            log("Language changed to " + g_lang, LOG.Verbose)
            g_lang = newLang;
            L_ = setDictionary();
        }
    }

    // Trickiness needed to let the inner loop communicate with
    // the outer loop.
    handleNewPage = function(page) {
        g_page = page;
        g_keyArray.length = 0;

        log("New page: " + page, LOG.Verbose);

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

            if (g_interval) {
                clearInterval(g_interval);
                g_intervalCount = 1;
                if (!autoAttack) {
                    setValue("fleetNotSent", false);
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
            log("Setting left menu", LOG.Info);
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

        // Load deutRow first to get it in as soon as possible, as it shifts the content down
        if (canLoadInPage("More_deutRow") && g_scriptInfo.More && g_config.More.deutRow) {
            log("Loading deutRow", LOG.Verbose);
            loadDeutRow();
        }

        if (canLoadInPage("ClicNGo")) { // doesn't count as a script (no option to deactivate it)
            log("Loading ClicNGo", LOG.Verbose);
            loadClickNGo();
        }

        if (canLoadInPage("EasyFarm") && g_scriptInfo.EasyFarm) {
            log("Loading EasyFarm", LOG.Verbose);
            loadEasyFarm();
        }

        // Shows who's inactive in the statistics page
        if (canLoadInPage('InactiveStats') && (g_scriptInfo.InactiveStats || g_scriptInfo.FleetPoints)) {
            log("Loading InactiveStats and FleetPoints", LOG.Verbose);
            loadInactiveStatsAndFleetPoints();
        }

        if (canLoadInPage('More_deutRow') && g_scriptInfo.More && g_config.More.convertClick) {
            log("Loading ConvertClick", LOG.Verbose);
            loadConvertClick();
        }

        if (g_page === 'fleet' && g_scriptInfo.More && g_config.More.mcTransport && g_uni === '17') {
            log("Loading McTransport", LOG.Verbose);
            loadMcTransport();
        }

        if (canLoadInPage("empireTotal") && g_scriptInfo.BetterEmpire) {
            log("Loading BetterEmpire", LOG.Verbose);
            loadBetterEmpire();
        }

        if (canLoadInPage("EasyTarget") &&
            (g_scriptInfo.EasyTarget || g_scriptInfo.Markit || g_scriptInfo.GalaxyRanks)) {
            log("Loading EasyTarget and Markit", LOG.Verbose);
            loadEasyTargetAndMarkit();
        }

        if (canLoadInPage("iFly") && g_scriptInfo.iFly) {
            log("Loading iFly", LOG.Verbose);
            loadiFly();
        }

        if (canLoadInPage("TChatty") && g_scriptInfo.TChatty) {
            log("Loading TChatty", LOG.Verbose);
            loadTChatty();
        }

        // Disable autocomplete on all qualifying input fields
        if (g_scriptInfo.NoAutoComplete && autoCompleteSelected(g_page)) {
            log("Loading disableAutoComplete", LOG.Verbose);
            disableAutoComplete();
        }

        if (canLoadInPage("AllinDeut") && g_scriptInfo.AllinDeut) {
            log("Loading AllInDeut", LOG.Verbose);
            loadAllinDeut();
        }

        if (g_scriptInfo.More) {
            log("Loading More", LOG.Verbose);
            loadMore();
        }

        if (g_page === "fleet") {
            log("Loading saveFleetPage", LOG.Verbose);
            saveFleetPage();
        }

        if (g_page === "floten1") {
            log("Loading continueAttack", LOG.Verbose);
            continueAttack();
        }

        if (g_page === "floten2") {
            log("Loading setupFleet2", LOG.Verbose);
            setupFleet2();
        }

        if (g_page === 'simulator') {
            log("Loading simulator", LOG.Verbose);
            setSimDefaults();
        }
    };

} else {
    if (window.top.notifyNewPage)
        window.top.notifyNewPage(g_page);
    else
        log("Top frame doesn't have stuff :(", LOG.Warn);
}

/**
 * Log a message to the console
 * @param text
 * @param level
 * @param isObject
 */
function log(text, level, isObject) {
    if (!g_config || !g_config.Logging) {
        console.warn("Can't log with formatting yet, config not set!");
        console.log(text);
        return;
    }

    if (g_config.Logging.level === LOG.Extreme) {
        console.log("%c[TMI] " + "%cCalled log with (" + text + ", " + level + ", " + isObject + ")", "color: " + g_levelColors[0][0], "color: " + g_levelColors[0][1]);
    }
    if (level < g_config.Logging.level) {
        return;
    } else if (level < LOG.Warn && autoAttack && g_config.Logging.muteForAutoAttack) {
        // Only log Warn+ if autoattacking
        return;
    }

    var output;
    if (level < LOG.Warn) {
        output = console.log;
    } else if (level < LOG.Error) {
        output = console.warn;
    } else {
        output = console.error;
    }

    if (isObject) {
        // If we want to output an object directly (dict, array, element), don't format it
        output("%c[" + g_logStr[level] + "]", "color : " + g_levelColors[level][0]);
        output(text);
    } else {
        output("%c[" + g_logStr[level] + "] " + "%c" + text, "color : " + g_levelColors[level][0], "color : " + g_levelColors[level][1]);
    }
}

/**
 * Creates and returns the dictionary mapping
 * scripts to the pages they can be loaded in
 *
 * @returns {{}}
 */
function getLoadMap() {
    log("Calling getLoadMap(" + ([].toString()) + ")", LOG.Tmi);

    log("Setting canLoad map", LOG.Info);
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
        chat : true,
        forum : true,
        index : true,
        niark : true,
        rw : true,
        frames : true,
        leftmenu : true
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
        chat : true,
        forum : true,
        index : true,
        niark : true,
        rw : true,
        frames : true,
        leftmenu : true
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
        niark : true,
        forum : true,
        index : true,
        chat : true,
        rw : true,
        frames : true,
        leftmenu : true
    };

    canLoad.empireTotal = {
        type : 1,
        imperium : true
    };

    canLoad.navigatorShortcuts = {
        type : 2,
        niark : true,
        forum : true,
        index : true,
        chat : true,
        rw : true,
        notes : true,
        search : true
    };

    log(canLoad, LOG.Tmi, true /*isObject*/);
    return canLoad;
}

/**
 * Determine if a given script can run on the current page
 * @param script
 * @returns {boolean}
 */
function canLoadInPage(script) {
    log("Calling canLoadInPage(" + ([script].toString()) + ")", LOG.Tmi);

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
    log("Calling getSlashedNb(" + ([nStr].toString()) + ")", LOG.Tmi);

    if (nStr.indexOf && nStr.indexOf(".") !== -1) {
        nStr =  Math.ceil(nStr);
    }
    nStr = nStr.toString();
    if (nStr.lastIndexOf("e") !== -1) {
        return nStr;
    }

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
    log("Calling setDictionary(" + ([].toString()) + ")", LOG.Tmi);

    log("Setting dictionary: " + g_lang, LOG.Info);

    if (L_ && g_lang === L_.lang) {
        return L_;
    }
    var tab = [];
    switch (g_lang) {
        case "fr":
            tab.lang = "fr";
            tab.newVersion = "Nouvelle version disponible.\r\nCliquez sur l'ic\u00f4ne du menu de gauche pour plus d'informations.";
            tab.cantxml = "Votre navigateur ne vous permet pas d'envoyer des donn\u00e9es vers la cartographie";
            tab.ClicNGo_universe = "Univers";
            tab.ClicNGo_username = "Pseudo";
            tab.ClicNGo_number = "Num\u00e9ro";
            tab.RConverter_HoF = "Cochez si c'est un HoF (afin d'ajouter le lien, obligatoire sur le forum)";
            tab.RConverter_help = "Appuyez sur Ctrl+C pour copier, Ctrl+V pour coller";
            tab.iFly_deutfly = "Deut\u00e9rium en vol";
            tab.iFly_metal = "M\u00e9tal";
            tab.Markit_rank = "Place";
            tab.More_allTo = "Tout mettre \u00e0...";
            tab.More_convertInto = "Tout convertir en";
            tab.More_crystal = "cristal";
            tab.More_deuterium = "deut\u00e9rium";
            tab.EasyFarm_attack = "Attaquer";
            tab.EasyFarm_looting = "Pillage";
            tab.EasyFarm_ruinsField = "Champ de ruines";
            tab.EasyFarm_spyReport = "Rapport d'espionnage";
            tab.EasyFarm_metal = "M\u00e9tal";
            tab.EasyFarm_deuterium = "Deut\u00e9rium";
            tab.EasyFarm_defenses = "D\u00e9fenses";
            tab.AllinDeut_metal = "M\u00e9tal";
            tab.AllinDeut_crystal = "Cristal";
            tab.AllinDeut_deuterium = "Deut\u00e9rium";
            tab.small_cargo = "Petit transporteur";
            tab.large_cargo = "Grand transporteur";
            tab.light_fighter = "Chasseur l\u00e9ger";
            tab.heavy_fighter = "Chasseur lourd";
            tab.cruiser = "Croiseur";
            tab.battleship = "Vaisseau de bataille";
            tab.colony_ship = "Vaisseau de colonisation";
            tab.recycler = "Recycleur";
            tab.espionage_probe = "Sonde espionnage";
            tab.bomber = "Bombardier";
            tab.solar_satellite = "Satellite solaire";
            tab.destroyer = "Destructeur";
            tab.deathstar = "\u00c9toile de la mort";
            tab.battlecruiser = "Traqueur";
            tab.supernova = "Supernova";
            tab.massive_cargo = "Convoyeur";
            tab.collector = "Collecteur";
            tab.blast = "Foudroyeur";
            tab.extractor = "Vaisseau Extracteur";
            tab.rg = "Lanceur de missiles";
            tab.ll = "Artillerie laser l\u00e9g\u00e8re";
            tab.hl = "Artillerie laser lourde";
            tab.gl = "Canon de Gauss";
            tab.ic = "Artillerie \u00e0 ions";
            tab.pt = "Lanceur de plasma";
            tab.ssd = "Petit bouclier";
            tab.lsd = "Grand bouclier";
            tab.ug = "Protecteur Plan\u00e8taire";
            tab.alliance = "Alliance";
            tab.chat = "Chat";
            tab.board = "Forum";
            tab.options = "Options";
            tab.support = "Support";
            tab.available = "Disponible";
            tab.send = "Envoyer";
            tab.universe = "Univers";

            tab.activate = "Activer";
            tab.deactivate = "D\u00e9sactiver";
            tab.inactiveDescrip1 = "Afficher joueurs inactifs dans la page de classements. <br />Exige que l'univers soit balay\u00e9 manuellement, car les valeurs <br />sont mises \u00e0 jour car ils sont consid\u00e9r\u00e9s dans l'univers.";
            tab.inactiveDescrip2 = "Travaux dans la page de classements";
            tab.easyTargetDescrip1 = "Afficher tous les emplacements recueillies pour chaque joueur en vue de la galaxie";
            tab.easyTargetDescrip2 = "Fonctionne dans la page de galaxie";
            tab.import = "Importer";
            tab.export = "Exporter";
            tab.EasyImportDescrip = "Pour importer, coller ici et appuyez sur l'importation. Pour exporter, appuyez sur l'exportation et copier le texte qui appara\u00eet";
            tab.noAutoDescrip1 = "D\u00e9sactiver autocomplete de champ sur des pages sp\u00e9cifiques";
            tab.noAutoDescrip2 = "Fonctionne dans toutes les pages avec des champs de saisie semi-automatique";
            tab.noAutoGalaxy = "Galaxie";
            tab.noAutoFleet1 = "Flotte 1";
            tab.noAutoFleet2 = "Flotte 2";
            tab.noAutoFleet3 = "Flotte 3";
            tab.noAutoShip = "ChantierSpatial";
            tab.noAutoDef = "D\u00e9fenses";
            tab.noAutoSims = "Simulateurs";
            tab.noAutoMerch = "Marchand";
            tab.noAutoScrap = "Ferrailleur";
            tab.galaxyRanksDescrip1 = "Voir les rangs des joueurs directement dans la vue de la galaxie<br /><br />Les rangs doivent \u00eatre en ordre (le moins cher), et les <br />num\u00e9ros valides pour qu'il soit trait\u00e9 correctement croissante.";
            tab.galaxyRanksDescrip2 = "Fonctionne dans la page de galaxie";
            tab.galaxyRanksOthers = "Tous les autres";
            tab.deutRowDescrip1 = "montrer les ressources que vous avez tous en Deut c\u00f4t\u00e9 m\u00e9tal / crystal / Deut";
            tab.deutRowDescrip2 = "tous apges o\u00f9 l'affichage des ressources appara\u00eet";
            tab.galaxyRanksInactive = "Voir les inactifs";
            tab.convertCDescrip1 = "En cliquant sur le / crystal / valeur Deut m\u00e9tallique convertit automatiquement toutes <br />les ressources \u00e0 ce type particulier.";
            tab.convertCDescrip2 = "toutes les pages o\u00f9 l'affichage des ressources montre. ConvertDeut doit \u00eatre activ\u00e9";
            tab.mcTransDescrip1 = "Ajoute une option pour s\u00e9lectionner suffisamment de convoyeur pour le transport de toutes <br />les ressources de la plan\u00e8te \u00e0 l'autre (u17 seulement)";
            tab.mcTransDescrip2 = "Cette page de la flotte";
            tab.empTotDescrip1 = "Voir la premi\u00e8re colonne des totaux en raison de l'empire";
            tab.empTotDescrip2 = "Page d'empire";
            tab.rConverterDescrip1 = "Format des journaux d'attaque";
            tab.rConverterDescrip2 = "Rapport de combat";
            tab.easyFarmDescrip1 = "Mettez en surbrillance les \u00e9l\u00e9ments dans vos rapports d'espionnage qui sont plus rentables que les limites d\u00e9finies";
            tab.easyFarmDescrip2 = "Page d'posts";
            tab.allinDeutDescrip1 = "Afficher les co\u00fbts de construction en deut";
            tab.allinDeutDescrip2 = "Page d'b\u00e2timents";
            tab.tChattyDescrip1 = "Meilleur bavarder";
            tab.tChattyDescrip2 = "Page d'bavarder";
            tab.markitDescrip1 = "Marquer les joueurs dans la galaxie";
            tab.markitDescrip2 = "Page d'galaxie";
            tab.mMoonListDescrip1 = "Marquez les lunes bleu dans le s\u00e9lecteur de la plan\u00e8te";
            tab.mMoonListDescrip2 = "Partout";
            tab.mConvertDeutDescrip1 = "Am\u00e9liorer la page marchande";
            tab.mConvertDeutDescrip2 = "Page d'marchand";
            tab.mTraductorDescrip1 = "Traduire des messages";
            tab.mTraductorDescrip2 = "Page d'messages";
            tab.mResourcesDescrip1 = "S\u00e9lectionnez facilement le pourcentage de production";
            tab.mResourcesDescrip2 = "Page d'production";
            tab.mRedirectFleetDescrip1 = "Redirection vers la page principale de la flotte apr\u00e8s envoi d'une flotte";
            tab.mRedirectFleetDescrip2 = "Page d'flotte";
            tab.mArrowsDescrip1 = "R\u00e9gler le s\u00e9lecteur de fl\u00e8che";
            tab.mArrowsDescrip2 = "Partout";
            tab.mReturnsDescrip1 = "Rendez les flottes de retour transparentes dans l'aper\u00e7u";
            tab.mReturnsDescrip2 = "Page d'g\u00e9n\u00e9rale";
            tab.mNone = "aucun";
            tab.mFridge = "frigo";
            tab.mBunker = "bunker";
            tab.mAttack = "\u00e0 raider";
            tab.mDont = "\u00e0 ne pas";
            tab.mTitle = "S\u00e9lectionnez le type de marquage:";
            tab.betterEmpDescrip1 = "Mieux trier l'affichage empire, avec la colonne \u00abtotal\u00bb d'abord, et la possibilit\u00e9 de commander les <br />plan\u00e8tes selon la disposition attribu\u00e9 dans les param\u00e8tres, et ont lunes derni\u00e8re.";
            tab.betterEmpDescrip2 = "Fonctionne dans la page de l'empire";
            tab.betterEmpMain = "commande standard";
            tab.betterEmpMoon = "lunes derniers";
            tab.FPDescrip1 = "Ajouter des points de la flotte comme une option dans la page de classements.";
            tab.FPDescrip2 = "Travaux dans la page de classements";
            tab.FPAlert = "Si cette personne a chang\u00e9 leur nom et ne devrait plus \u00eatre dans les classements, appuyez sur Entr\u00e9e.";
            tab.spy = "Espionner";
            tab.closeMessage = "Fermer ce message";

            // Buildings/Research/abm/ipm
            tab.metalMine = "Mine de m\u00e9tal";
            tab.crystalMine = "Mine de cristal";
            tab.deutMine = "Synth\u00e9tiseur de deut\u00e9rium";
            tab.solarPlant = "Centrale \u00e9lectrique solaire";
            tab.fusionReactor = "Centrale \u00e9lectrique de fusion";
            tab.roboticsFactory = "Usine de robots";
            tab.naniteFactory = "Usine de nanites";
            tab.shipyard = "Chantier spatial";
            tab.metalStorage ="Entrep\u00f4t de m\u00e9tal";
            tab.crystalStorage = "Entrep\u00f4t de cristal";
            tab.deutStorage = "R\u00e9servoir de deut\u00e9rium";
            tab.researchLab = "Laboratoire de recherche";
            tab.terraformer = "Terraformeur";
            tab.alliancedepot = "Station de ravitaillement";
            tab.advancedLab = "Laboratoire avanc\u00e9";
            tab.trainingCenter = "Centre de formation";
            tab.missileSile = "Silo de missiles";
            tab.lunarBase = "Base lunaire";
            tab.sensorPhalanx = "Phalange de capteur";
            tab.jumpGate = "Porte de saut spatial";

            tab.metalProduction  = "Production de m\u00e9tal";
            tab.crystalProduction  = "Production de cristal";
            tab.deuteriumProduction  = "Production de deut\u00e9rium";
            tab.espionageTechnology  = "Espionnage";
            tab.computerTechnology  = "Ordinateur";
            tab.weaponsTechnology  = "Armement";
            tab.shieldingTechnology  = "Bouclier";
            tab.armorTechnology  = "Protection des vaisseaux spatiaux";
            tab.energyTechnology  = "Energie";
            tab.hyperspaceTechnology  = "Hyperespace";
            tab.combustionDrive  = "R\u00e9acteur \u00e0 combustion";
            tab.impulseDrive  = "R\u00e9acteur \u00e0 impulsion";
            tab.hyperspaceDrive  = "Propulsion Hyperespace";
            tab.laserTechnology  = "Laser";
            tab.ionTechnology  = "Ions";
            tab.plasmaTechnology  = "Plasma";
            tab.intergalacticResearchNetwork  = "R\u00e9seau de Recherche Intergalactique";
            tab.expeditionTechnology  = "Exp\u00e9ditions";
            tab.teachingtechnology  = "Enseignement";
            tab.consistency  = "Consistance";
            tab.extractorHangar  = "Hangar \u00e0 VE";
            tab.abm = "Missile d'Interception";
            tab.ipm = "Missile Interplan\u00e9taire";
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

    log(tab, LOG.Tmi, true);
    return tab;
}

/**
 * Maps buildings/research/fleet with their
 * corresponding ids in the merchang page.
 *
 * @returns {{}} Merchant map
 */
function setMerchantMap() {
    log("Calling setMerchantMap(" + ([].toString()) + ")", LOG.Tmi);


    log("Setting merchant map", LOG.Info);
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
    m[L_.gc] = 404;
    m[L_.ic] = 405;
    m[L_.pt] = 406;
    m[L_.ssd] = 407;
    m[L_.lsd] = 408;
    m[L_.ug] = 409;
    m[L_.abm] = 502;
    m[L_.ipm] = 503;

    log(m, LOG.Tmi, true)
    return m;
}

/**
 * Sets the default userscript info. Not written by
 * me and not really used anymore.
 *
 * @returns {*}
 */
function setInfosVersion() {
    log("Calling setInfosVersion(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling setScriptsInfo(" + ([].toString()) + ")", LOG.Tmi);

    log("Setting Script Info", LOG.Info);
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
    setValue("infos_scripts", JSON.stringify(list));
    return list;
}

/**
 * Sets the default values for the top-level scripts
 *
 * @param uni - current universe
 * @returns {{}} - the script config
 */
function setConfigScripts(uni) {
    log("Calling setConfigScripts(" + ([uni].toString()) + ")", LOG.Tmi);

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
        list.EasyFarm.simGranulariry = 0;
        list.EasyFarm.simThreshold = 0;
        list.EasyFarm.botLootLevel = 0;
        list.EasyFarm.simShip = 0;
        list.EasyFarm.botSn = false;

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
        list.Markit.color.default = "FFFFFF";
        list.Markit.color.fridge = "30A5FF";
        list.Markit.color.bunker = "FF9317";
        list.Markit.color.raidy = "44BA1F";
        list.Markit.color.dont = "FF2626";
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

        list.Logging = {};
        list.Logging.level = 2;
        list.Logging.muteForAutoAttack = true;
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
    log("Calling getInfoFromPage(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling getDomXpath(" + ([xpath, inDom, row].toString()) + ")", LOG.Tmi);

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
    log("Calling getNbFromStringtab(" + ([tab].toString()) + ")", LOG.Tmi);

    return parseInt(tab.join(''));
}

/**
 * Legacy code that might still be relevant if someone is upgrading
 * from before 2012 to the latest.
 */
function checkVersionInfo() {
    log("Calling checkVersionInfo(" + ([].toString()) + ")", LOG.Tmi);

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
            alert("Script install\u00e9. Appuyez sur F5.\n\nScript installed. Press F5.");
    }

    // ... just as updating ?
    if (g_versionInfo.version !== thisVersion) {
        log("Version mismatch", LOG.Warn);
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
                alert("Script install\u00e9. Appuyez sur F5.\n\nScript installed. Press F5.");
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
                    config.Markit.color.default = "FFFFFF";
                    config.Markit.color.fridge = "30A5FF";
                    config.Markit.color.bunker = "FF9317";
                    config.Markit.color.raidy = "44BA1F";
                    config.Markit.color.dont = "FF2626";
                    GM_setValue("configScripts" + i, JSON.stringify(config));
                }
            }
            g_versionInfo = setInfosVersion();

            // get a message if can't have the gm icon without F5 refresh (frames)
            g_page = getInfoFromPage().loc;
            if (g_page !== "niark" && g_page !== "index" && g_page !== "forum" && g_page !== "leftmenu" && g_page !== "frames") {
                alert("Script mis \u00e0 jour.\n\nScript updated.");
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
    log("Calling getConfig(" + ([].toString()) + ")", LOG.Tmi);

    log("Grabbing uni" + g_uni + " config", LOG.Info);
    var config;
    try {
        config = JSON.parse(getValue("configScripts"));
        if (!config)
            config = setConfigScripts(g_uni);
    } catch (ex) {
        config = setConfigScripts(g_uni);
    }

    log(config, LOG.Tmi, true);
    return config;
}

/**
 * Make sure everything is set/initialized
 */
function ensureConfig() {
    log("Calling ensureConfig(" + ([].toString()) + ")", LOG.Tmi);

    if (!g_config.RConverter) {
        g_config.RConverter = {};
        g_config.RConverter.header = "";
        g_config.RConverter.boom = "";
        g_config.RConverter.destroyed = "";
        g_config.RConverter.result = "";
        g_config.RConverter.renta = "";
    } else {
        if (g_config.RConverter.header === undefined) g_config.RConverter.header = "";
        if (g_config.RConverter.boom === undefined) g_config.RConverter.boom = "";
        if (g_config.RConverter.destroyed === undefined) g_config.RConverter.destroyed = "";
        if (g_config.RConverter.result === undefined) g_config.RConverter.result = "";
        if (g_config.RConverter.renta === undefined) g_config.RConverter.renta = "";
    }

    if (!g_config.EasyFarm) {
        g_config.EasyFarm = {};
        g_config.EasyFarm.minPillage = 0;
        g_config.EasyFarm.colorPill = "871717";
        g_config.EasyFarm.minCDR = 0;
        g_config.EasyFarm.colorCDR = "178717";
        g_config.EasyFarm.defMultiplier = 1;
        g_config.EasyFarm.granularity = 1000;
        g_config.EasyFarm.simGranulariry = 0;
        g_config.EasyFarm.simThreshold = 0;
        g_config.EasyFarm.botLootLevel = 0;
        g_config.EasyFarm.simShip = 0;
        g_config.EasyFarm.botSn = false;
    } else {
        if (g_config.EasyFarm.minPillage === undefined) g_config.EasyFarm.minPillage = 0;
        if (g_config.EasyFarm.colorPill === undefined) g_config.EasyFarm.colorPill = "871717";
        if (g_config.EasyFarm.minCDR === undefined) g_config.EasyFarm.minCDR = 0;
        if (g_config.EasyFarm.colorCDR === undefined) g_config.EasyFarm.colorCDR = "178717";
        if (g_config.EasyFarm.defMultiplier === undefined) g_config.EasyFarm.defMultiplier = 1;
        if (g_config.EasyFarm.granularity === undefined) g_config.EasyFarm.granularity = 1000;
        if (g_config.EasyFarm.simGranulariry === undefined) g_config.EasyFarm.simGranulariry = 0;
        if (g_config.EasyFarm.simThreshold === undefined) g_config.EasyFarm.simThreshold = 0;
        if (g_config.EasyFarm.botLootLevel === undefined) g_config.EasyFarm.botLootLevel = 0;
        if (g_config.EasyFarm.simShip === undefined) g_config.EasyFarm.simShip = 0;
        if (g_config.EasyFarm.botSn === undefined) g_config.EasyFarm.botSn = false;
    }

    if (!g_config.EasyTarget) {
        g_config.EasyTarget = {};
        g_config.EasyTarget.spyCutoff = 0;
        g_config.EasyTarget.spyDelay = 0;
        g_config.EasyTarget.useDoNotSpy = false;
    } else {
        if (g_config.EasyTarget.spyCutoff === undefined) g_config.EasyTarget.spyCutoff = 0;
        if (g_config.EasyTarget.spyDelay === undefined) g_config.EasyTarget.spyDelay = 0;
        if (g_config.EasyTarget.useDoNotSpy === undefined) g_config.EasyTarget.useDoNotSpy = false;
    }

    if (!g_config.TChatty) {
        g_config.TChatty = {};
        g_config.TChatty.color = "FFFFFF";
    } else {
        if (g_config.TChatty.color === undefined) g_config.TChatty.color = "FFFFFF";
    }

    if (!g_config.NoAutoComplete) {
        g_config.NoAutoComplete = {};
        g_config.NoAutoComplete.galaxy = true;
        g_config.NoAutoComplete.fleet = true;
        g_config.NoAutoComplete.floten1 = true;
        g_config.NoAutoComplete.floten2 = true;
        g_config.NoAutoComplete.build_fleet = true;
        g_config.NoAutoComplete.build_def = true;
        g_config.NoAutoComplete.sims = true;
        g_config.NoAutoComplete.marchand = true;
        g_config.NoAutoComplete.scrapdealer = true;
    } else {
        if (g_config.NoAutoComplete.galaxy === undefined) g_config.NoAutoComplete.galaxy = true;
        if (g_config.NoAutoComplete.fleet === undefined) g_config.NoAutoComplete.fleet = true;
        if (g_config.NoAutoComplete.floten1 === undefined) g_config.NoAutoComplete.floten1 = true;
        if (g_config.NoAutoComplete.floten2 === undefined) g_config.NoAutoComplete.floten2 = true;
        if (g_config.NoAutoComplete.build_fleet === undefined) g_config.NoAutoComplete.build_fleet = true;
        if (g_config.NoAutoComplete.build_def === undefined) g_config.NoAutoComplete.build_def = true;
        if (g_config.NoAutoComplete.sims === undefined) g_config.NoAutoComplete.sims = true;
        if (g_config.NoAutoComplete.marchand === undefined) g_config.NoAutoComplete.marchand = true;
        if (g_config.NoAutoComplete.scrapdealer === undefined) g_config.NoAutoComplete.scrapdealer = true;
    }

    if (!g_config.Markit) {
        g_config.Markit = {};
        g_config.Markit.color = {};
        g_config.Markit.color.default = "FFFFFF";
        g_config.Markit.color.fridge = "30A5FF";
        g_config.Markit.color.bunker = "FF9317";
        g_config.Markit.color.raidy = "44BA1F";
        g_config.Markit.color.dont = "FF2626";
        g_config.Markit.coord = {};
        g_config.Markit.ranks = 1;
        g_config.Markit.topX = 50;
        g_config.Markit.topColor = "FF2626";
    } else {
        if (g_config.Markit.color === undefined) g_config.Markit.color = {};
        if (g_config.Markit.color.default === undefined) g_config.Markit.color.default = "FFFFFF";
        if (g_config.Markit.color.fridge === undefined) g_config.Markit.color.fridge = "30A5FF";
        if (g_config.Markit.color.bunker === undefined) g_config.Markit.color.bunker = "FF9317";
        if (g_config.Markit.color.raidy === undefined) g_config.Markit.color.raidy = "44BA1F";
        if (g_config.Markit.color.dont === undefined) g_config.Markit.color.dont = "FF2626";
        if (g_config.Markit.coord === undefined) g_config.Markit.coord = {};
        if (g_config.Markit.ranks === undefined) g_config.Markit.ranks = 1;
        if (g_config.Markit.topX === undefined) g_config.Markit.topX = 50;
        if (g_config.Markit.topColor === undefined) g_config.Markit.topColor = "FF2626";
    }

    if (!g_config.GalaxyRanks) {
        g_config.GalaxyRanks = {};
        g_config.GalaxyRanks.ranks = [5, 25, 50, 200];
        g_config.GalaxyRanks.values = ['F05151', 'FFA600', 'E8E83C', '2C79DE', '39DB4E'];
    } else {
        if (g_config.GalaxyRanks.ranks === undefined) g_config.GalaxyRanks.ranks = [5, 25, 50, 200];
        if (g_config.GalaxyRanks.values === undefined) g_config.GalaxyRanks.values = ['F05151', 'FFA600', 'E8E83C', '2C79DE', '39DB4E'];
    }

    if (!g_config.BetterEmpire) {
        g_config.BetterEmpire = {};
        g_config.BetterEmpire.byMainSort = 1;
        g_config.BetterEmpire.moonsLast = 1;
    } else {
        if (g_config.BetterEmpire.byMainSort === undefined) g_config.BetterEmpire.byMainSort = 1;
        if (g_config.BetterEmpire.moonsLast === undefined) g_config.BetterEmpire.moonsLast = 1;
    }

    if (!g_config.More) {
        g_config.More = {};
        g_config.More.moonsList = 1;
        g_config.More.convertDeut = 1;
        g_config.More.traductor = 1;
        g_config.More.resources = 1;
        g_config.More.redirectFleet = 1;
        g_config.More.arrows = 1;
        g_config.More.returns = 1;
        g_config.More.deutRow = 1;
        g_config.More.convertClick = 1;
        g_config.More.mcTransport = 0;
    } else {
        if (g_config.More.moonsList === undefined) g_config.More.moonsList = 1;
        if (g_config.More.convertDeut === undefined) g_config.More.convertDeut = 1;
        if (g_config.More.traductor === undefined) g_config.More.traductor = 1;
        if (g_config.More.resources === undefined) g_config.More.resources = 1;
        if (g_config.More.redirectFleet === undefined) g_config.More.redirectFleet = 1;
        if (g_config.More.arrows === undefined) g_config.More.arrows = 1;
        if (g_config.More.returns === undefined) g_config.More.returns = 1;
        if (g_config.More.deutRow === undefined) g_config.More.deutRow = 1;
        if (g_config.More.convertClick === undefined) g_config.More.convertClick = 1;
        if (g_config.More.mcTransport === undefined) g_config.More.mcTransport = 0;
    }

    if (!g_config.Logging) {
        g_config.Logging = {};
        g_config.Logging.level = 2;
        g_config.Logging.muteForAutoAttack = true;
    } else {
        if (g_config.Logging.level === undefined) g_config.Logging.level = 2;
        if (g_config.Logging.muteForAutoAttack === undefined) g_config.Logging.muteForAutoAttack = true;
    }
}

/**
 * Grab the universe player database
 * @returns {*}
 */
function getGalaxyData() {
    log("Calling getGalaxyData(" + ([].toString()) + ")", LOG.Tmi);

    if (g_galaxyData)
        return g_galaxyData;

    var storage;
    try {
        log("Grabbing galaxyData_" + g_uni + " from storage", LOG.Info);
        storage = JSON.parse(getValue("galaxyData"));

        if (!storage || !storage.universe || !storage.players) storage = {
            'universe': [],
            'players': {}
        };
    } catch (ex) {
        storage = {
            'universe': [],
            'players': {}
        };
    }

    if (!storage.universe.length && storage.universe.length !== 0) {
        // The user is upgrading versions. Attempt to convert their old data
        if (confirm("It looks like your galaxy data is not in the latest format. Would you like to attempt to convert it? If not, it will be erased.")) {
            storage = convertOldGalaxyData(storage);
        } else {
            storage = {
                'universe': {},
                'players': {}
            };
        }

        log("Setting galaxy data after new version detected", LOG.Verbose);
        g_galaxyData = storage;
        setGalaxyData();
        return storage;
    }

    storage.universe = internalToGalaxyData(storage.universe);
    log("Galaxy Data:", LOG.Tmi);
    log(storage, LOG.Tmi, true);
    return storage;
}

/**
 * Convert the in-memory model to one more storage-space friendly
 */
function setGalaxyData() {
    log("Calling setGalaxyData(" + ([].toString()) + ")", LOG.Tmi);

    setValue("galaxyData", JSON.stringify({
        "universe" : galaxyDataToInternal(g_galaxyData.universe),
        "players"  : g_galaxyData.players
    }));
}

/**
 * Converts the in-memory galaxy data to the saved format
 * @returns {Array}
 */
function galaxyDataToInternal(data) {
    log("Calling galaxyDataToInternal(" + ([data].toString()) + ")", LOG.Tmi);

    /*
     * Convert the galaxy view into a flat sparse array that combines
     * players who have planets right next to each other, and continuous gaps
     *
     * { 1: "A", 2: "B", 6: "C", 7: "C", 8: "C", 10: "A", 15: "D }
     *
     * would be converted into ["A","B",-3,"C*2",-1,"A",-4,"D"]. While the process
     * can take some time (30-60ms), it shouldn't be happening extremely quickly, esp
     * if !usingOldVersion(). Honestly probably not a worthwhile endeavour, but it
     * reduced the size of the uni17 map from 372k chars to 265k (-28.8%). Take into
     * account the size was at 527k before any reductions (pre-2018), and that's a
     * reduction of 49.7%, which is huge.
     */
    var time = window.performance.now();
    var uni = [];
    for (var gal in data) {
        if (!data.hasOwnProperty(gal)) {
            continue;
        }

        for (var sys in data[gal]) {
            if (!data[gal].hasOwnProperty(sys)) {
                continue;
            }

            for (var pln in data[gal][sys]) {
                if (!data[gal][sys].hasOwnProperty(pln)) {
                    continue;
                }

                var index = (storageFromCoords(new Coordinates(gal, sys, pln)) >> 1) - UNI_OFFSET;
                uni[index] = data[gal][sys][pln];
            }
        }
    }

    var newUni = [];
    var prevNull = 0;
    var sameName = 0;
    for (var i = 0; i < uni.length; i++) {
        if (!uni[i]) {
            prevNull++;
            sameName = 0;
        } else if (prevNull) {
            newUni.push(prevNull * -1);
            prevNull = 0;
            newUni.push(uni[i]);
        } else {
            if (uni[i - 1] === uni[i]) {
                newUni[newUni.length - 1] = uni[i] + "*" + (++sameName);
            } else {
                sameName = 0;
                newUni.push(uni[i]);
            }
        }
    }

    log("Took " + (window.performance.now() - time) + "ms to convert from galaxyData to storage", LOG.Verbose);
    return newUni;
}

/**
 * Converts the stored galaxy data to a more updateable model
 * @param internal
 * @returns {{}}
 */
function internalToGalaxyData(internal) {
    log("Calling internalToGalaxyData(" + ([internal].toString()) + ")", LOG.Tmi);
    log("Setting min log level to VERBOSE to prevent crashing. This is an intensive method", LOG.Info);
    var logOld = g_config.Logging.level;
    if (logOld < LOG.Verbose) {
        g_config.Logging.level = LOG.Verbose;
    }

    var time = window.performance.now();
    var data = {};
    for (var i = 0, j = 0; i < internal.length; i++) {

        var entry = internal[i];
        var skipEntry = parseInt(entry);
        if (!isNaN(skipEntry) && skipEntry < 0) {
            j -= skipEntry; // skipEntry is negative, so we're adding here
            continue;
        }

        var multiple = entry.indexOf("*");
        if (multiple !== -1) {
            multiple = parseInt(entry.substring(multiple + 1)) + 1;
            entry = entry.substring(0, entry.indexOf("*"));
        } else {
            multiple = 1;
        }

        for (var k = 0; k < multiple; k++, j++) {
            var coords = coordsFromStorage((j + UNI_OFFSET) << 1);
            if (!data[coords.g]) {
                data[coords.g] = {};
            }

            if (!data[coords.g][coords.s]) {
                data[coords.g][coords.s] = {};
            }

            data[coords.g][coords.s][coords.p] = entry;
        }
    }

    log("Took " + (window.performance.now() - time) + "ms to convert from storage to galaxyData", LOG.Verbose);
    log("Restoring logging level", LOG.Info);
    g_config.Logging.level = logOld;
    return data;
}

/**
 * Converts old-style galaxy storage into the new model
 * @param storage
 * @returns {{}}
 */
function convertOldGalaxyData(storage) {
    log("Calling convertOldGalaxyData(" + ([storage].toString()) + ")", LOG.Tmi);

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
            newPlayers[key].push(storageFromCoords(coords) | (players[key][1] ? (players[key][1].indexOf(coords.str) !== -1 ? 1 : 0) : 0));
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
    log("Calling getDoNotSpyData(" + ([].toString()) + ")", LOG.Tmi);

    // Build up a list of planets we should avoid spying next time because
    // they have very little resources
    var doNotSpy;
    try {
        log("Grabbing doNotSpy_uni" + g_uni + " from storage", LOG.Info);
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

    log(doNotSpy, LOG.Tmi, true);
    return doNotSpy;
}

/**
 * Grab the fleetPoints list
 * @returns {*}
 */
function getFleetPointsData() {
    log("Calling getFleetPointsData(" + ([].toString()) + ")", LOG.Tmi);

    var fp;
    try {
        log("grabbing fp uni" + g_uni, LOG.Info);
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

    log(fp, LOG.Tmi, true);
    return fp;
}

/**
 * Grab the list of inactive players
 * @returns {*}
 */
function getInactiveList() {
    log("Calling getInactiveList(" + ([].toString()) + ")", LOG.Tmi);

    var lst;
    try {
        log("Grabbing InactiveList_" + g_uni, LOG.Info);
        lst = JSON.parse(getValue("inactiveList"));
        if (!lst)
            lst = {};
    } catch (err) {
        lst = {};
    }

    log(lst, LOG.Tmi, true);
    return lst;
}

/**
 * Grab the markit data
 * @returns {*}
 */
function getMarkitData() {
    log("Calling getMarkitData(" + ([].toString()) + ")", LOG.Tmi);

    var markit;
    try {
        log("grabbing markitData_" + g_uni + " from storage", LOG.Info);
        markit = JSON.parse(getValue("markitData"));
        if (!markit) markit = {};
    } catch (err) {
        markit = {};
    }

    log(markit, LOG.Tmi, true);
    return markit;
}

/**
 * Grab the information on the scripts
 * @returns {{}}
 */
function getScriptInfo() {
    log("Calling getScriptInfo(" + ([].toString()) + ")", LOG.Tmi);

    log("grabbing infos_scripts", LOG.Info);
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
 * Retrieve the script verseion info. Don't think it's
 * actually used anymore
 * @returns {*}
 */
function getVersionInfo() {
    log("Calling getVersionInfo(" + ([].toString()) + ")", LOG.Tmi);

    var versionInfo;
    try {
        versionInfo = JSON.parse(GM_getValue("infos_version"));
        if (!versionInfo) {
            versionInfo = setInfosVersion();
        }
    } catch (ex) {
        versionInfo = undefined;
    }

    return versionInfo;
}

/**
 * Sets up the necessary bits in the persistent sidebar (leftmenu)
 */
function setupSidebar() {
    log("Calling setupSidebar(" + ([].toString()) + ")", LOG.Tmi);

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
        "&config=1' target='Hauptframe' title='Scripts_SpacesWars_Corrig\u00e9'>" + "<img width='16px' height='16px' src='" + GM_ICON + "' alt='GM'/></a>");
    langBox.appendChild(gmIcon);

    var sfmCheck = buildNode("input", ["type", "id"], ["checkbox", "sfmCheck"], "");
    var aaCheck = buildNode("input", ["type", "id"], ["checkbox", "aaCheck"], "");

    var saveData;
    if (!g_saveEveryTime) {
        saveData = buildNode("input", ["type", "style", "value"],
            ["button", "width:16px;margin-left:4px;", "S"],
            "", "click", function() {
                changeHandler(true /*forceSave*/);
            });
    }

    sfmCheck.onchange = function() {
        log("AutoAttackWithSim toggled " + (this.checked ? "on" : "off"), LOG.Verbose);
        setValue("simAutoAttack", this.checked ? 1 : 0);
        autoAttackWithSim = this.checked;
        deleteValue("simShips");
        deleteValue("autoSimIndex");
        deleteValue("attackData");
    };

    // Reset values when toggling autoAttack to
    // prevent unwanted redirections/actions
    aaCheck.onchange = function() {
        log("AutoAttack toggled " + (this.checked ? "on" : "off"), LOG.Verbose);
        setValue("autoAttackMasterSwitch", this.checked ? 1 : 0);
        autoAttack = this.checked && usingOldVersion();
        if (!autoAttack) {
            deleteValue("autoAttackStartIndex");
            deleteValue("autoAttackWaves");
            deleteValue("autoAttackMC");
            setValue("autoAttackIndex", -1);
        }

        deleteValue("simShips");
        deleteValue("autoSimIndex");
        deleteValue("attackData");
        deleteValue("autoSpyLength");
        deleteValue("fullGalaxySpy");

        multiply = autoAttack ? fastMult : slowMult;
        divide = autoAttack ? fastDivide : slowDivide;
        add = autoAttack ? fastAdd : slowAdd;
        subtract = autoAttack ? fastSubtract : slowSubtract;
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
    log("Calling globalShortcutHandler(" + ([e].toString()) + ")", LOG.Tmi);

    var key = e.keyCode ? e.keyCode : e.which;
    log(key + " pressed", LOG.Tmi);
    if (isTextInputActive()) {
        log("Not parsing: input active", LOG.Tmi);
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
    log("Calling makeEven(" + ([active, value].toString()) + ")", LOG.Tmi);

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
    log("Calling displayAlert(" + ([text, fadeTime, timeout].toString()) + ")", LOG.Tmi);

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
        }, timeout, fadeTime);
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
    log("Calling inputSelector(" + ([map].toString()) + ")", LOG.Tmi);

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
    log("Calling buildFleetKeyHandler(" + ([key].toString()) + ")", LOG.Tmi);

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
    log("Calling buildDefKeyHandler(" + ([key].toString()) + ")", LOG.Tmi);

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
    log("Calling messagePageKeyHandler(" + ([key].toString()) + ")", LOG.Tmi);

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
                setValue("botSim", g_config.EasyFarm.botSn && active.children[1].children[0].childNodes[0].textContent.toLowerCase().indexOf("bot_col") !== -1);
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
    log("Calling deleteMessages(" + ([deleteType].toString()) + ")", LOG.Tmi);

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
    log("Calling fleetKeyHandler(" + ([e].toString()) + ")", LOG.Tmi);

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
 * Sets the list of keys currently pressed
 */
function setKeyArray() {
    log("Calling setKeyArray(" + ([].toString()) + ")", LOG.Tmi);

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
}

/**
 * Returns whether the given key is an alpha key
 * @param key
 * @returns {boolean}
 */
function isAlphaKey(key) {
    log("Calling isAlphaKey(" + ([key].toString()) + ")", LOG.Tmi);

    return key >= KEY.A && key <= KEY.Z;
}

/**
 * As the name implies, sets up keyboard shortcuts
 * that can be used on any page (that makes sense)
 */
function setGlobalKeyboardShortcuts() {
    log("Calling setGlobalKeyboardShortcuts(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling globalKeypressHandler(" + ([e].toString()) + ")", LOG.Tmi);

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
    log("Calling isTextInputActive(" + ([].toString()) + ")", LOG.Tmi);

    if (!f || !f.document) {
        return false;
    }

    var active = f.document.activeElement;
    // if the element is not null and the element has a
    // restricted id or name, return true
    return active !== null &&
        (g_textAreas.has(active.id) ||
            g_invalidNameFields.has(active.name));
}

/**
 * Pretty sure this is broken. Used to be a universe manager of sorts
 * in the index page. Maybe I'll get around to fixing it, but I don't
 * really have any use for it. This is some of the oldest code that has
 * largely been untouched.
 */
function loadClickNGo() {
    log("Calling loadClickNGo(" + ([].toString()) + ")", LOG.Tmi);

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
        html += "<option value=" + (i + 1) + ">" + L_.ClicNGo_universe + " " + (i + 1) + "</option>";
    html += "<input id='add_username' onclick='this.value=\"\";' value='" +
        L_.ClicNGo_username +
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
                " (" + L_.ClicNGo_universe + " " + g_config.ClicNGo.universes[i] + ")");
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
    log("Calling checkEasyFarmRedirect(" + ([].toString()) + ")", LOG.Tmi);

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
 *
 * TODO: If AutoAttacking, we can skip some processing (tooltip, wave data insertion)
 */
function loadEasyFarm() {
    log("Calling loadEasyFarm(" + ([].toString()) + ")", LOG.Tmi);

    var time =window.performance.now();
    checkEasyFarmRedirect();
    var fleetDeut = [1500, 4500, 1250, 3500, 8500, 18750, 12500, 5500, 500, 25000, 1000, 40000, 3250000, 27500, 12500000, 3750000, 55000, 71500, 37500];
    var needsSim = [];
    var simIndex;
    var simShips = getValue("simShips");
    var startIndex = getMessageStartIndex();

    // Increment the start index if we determined
    // we can't win the current fight
    if (simShips) {
        simIndex = getValue("autoSimIndex");
        if (autoAttack && autoAttackWithSim && simShips === -1) {
            startIndex++;
            setValue("autoAttackStartIndex", startIndex);
            deleteValue("simShips");
            deleteValue("autoSimIndex");
        }
    }

    // Setup the tab indexes
    var tabs = f.$(".message_2a > .message_space0.curvedtot");
    for (var t = 0; t < tabs.length; t++) {
        tabs[t].tabIndex = t + 1;
    }

    var attackIndex = -1;
    var simNotNeeded = false;
    var aaDeleteIndex = parseInt(getValue("autoAttackIndex"));
    if (aaDeleteIndex && aaDeleteIndex !== -1 && getValue("fleetNotSent")) {
        attackIndex = aaDeleteIndex;
        aaDeleteIndex = -1;
        simNotNeeded = true;
        deleteValue("fleetNotSent");
    }

    if (isNaN(aaDeleteIndex))
        aaDeleteIndex = -1;

    var isBot = [];
    var messages = getDomXpath("//div[@class='message_space0 curvedtot'][contains(.,\"" + L_.EasyFarm_spyReport + "\")][contains(.,\"" + L_.EasyFarm_metal + "\")]", f.document, -1);

    appendMessagesTooltipBase();
    for (var i = 0; i < messages.length; i++) {
        messages[i].getElementsByClassName("checkbox")[0].checked = "checked";
        var candidate = false;

        // isBot if the colony name starts with Bot_col
        isBot[i] = messages[i].children[1].children[0].childNodes[0].textContent.toLowerCase().indexOf("bot_col") !== -1;

        var minPillage = g_config.EasyFarm.minPillage;
        if (isBot[i]) {
            minPillage = g_config.EasyFarm.botLootLevel;
        }

        // get metal crystal and deut
        var resources = getResourcesFromMessage(messages[i]);

        // Get the total number of ships and calculate the ruins field
        var shipDeut = getFleetDataFromMessage(messages[i], fleetDeut);
        var hasShips = shipDeut !== 0;

        candidate = uncheckMessageIfNeeded(resources, shipDeut, minPillage, messages[i]);
        if (attackIndex !== -1 && attackIndex !== aaDeleteIndex) {
            // If we already found a valid attack index we don't need
            // to process any more of this entry
            continue;
        }

        var shouldAttack = !hasShips && candidate;
        var totDef = 0;

        // Determine the number of defenses present

        var defenses = messages[i].children[1];
        if (defenses.children.length > 5) {
            defenses = defenses.children[5].children;
            if (defenses.length > 2) {
                shouldAttack = false;
            } else {
                for (var j = 0; j < defenses.length; j++) {
                    var def = defenses[j].innerText.substring(0, defenses[j].innerText.indexOf(" :"));

                    if (def !== L_.abm && def !== L_.ipm) {
                        shouldAttack = false;
                        break;
                    }
                }
            }
        } else {
            // We didn't send enough probes to find the defenses!
            shouldAttack = false;
        }

        needsSim[i] = autoAttackWithSim && candidate && !shouldAttack;

        // Set tooltip info
        var toolTip = buildTooltip(resources, messages[i], shipDeut);

        // Determine planet position (for doNotSpy info)
        var text = messages[i].childNodes[1].childNodes[7].innerHTML;
        var coords = new Coordinates(text.substr(5, text.indexOf("(") - 6));

        // Delete a message if we're autoAttacking, the planet has defenses, and
        // the total resources isn't greater than the defMultiplier
        var mc = Math.ceil(resources.total / 2 / 12500000);
        var allDeut = divide(resources.deut, 2);
        if (usingOldVersion() && parseFloat(allDeut) < g_config.EasyFarm.defMultiplier * minPillage && totDef > 500000 && !hasShips) {
            messages[i].getElementsByClassName("checkbox")[0].checked = true;
        }

        // Update doNotSpy if necessary
        if (g_config.EasyTarget.useDoNotSpy) {
            var oldValue = g_doNotSpy[coords.g][coords.s][coords.p];
            var newValue = allDeut < minPillage / 3;
            if (oldValue !== newValue) {
                g_dnsChanged = true;
                g_doNotSpy[coords.g][coords.s][coords.p] = newValue;
            }
        }

        // Determine the number of mc/waves necessary
        var waves = addAttackInfoToMessage(allDeut, mc, minPillage, messages[i], i, toolTip);

        // Definitely not a bot... I don't know what you're talking about
        if (autoAttack) {
            var href = messages[i].getElementsByTagName("a")[2].href;
            setSpyReportClick(waves, mc, href, messages[i], simShips, (isBot[i] && g_config.EasyFarm.botSn) ? 14 : g_config.EasyFarm.simShip);

            // Set the attack index if it's not already set, we either should attack or simulate,
            // autoAttack is enabled, and the message is greater than the startIndex
            if ((shouldAttack || needsSim[i]) && autoAttack && i >= startIndex) {
                if (attackIndex === -1 || attackIndex === aaDeleteIndex) {
                    attackIndex = i;
                }
            }
        } else {
            if (usingOldVersion()) {
                var num = appendAltMessageInterface(i, messages[i]);

                if (parseInt(simIndex) === i && simShips) {
                    // If we just finished a simulation, scroll the message
                    // into view, expand it, and fill the attack field with
                    // the correct number of ships
                    deleteValue("simShips");
                    deleteValue("autoSimIndex");
                    f.$(num).val(simShips);
                    f.$(num).parent().parent().parent()[0].childNodes[1].click();
                    f.$(num).focus();
                    num.scrollIntoView();
                }
            }
        }
    }

    // For sanity, delete aa data if it's not enabled
    if (!autoAttack) {
        deleteValue("attackData");
        setValue("autoAttackIndex", -1);
    }

    if (messages.length > 0 && aaDeleteIndex !== -1 && autoAttack) {
        // Delete already-attacked message
        setValue("autoAttackIndex", -1);
        deleteValue("attackData");
        messages[aaDeleteIndex].getElementsByClassName("checkbox")[0].checked = "checked";
        setTimeout(function() {
            f.document.getElementsByTagName("input")[5].click();
        }, Math.random() * 300 + 200);
    } else if (attackIndex !== -1 && autoAttack) {
        // Standard attack
        if (needsSim[attackIndex] && !simShips) {
            if (simNotNeeded) {
                // We've already done the sim
                g_savedAttackData = JSON.parse(getValue("attackData"));
                setValue("autoAttackIndex", attackIndex);
                setTimeout(function() {
                    f.$(messages[attackIndex].getElementsByTagName("a")[2]).click();
                }, Math.random() * 400 + 200);
            }
            setValue("botSim", isBot[attackIndex] && g_config.EasyFarm.botSn);
            setValue("autoSim", 1);
            setValue("autoSimIndex", attackIndex);
            f.$(messages[attackIndex]).find("a:contains('Simule')")[0].click();
        } else if (needsSim[attackIndex] && simShips && simIndex !== attackIndex) {
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
        log("DNS data changed", LOG.Verbose);
        changeHandler(false /*forceSave*/);
    }

    log("Took " + (window.performance.now() - time) + "ms to process messages", LOG.Verbose);
}

/**
 * Start the autoAttack search from a different index
 * if we've autoSimed the first n and we don't have
 * enough ships for a total victory
 *
 * @returns {number}
 */
function getMessageStartIndex() {
    log("Calling getMessageStartIndex(" + ([].toString()) + ")", LOG.Tmi);

    var startIndex = 0;
    if (autoAttack && autoAttackWithSim) {
        var storedIndex = getValue("autoAttackStartIndex");
        if (!storedIndex) {
            startIndex = 0;
        } else {
            startIndex = parseInt(storedIndex);
        }
    }

    return startIndex;
}

/**
 * Appends the tooltip base to the body
 *
 * Should only be called from easyFarm setup
 */
function appendMessagesTooltipBase() {
    log("Calling appendMessagesTooltipBase(" + ([].toString()) + ")", LOG.Tmi);

    getDomXpath("//body", f.document, 0).appendChild(
        buildNode("script", ["type"], ["text/javascript"],
            "$(document).ready(function(){\nsetTimeout(function(){\n" +
            "$('.tooltip').tooltip(" +
            "{width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'}" +
            ");\n}, 10);\n" +
            "}); "
        )
    );
}

/**
 * Determine how many resources are on a planet from a spy report
 * @param message
 * @returns {{total: number, deut: number}}
 */
function getResourcesFromMessage(message) {
    log("Calling getResourcesFromMessage(" + ([message].toString()) + ")", LOG.Tmi);

    var regNb = /\s([0-9,.]+)/;
    var metal = regNb.exec(message.getElementsByClassName("half_left")[0].innerHTML)[1].replace(/\./g, "");
    var crystal = regNb.exec(message.getElementsByClassName("half_left")[1].innerHTML)[1].replace(/\./g, "");
    var deut = regNb.exec(message.getElementsByClassName("half_left")[2].innerHTML)[1].replace(/\./g, "");

    // We need to get exact values, even when autoattacking
    return {
        total : add(add(metal, crystal), deut),
        deut  : add(add(divide(metal, 4), divide(crystal, 2)), deut)
    };
}

/**
 * Determine the deut value of a fleet in the given message
 * @param message
 * @param fleetDeut
 * @returns {number}
 */
function getFleetDataFromMessage(message, fleetDeut) {
    log("Calling getFleetDataFromMessage(" + ([message, fleetDeut].toString()) + ")", LOG.Tmi);

    var classRank = 4;
    var shipDeut = 0;
    var regNb = /\s([0-9,.]+)/;
    for (var j = 0; j < g_fleetNames.length; j++) {
        if (message.innerHTML.indexOf(g_fleetNames[j] + " : ") !== -1) {
            // get deut value of ship j
            shipDeut = add(shipDeut, multiply(regNb.exec(message.getElementsByClassName("half_left")[classRank].innerHTML)[1].replace(/,/g, ""), fleetDeut[j]));
            classRank++;
        }
    }

    return shipDeut;
}

/**
 * Uncheck a message if it meets our requirements.
 *
 * Return whether we chould consider it for AA
 * @param resources
 * @param shipDeut
 * @param minPillage
 * @param message
 * @returns {boolean}
 */
function uncheckMessageIfNeeded(resources, shipDeut, minPillage, message) {
    log("Calling uncheckMessageIfNeeded(" + ([resources, shipDeut, minPillage, message].toString()) + ")", LOG.Tmi);

    var candidate = false;
    if (resources.deut / 2 >= minPillage) {
        message.setAttribute("style", "background-color:#" + g_config.EasyFarm.colorPill);
        message.getElementsByClassName("checkbox")[0].checked = false;
        candidate = true;
    }

    if (shipDeut * 0.6 >= g_config.EasyFarm.minCDR) {
        message.setAttribute("style", "background-color:#" + g_config.EasyFarm.colorCDR);
        message.getElementsByClassName("checkbox")[0].checked = false;
    }

    return candidate;
}

/**
 * Creates a tooltip for a given message, indicating loot and ruin field levels
 * @param resources
 * @param message
 * @param totalDeut
 * @returns {Element}
 */
function buildTooltip(resources, message, totalDeut) {
    log("Calling buildTooltip(" + ([resources, message, totalDeut].toString()) + ")", LOG.Tmi);

    var outDiv = document.createElement("div");
    var colorSpan = buildNode("span", ["style"], ["color:#FFCC33"], L_.EasyFarm_looting);
    var ul = buildNode("ul", ["style"], ["margin-top:0"], "");
    var ships = [L_.massive_cargo, L_.supernova, L_.blast];
    var capacities = [12500000, 2000000, 8000];
    for (var i = 0; i < 3; i++) {
        ul.appendChild(buildNode("li", [], [], ships[i] + " : " + getSlashedNb(Math.ceil((resources.total / 2 / capacities[i])))));
    }

    outDiv.appendChild(colorSpan);
    outDiv.appendChild(ul);

    var defDiv = document.createElement("div");
    var innerSpan = buildNode("span", ["style"], ["color:#FFCC33"], L_.EasyFarm_ruinsField + " :");
    var innerText = buildNode("span", [], [], getSlashedNb(Math.floor(totalDeut * 0.6)) + " " + L_.EasyFarm_deuterium);
    defDiv.appendChild(innerSpan);
    defDiv.append(innerText);
    outDiv.appendChild(defDiv);

    if (message.innerHTML.indexOf(L_.EasyFarm_defenses) !== -1) {
        outDiv.appendChild(document.createElement("br"));
        var collectDiv = document.createElement("div");
        collectDiv.appendChild(buildNode("span", ["style"], ["color:#55BBFF"], L_.EasyFarm_defenses + " :"));
        var items = message.getElementsByClassName("message_space0")[2].getElementsByClassName("half_left");
        for (i = 0; i < items.length; i++) {
            collectDiv.appendChild(document.createElement("br"));
            collectDiv.appendChild(buildNode("span", [], [], items[i].innerHTML));
        }

        outDiv.appendChild(collectDiv);
    }

    return outDiv;
}

/**
 * Set the click handler for spy reports
 * @param waves
 * @param mc
 * @param href
 * @param message
 * @param numAlt
 * @param shipAlt
 */
function setSpyReportClick(waves, mc, href, message, numAlt, shipAlt) {
    log("Calling setSpyReportClick(" + ([waves, mc, href, message, numAlt, shipAlt].toString()) + ")", LOG.Tmi);

    f.$(message.getElementsByTagName("a")[2]).click(function() {
        // If an attack is made, set all the necessary info so it can be
        // filled in on the fleet page
        var granularity = g_config.EasyFarm.granularity ? g_config.EasyFarm.granularity : 100000;
        if (g_savedAttackData) {
            waves = g_savedAttackData.waves;
            mc = g_savedAttackData.mc;
            numAlt = g_savedAttackData.val;
            shipAlt = g_savedAttackData.type;
            g_savedAttackData = null;
        }

        // More of a quick fix, but if we're attacking with SN, there's a good chance
        // we're going up against some decent defenses (e.g. attacking bots), and will
        // lose some MCs if we add them to the mix. So only attack with SNs and add more
        // if we need to make up for the loss in cargo space
        if (shipAlt === 14) {
            var numAltSav = numAlt;
            numAlt = Math.max(numAlt, Math.round(((mc * 12500000 / 2000000) + (granularity / 2)) / granularity) * granularity);
            if (numAlt !== numAltSav) {
                log("Increased SNs from " + numAltSav + " to " + numAlt + " to meet res requirements", LOG.Warn);
            }
            mc = 0;
        } else {
            mc = Math.round((mc + (granularity / 2)) / granularity) * granularity;
        }
        var attackData = {
            type  : numAlt ? shipAlt : -1,
            val   : numAlt ? numAlt : 0,
            mc    : mc,
            waves : waves
        };
        setValue("attackData", JSON.stringify(attackData));
        if (numAlt) {
            deleteValue("simShips");
        }
        f.location = href;
    });
}

/**
 * Add information to the attack report about deut/waves.
 * Return the number of waves to send while still receiving minPillage
 * @param allDeut
 * @param mc
 * @param minPillage
 * @param message
 * @param index
 * @param toolTip
 * @returns {number}
 */
function addAttackInfoToMessage(allDeut, mc, minPillage, message, index, toolTip) {
    log("Calling addAttackInfoToMessage(" + ([allDeut, mc, minPillage, message, index, toolTip].toString()) + ")", LOG.Tmi);

    var deutTotal = allDeut;
    var snb = getSlashedNb;
    var content = L_.massive_cargo + " : " + "<span id=res" + index + ">" + snb(mc) + "</span><br />Deut : " + snb(allDeut);
    allDeut = divide(allDeut, 2);
    var waves = 1;
    while (parseFloat(allDeut) >= minPillage && minPillage > 0) {
        waves++;
        deutTotal = add(deutTotal, allDeut);
        allDeut = divide(allDeut, 2);
    }

    // Add the mc/wave info to the bottom of the report
    var waveText = (waves === 1) ? " wave : " : " waves : ";
    content += "<br />" + waves + waveText + snb(deutTotal) + " Deut";
    var div = buildNode("div", [], [], content);
    message.getElementsByClassName("message_space0")[0].parentNode.appendChild(div);
    div = buildNode("div", ["style", "id"], ["display:none", "divToolTip"], "");
    f.document.getElementsByTagName("body")[0].appendChild(div);
    div = buildNode("div", ["style", "id"], ["display:none", "data_tooltip_" + index], toolTip.innerHTML);
    f.document.getElementsByTagName("body")[0].appendChild(div);

    // Append the tooltip
    var xpath = f.document.evaluate("//a[text()='" + L_.EasyFarm_attack + "']",
        f.document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    xpath = xpath.snapshotItem(index);
    div = buildNode("a", ["class", "id", "href", "style"], ["tooltip", "tooltip_" + index, xpath.href, "float:right; width:0;"],
        "<img src='http://i.imgur.com/OMvyXdo.gif' width='20px' alt='p'/>");
    message.getElementsByClassName("donthide")[0].getElementsByTagName("div")[0].appendChild(div);

    return waves;
}

/**
 * Append the alternate attack interface to messages
 * @param index
 * @param message
 */
function appendAltMessageInterface(index, message) {
    log("Calling appendAltMessageInterface(" + ([index, message].toString()) + ")", LOG.Tmi);

    // If we're not autoAttacking, create the alternate attack config, allowing
    // auto simulation, and attacking with a preset number of blast/destroyer/sn
    var selDiv = buildNode("div", ["id"], ["attackOptions" + index], "");

    // Text input field
    var num = buildNode("input", ["type", "id", "class"], ["text", "fleetNum" + index, "supFleet"], "", "keydown", function(e) {
        if (e.keyCode === KEY.ENTER) {
            // Attack on [ENTER]
            e.preventDefault();
            var id = this.id.substring(8);
            f.$("#attack" + id).click();
        }
    });

    // Attack button
    var submit = buildNode("input", ["type", "value", "id", "style"], ["button", "Attack", "attack" + index, "padding: 3px"], "", "click", function() {
        var id = parseInt(this.id.substring(6));
        var mc = f.$("#res" + id)[0].innerHTML.replace(/\./g, "");
        mc = Math.round((parseInt(mc) + (g_config.EasyFarm.granularity / 2)) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
        var data = {
            type  : f.$("#shipSelect" + id)[0].value,
            val   : f.$("#fleetNum" + id)[0].value,
            mc    : mc,
            waves : -1
        };
        setValue("attackData", JSON.stringify(data));
        f.$(this.parentNode.parentNode).find("a:contains('" + L_.EasyFarm_attack + "')")[0].click();
    });

    // Simulate button
    var simulate = buildNode("input", ["type", "value", "id", "style"], ["button", "Sim", "sim" + index, "padding: 3px"], "", "click", function() {
        setValue("autoSim", 1);
        setValue("autoSimIndex", this.id.substring(3));
        f.$(this.parentNode.parentNode).find("a:contains('Simule')")[0].click();
    });

    // Fleet type selector
    var sel = buildNode("select", ["id"], ["shipSelect" + index], "");
    var rejectSet = new Set([0, 1, 6, 7, 8, 10, 15, 16, 18]);
    for (var j = 0; j < g_fleetNames.length; j++) {
        if (!rejectSet.has(j)) {
            sel.add(buildNode("option", ["value"], [j], g_fleetNames[j]));
        }
    }

    selDiv.appendChild(num);
    selDiv.appendChild(sel);
    selDiv.appendChild(submit);
    selDiv.appendChild(simulate);
    f.$(message).find("a:contains('" + L_.mAttack + "')")[0].parentNode.appendChild(selDiv);
    f.$("#shipSelect" + index).val(g_config.EasyFarm.simShip);

    return num;
}

/**
 * Saves changed universe information. Don't save on every
 * change to save resources
 *
 * @param forceSave - force a data save, even if we haven't hit the interval
 */
function changeHandler(forceSave) {
    log("Calling changeHandler(" + ([forceSave].toString()) + ")", LOG.Tmi);

    g_changeCount++;
    if (++g_changeCount >= SAVE_INTERVAL || forceSave || g_saveEveryTime) {
        log("Saving changed data...", LOG.Info);
        g_changeCount = 0;
        if (g_dnsChanged) {
            log("Saving DNS data", LOG.Info);
            g_dnsChanged = false;
            setValue("doNotSpy", JSON.stringify(g_doNotSpy));
        }

        if (g_markitChanged) {
            log("Saving markit data", LOG.Info);
            g_markitChanged = false;
            setValue("markitData", JSON.stringify(g_markit));
        }

        if (g_galaxyDataChanged) {
            log("Saving galaxy data", LOG.Info);
            g_galaxyDataChanged = false;
            setGalaxyData();
        }

        if (g_inactivesChanged) {
            log("Saving inactive list", LOG.Info);
            g_inactivesChanged = false;
            setValue("inactiveList", JSON.stringify(g_inactiveList));
        }
    } else {
        log("Not saving yet...", LOG.Verbose);
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
    } else if (g_config.EasyFarm.simShip === 0 ||
        g_config.EasyFarm.simGranularity === 0 ||
        g_config.EasyFarm.simThreshold === 0) {
        alert("Make sure all EasyFarm options have non-zero values!");
        return;
    }

    // Start of autoSim
    var fleetId;
    if (getValue("botSim")) {
        fleetId = 216;
    } else {
        fleetId = g_merchantMap[g_fleetNames[g_config.EasyFarm.simShip]];
    }

    var shipSelector = f.$("#att" +  fleetId);
    var totalShip  = shipSelector.val();
    totalShip = Math.floor(totalShip / g_config.EasyFarm.simGranularity) * g_config.EasyFarm.simGranularity;
    var maxShip = totalShip;
    var minShip = 0;
    var curShip = g_config.EasyFarm.simGranularity + getValue("botSim") ? (g_config.EasyFarm.simThreshold * 2) : 0;

    noShip("att");
    shipSelector.val(curShip);
    setValue("simVictory", -1);
    var totalVictory = false;
    while (!totalVictory) {
        f.$("input[value='Simulate']").click();
        await waitForSimComplete();
        await sleep(500);  // Don't do things super quickly
        totalVictory = getValue("simVictory") === 1;
        setValue("simVictory", -1);
        if (totalVictory) {
            // Won. Try fewer blasts if we're not within tolerance
            maxShip = curShip;
            if (minShip >= maxShip - g_config.EasyFarm.simThreshold) {
                curShip = maxShip;
                break;
            }

            curShip = Math.ceil((curShip + minShip) / (2 * g_config.EasyFarm.simGranularity)) * g_config.EasyFarm.simGranularity;

            totalVictory = false;
        } else {
            minShip = curShip;
            if (minShip >= maxShip - g_config.EasyFarm.simThreshold) {
                if (maxShip >= totalShip - g_config.EasyFarm.simThreshold) {
                    // Not enough ship for total victory
                    curShip = -1;
                    break;
                }

                curShip = maxShip;
                break;
            }

            // Round to granularity
            curShip = Math.floor((curShip + maxShip) / (2 * g_config.EasyFarm.simGranularity)) * g_config.EasyFarm.simGranularity;
        }

        shipSelector.val(curShip);
    }

    deleteValue("autoSim");
    setValue("simShips", curShip);
    setValue("redirToSpy", "1");
    f.location = "messages.php";
}

/**
 * Wait for the simulation to be processed
 * @returns {Promise}
 */
function waitForSimComplete() {
    log("Calling waitForSimComplete(" + ([].toString()) + ")", LOG.Tmi);

    return new Promise(function(resolve, reject) {
        (function waitForSim() {
            if (getValue("simVictory") === -1) {
                setTimeout(waitForSim, 30);
            } else {
                return resolve();
            }
        })();
    });
}

function sleep(ms) {
    log("Calling sleep(" + ([ms].toString()) + ")", LOG.Tmi);

    return new Promise(resolve => setTimeout(resolve, ms));
}

/***
 * Copied from spaceswars' simulator.js
 *
 * Sets the value of all ships in the simulator page to 0
 *
 * @param pref
 */
function noShip(pref) {
    log("Calling noShip(" + ([pref].toString()) + ")", LOG.Tmi);

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
    log("Calling loadInactiveStatsAndFleetPoints(" + ([].toString()) + ")", LOG.Tmi);

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
        if (g_lang === 'fr') types = ['Points de Flotte', 'G\u00e9n\u00e9ral', ' pas \u00e0 jour!', 'Recherche', 'B\u00e2timent', 'D\u00e9fense'];
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
                    var score = players[i].childNodes[ind].innerHTML.replace(/\./g, '');
                    if (type === "3") {
                        score = score.substring(0, score.indexOf("-") - 1);
                    }

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
                    // We want to always be precise. Always use slowSubtract
                    arr.push([k, slowSubtract(slowSubtract(slowSubtract(g_fleetPoints[who][k]['1'][0], g_fleetPoints[who][k]['3'][0]), g_fleetPoints[who][k]['4'][0]), g_fleetPoints[who][k]['5'][0])]);
                }
            }

            // Sort by fleetPoints
            arr.sort(function(a, b) {
                return slowSubtract(b[1], a[1]);
            });

            for (i = 0; i < arr.length; i++) {
                var container = buildNode('div', ['class'], [((i % 2 === 0) ? 'space1' : 'space') + ' curvedtot'], '');
                var place = buildNode('div', ['class'], ['stats_player_1'], i + 1);
                var playr = buildNode('div', ['class', 'id'], ['stats_player_2', 'player_' + i], arr[i][0]);
                var point = buildNode('div', ['class', 'style'], ['stats_player_2', 'width:250px;text-align:right'], getSlashedNb(arr[i][1]));
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
                var fr = "Assurez-vous que vous avez pass\u00e9 par toutes les statistiques de la section g\u00e9n\u00e9rale, car cela supprime tous les joueurs o\u00f9 le g\u00e9n\u00e9ral est pas \u00e0 jour. Il supprime \u00e9galement des informations EasyTarget, donc soyez prudent!";
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
                div.innerHTML += ' (i)';
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
    log("Calling loadDeutRow(" + ([].toString()) + ")", LOG.Tmi);

    var header = f.$('.default_1c1b');
    var m = (header[0].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, '');
    var c = (header[1].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, '');
    var d = (header[2].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, '');
    var aid = add(add(divide(m, 4), divide(c, 2)), d);
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
 * Like in elementary school:
 *   1234
 * x   34
 * ------
 *   4936
 *  37020
 * ------
 *  41956
 *
 * @param n1
 * @param n2
 * @returns {string}
 */
function slowMult(n1, n2) {
    log("Calling slowMult(" + ([n1, n2].toString()) + ")", LOG.Tmi);

    n2 = parseInt(n2);
    var tally = [];
    var pos = -1;
    var carry = 0;
    while (n2 !== 0) {
        var digit = n2 % 10;
        pos++;
        n2 = Math.floor(n2 / 10);
        if (digit === 0) {
            continue;
        }
        var res = 0;
        var total = "";
        for (var i = 0; i < pos; i++) {
            total += "0";
        }

        for (i = n1.length - 1; i >= 0; i--) {
            res = carry + (digit * n1.charAt(i));
            total = (res % 10) + total;
            carry = Math.floor(res / 10);
        }

        tally.push(total);
    }

    var result = "";
    for (var j = 0; j < tally.length; j++) {
        result = add(result, tally[j]);
    }

    return result;
}

function fastMult(n1, n2) {
    log("Calling fastMult(" + ([n1, n2].toString()) + ")", LOG.Tmi);

    return n1 * n2;
}

/**
 * Divide two numbers, keeping all precision. Much more
 * inefficient, but gets rid of "+e23" and the like
 *
 * Again like elementary school:
 *      _____
 *   12 | 132
 *
 * 12 goes into 1 0 times, 13 1 times, carry the 1, 12 goes into 12 1 time
 * for the anser of 011, or 11
 *
 * @param n2
 * @param n1
 * @returns {string}
 */
function slowDivide(n2, n1) {
    log("Calling slowDivide(" + ([n2, n1].toString()) + ")", LOG.Tmi);

    // TODO: Setting to have exact values displayed. ("this may slow down the script")
    //     var divide = setting ? longDivide : fastDivide;

    // Assume n1 is an integer and n2 is a string
    n1 = parseInt(n1);
    n2 = n2.toString();
    var currentIndex = 0;
    var solution = "";
    var currentTest = parseInt(n2.charAt(0));
    while (currentIndex < n2.length) {
        if (currentTest / n1 >= 1) {
            solution += Math.floor(currentTest / n1);
            currentTest = (currentTest % n1) + n2.charAt(++currentIndex);
        } else {
            if (solution.length) solution += "0";
            currentTest += n2.charAt(++currentIndex);
        }
    }

    return solution;
}

function fastDivide(n2, n1) {
    log("Calling fastDivide(" + ([n2, n1].toString()) + ")", LOG.Tmi);

    return n2 / n1;
}

/**
 * Add two numbers, keeping all precision. Ensures
 * numbers don't turn into "4.XXXeYY"
 *
 * @param n1
 * @param n2
 * @returns {string}
 */
function slowAdd(n1, n2) {
    log("Calling slowAdd(" + ([n1, n2].toString()) + ")", LOG.Tmi);

    var carry = 0;
    var result = "";
    var i1 = n1.length - 1;
    var i2 = n2.length - 1;
    while (i1 >= 0 || i2 >= 0) {
        var res = carry;
        if (i1 >= 0) {
            res += parseInt(n1.charAt(i1--));
        }

        if (i2 >= 0) {
            res += parseInt(n2.charAt(i2--));
        }

        if (res >= 10) {
            carry = 1;
            res -= 10;
        } else {
            carry = 0;
        }

        result = res + result;
    }

    if (carry) {
        result = carry + result;
    }

    return result;
}

function fastAdd(n1, n2) {
    log("Calling fastAdd(" + ([n1, n2].toString()) + ")", LOG.Tmi);

    return parseFloat(n1) + parseFloat(n2);
}

/**
 * Subtract two strings, keeping all precision
 *
 * Many edge cases that must be considered, mainly due to
 * the irregularity of fleetPoints data
 * @param n1
 * @param n2
 */
function slowSubtract(n1, n2) {
    log("Calling slowSubtract(" + ([n1, n2].toString()) + ")", LOG.Tmi);

    // If we're given null values or 0, set to "0"
    if (!n1) {
        n1 = "0";
    }

    if (!n2) {
        n2 = "0";
    }

    n1 = n1.toString();
    n2 = n2.toString();
    var temp;

    // Cases where either number is negative
    if (n1.charAt(0) === "-") {
        if (n2.charAt(0) !== "-") {
            // -1 - 4 = -(1 + 4)
            return "-" + slowAdd(n1.substring(1), n2);
        } else {
            // -10 - -2 = -10 + 2 = 2 - 10
            n2 = n2.substring(1);
            n1 = n1.substring(1);
            temp = n1;
            n1 = n2;
            n2 = temp;
        }
    } else if (n2.charAt(0) === "-") {
        // Only case left is 1 - -2 = 1 + 2
        return slowAdd(n1, n2.substring(1));
    }

    // Check if the answer will be negative. Potentially
    // lots of extra processing if the numbers are very
    // close, as the only guaranteed way is to check each
    // digit until we find a difference
    var neg = false;
    if (n1.length < n2.length) {
        neg = true;
    } else if (n1.length === n2.length) {
        for (var j = 0; j < n1.length; j++) {
            if (n1.charAt(j) > n2.charAt(j)) {
                break;
            } else if (n1.charAt(j) < n2.charAt(j)) {
                neg = true;
                break;
            }
        }

        // Every digit is the same, return 0
        if (j === n1.length) {
            return 0;
        }
    }

    if (neg) {
        temp = n1;
        n1 = n2;
        n2 = temp;
    }

    var borrow = 0;
    var result = "";

    // Append leading 0s to the smaller number to make our lives easier
    var diff = n1.length - n2.length;
    for (var i = 0; i < diff; i++) {
        n2 = "0" + n2;
    }

    // The actual subtraction
    for (i = n2.length - 1; i >= 0; i--) {
        var res = parseInt(n1.charAt(i)) - borrow - parseInt(n2.charAt(i));
        if (res < 0) {
            res += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }

        result = res + result;
    }

    // Leading 0s might be added. Remove them
    for (i = 0; result.charAt(i) === "0"; i++);
    result = result.substring(i);
    return (neg ? "-" : "") + result;
}

function fastSubtract(n1, n2) {
    log("Calling fastSubtract(" + ([n1, n2].toString()) + ")", LOG.Tmi);

    return n1 - n2;
}

/**
 * Convert all resources to the one clicked on in the header
 */
function loadConvertClick() {
    log("Calling loadConvertClick(" + ([].toString()) + ")", LOG.Tmi);

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

    f.$('.defenses_1a, .flottes_1a, .buildings_1a, .research_1a').click(function() {
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
    log("Calling loadMcTransport(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling loadBetterEmpire(" + ([].toString()) + ")", LOG.Tmi);

    if (f.location.href.indexOf("token") !== -1) {
        // Individual planet, do nothing
        return;
    }

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
        if (g_lang === 'fr') order = ['NomCoordonn\u00e9es', 'Total'];

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
 * If we are, hide some things, and show some
 * others. If this is true, the user should upgrade
 * their script version
 */
function usingOldVersion() {
    log("Calling usingOldVersion(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling hexToRgb(" + ([hex].toString()) + ")", LOG.Tmi);

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
    log("Calling animateBackground(" + ([element, newColor, duration, deleteAfterTransition].toString()) + ")", LOG.Tmi);

    var steps = Math.round(duration / (50/3)); // 1000/60 -> 60Hz
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
        if (newColor.indexOf("#") !== -1) {
            newColor = hexToRgb(newColor);
        } else if (newColor.toLowerCase() === "transparent") {
            newColor = JSON.parse(JSON.stringify(oldColor));
            newColor.a = 0;
        }
    }

    var animationFunc = function(element, oldColor, newColor, i, steps, deleteAfterTransition) {
        element.style.backgroundColor = "rgba(" +
            Math.round(oldColor.r + (((newColor.r - oldColor.r) / steps) * i)) + "," +
            Math.round(oldColor.g + (((newColor.g - oldColor.g) / steps) * i)) + "," +
            Math.round(oldColor.b + (((newColor.b - oldColor.b) / steps) * i)) + "," +
            (oldColor.a + (((newColor.a - oldColor.a) / steps) * i)) + ")";
        if (i === steps && deleteAfterTransition) {
            element.style.backgroundColor = null;
        }
    };

    for (var i = 1; i <= steps; i++) {
        setTimeout(animationFunc, (50/3) * i, element, oldColor, newColor, i, steps, deleteAfterTransition);
    }
}

/**
 * Return the name of the player at the given coordinates
 * @param coords
 * @returns {string | undefined}
 */
function getPlayerAtLocation(coords) {
    log("Calling getPlayerAtLocation(" + ([coords].toString()) + ")", LOG.Tmi);

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
    log("Calling setPlayerLocation(" + ([player, coords.str].toString()) + ")", LOG.Tmi);

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
    log("Calling deletePlayerLocation(" + ([coords].toString()) + ")", LOG.Tmi);

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
    log("Calling loadEasyTargetAndMarkit(" + ([].toString()) + ")", LOG.Tmi);

    // grab the rows and splice out any we don't care about
    var rows = getGalaxyRows();

    g_targetPlanet = -1;
    var changedPlayers = [];
    var processList = [];
    var sfmSettings = getSfmSettings();
    var spying = getIsSpying();

    if (!spying) {
        // attach the Markit popup window
        appendMarkitWindow(rows);
        checkRedir();

        // Don't add non-digit characters to galaxySelector
        f.$('#galaxy')[0].addEventListener("keydown", function(e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (isAlphaKey(key) && !e.ctrlKey) {
                e.preventDefault();
            }
        });

        // Add key listeners for spying and easytarget navigation
        addTargetPlanetKeyListener(rows);
    }

    // THE loop. Iterates over each row and sets up everything related
    // to Markit and EasyFarm
    for (var i = 0; i < 15; i++) {
        var row = rows[i];
        var nameDiv = row.childNodes[11].childNodes[1];
        var coords = new Coordinates(
            f.document.getElementById('galaxy').value,        // galaxy
            f.document.getElementsByName('system')[0].value,  // system
            i + 1,                                            // planet
            row.childNodes[7].childNodes.length > 1           // lune
        );

        //Name of the person previously stored at the given coord
        var storedName = getPlayerAtLocation(coords);

        if (!spying) {
            // See if we should mark the player via Markit
            markIfNeeded(row, coords, !!nameDiv);
        }

        // There's a player here
        var newName;
        if (nameDiv) {
            newName = getNameInGalaxy(nameDiv);
            var rank = processRankAndInactiveData(nameDiv, newName);

            if (!spying) {
                // Highlight the planet/moon if there's been recent activity
                highlightIfActive(row);
            }

            // Create save/remove/delete buttons for easyTarget
            if (g_scriptInfo.EasyTarget && !spying) {
                if (!usingOldVersion()) {
                    createEasyTargetButtons(rows, nameDiv, newName, storedName, coords);
                }
                showDefaultButton(storedName, newName, coords);
            } else if (g_scriptInfo.EasyTarget) {
                if (storedName && storedName !== newName) {
                    replacePlayerInDatabase(newName, storedName, coords);
                } else if (!storedName) {
                    setPlayerLocation(newName, coords);
                }
            }

            if (shouldProcessGalaxyItem(nameDiv, newName, rank, coords, sfmSettings)) {
                processList.push(row);
            }

            if (g_scriptInfo.EasyTarget && (usingOldVersion() || indexOfPlanet(newName, coords) !== -1)) {
                // Either usingOldVersion is true and we call this regardless, or
                // the player is already saved, so we can call update knowing
                // the only thing that might change is the moon.
                updatePlayerInfo(newName, coords);
            }
        } else {
            // Nothing here. If it was stored in the database, delete it.
            deleteIfNeeded(row, storedName, coords);
        }

        if ((g_scriptInfo.EasyTarget || g_scriptInfo.Markit) && nameDiv && !spying) {
            if (g_scriptInfo.EasyTarget) {
                appendEasyTargetTooltipToWindow(newName, i);
                createEasyTargetLocationDiv(nameDiv, newName, coords, i, rows);

                // We found our target!
                if (g_targetPlanet === coords.p) {
                    highlightTargetPlanet(nameDiv, coords, rows);
                }
            }

            // Used for both markit and easyTarget
            appendTargetIcon(row, coords);

            // Add the target click for Markit
            if (g_scriptInfo.Markit) {
                addMarkitTargetClick(coords);
            }

            // If EasyTarget is enabled, show/hide locations when
            // clicking on the div
            if (g_scriptInfo.EasyTarget) {
                addGalaxyRowClickHandler(rows, row, coords);
            }
        }
    }

    initiateSfm(processList);
    if (usingOldVersion()) {
        appendGoBox();
    }

    handleGalaxyViewDataChanges(changedPlayers);
}

/**
 * Check to see if we should be
 */
function checkRedir() {
    log("Calling checkRedir(" + ([].toString()) + ")", LOG.Tmi);

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
 * return the current SFM settings, or the default
 * all-false settings if it's not present
 *
 * @returns {*}
 */
function getSfmSettings() {
    log("Calling getSfmSettings(" + ([].toString()) + ")", LOG.Tmi);

    var settings;
    try {
        settings = JSON.parse(getValue("sfmSettings"));
    } catch (ex) {
        settings = {
            inactive : false,
            active   : false,
            bot      : false
        };
    }

    return settings;
}

/**
 * Determine if we're currently autospying
 * @returns {boolean}
 */
function getIsSpying() {
    log("Calling getIsSpying(" + ([].toString()) + ")", LOG.Tmi);

    var spying = getValue("autoSpyLength");
    return spying && !isNaN(spying) && spying >= 0;
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
    log("Calling markIfNeeded(" + ([row, coords, exists].toString()) + ")", LOG.Tmi);

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
 * @param nameDiv - the div
 * @param name - the actual (string) name
 */
function processRankAndInactiveData(nameDiv, name) {
    log("Calling processRankAndInactiveData(" + ([nameDiv, name].toString()) + ")", LOG.Tmi);

    var span = f.document.createElement("span");
    var id = nameDiv.onclick.toString();
    id = id.substring(id.indexOf("('") + 2, id.indexOf("')"));

    var rank = f.document.getElementById(id).childNodes[1].innerHTML;
    rank = parseInt(rank.substring(rank.indexOf(":") + 2));
    span.innerHTML = '(' + rank + ')';
    var spying = getIsSpying();

    // Change the color of the rank according to the values set in GalaxyRanks
    if (nameDiv.className.indexOf('inactive') === -1 || g_config.GalaxyRanks.inactives) {
        if (!spying) {
            setRankColor(span, rank);
        }

        // Remove them from the inactives list if they're active again
        if (g_inactiveList[name] !== undefined && nameDiv.className.indexOf('inactive') === -1) {
            g_inactivesChanged = true;
            delete g_inactiveList[name];
        }
    }

    // The player is inactive
    if (nameDiv.className.indexOf('inactive') !== -1) {

        // Set the rank color to the correct inactive
        // color iff we aren't coloring them
        if (!g_config.GalaxyRanks.inactives && !spying)
            span.style.color = f.getComputedStyle(nameDiv).color;

        // Kinda hacky. Set the inactive/longinactive flag to
        // the index of 'longinactive'. A regular inactive will
        // have an index of -1
        var newValue = nameDiv.className.indexOf('longinactive');
        if (g_inactiveList[name] === undefined || g_inactiveList[name] !== newValue) {
            g_inactiveList[name] = newValue;
            g_inactivesChanged = true;
        }
    }

    if (g_scriptInfo.GalaxyRanks && !spying)
        nameDiv.parentNode.appendChild(span);

    return rank;
}

/**
 * Determine the color to mark the rank
 *
 * @param span
 * @param rank
 */
function setRankColor(span, rank) {
    log("Calling setRankColor(" + ([span, rank].toString()) + ")", LOG.Tmi);

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
    log("Calling highlightIfActive(" + ([row].toString()) + ")", LOG.Tmi);

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
    log("Calling setHighlightColor(" + ([regMatch, item].toString()) + ")", LOG.Tmi);

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
 * @param rows - all the rows
 * @param nameDiv - the name div
 * @param newName - the actual (string) name of the player
 * @param storedName - the name that we think should be in this position
 * @param coords - the coordinates of this position
 */
function createEasyTargetButtons(rows, nameDiv, newName, storedName, coords) {
    log("Calling createEasyTargetButtons(" + ([rows, nameDiv, newName, storedName, coords].toString()) + ")", LOG.Tmi);

    var replaceDiv = createGalaxyDataButton(g_saveIcon, 0, coords.p, 1);
    var saveDiv = createGalaxyDataButton(g_saveIcon, 1, coords.p, 1);
    var savedDiv = createGalaxyDataButton(g_savedIcon, 2, coords.p, 0.5);

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
        createEasyTargetLocationDiv(nameDiv, newName, coords, index, rows);
        changeHandler(false /*fForceSave*/);
    });

    saveDiv.addEventListener("click", function () {
        setPlayerLocation(newName, coords);
        updatePlayerInfo(newName, coords);
        f.$(this).fadeOut(500, function() {
            f.$(savedDiv).fadeTo(500, 0.5);
        });

        var index = this.id.substring(this.id.lastIndexOf("_") + 1) - 1;
        writeLocationsOnMarkitTarget(newName, index);
        createEasyTargetLocationDiv(nameDiv, newName, coords, index, rows);
        changeHandler(false /*fForceSave*/);
    });

    savedDiv.addEventListener("click", function() {
        // "Clean Slate" - delete any person who might be stored there already
        deleteUnusedPosition(coords, newName);  // This also covers deletePlayerLocation
        f.$(this).fadeOut(500, function() {
            f.$(saveDiv).fadeIn(500);
        });

        var index = this.id.substring(this.id.lastIndexOf("_") + 1) - 1;
        writeLocationsOnMarkitTarget(newName, index);
        createEasyTargetLocationDiv(nameDiv, newName, coords, index, rows);
        changeHandler(false /*fForceSave*/);
    });

    replaceDiv.style.display = "none";
    saveDiv.style.display = "none";
    savedDiv.style.display = "none";
    nameDiv.parentNode.appendChild(replaceDiv);
    nameDiv.parentNode.appendChild(saveDiv);
    nameDiv.parentNode.appendChild(savedDiv);
}

/**
 * Get the name of the player/bot in the given name div
 * If a player is inactive/banned/vacationing, it's
 * processed differently
 * @param name
 * @returns {string}
 */
function getNameInGalaxy(name) {
    log("Calling getNameInGalaxy(" + ([name].toString()) + ")", LOG.Tmi);

    var newName = name.childNodes[0].nodeValue;
    if (!newName) {
        // Not inactive/banned/vaca
        return name.childNodes[0].innerHTML;
    }

    var index = newName.indexOf("(");
    if (index !== -1) {
        return newName.substring(0, index);
    }

    // Space is appended
    return newName.substring(0, newName.length - 1);
}

/**
 * Create the Markit popup window, letting the user choose a markit color
 * for a specific coordinate
 *
 * @param rows
 */
function appendMarkitWindow(rows) {
    log("Calling appendMarkitWindow(" + ([rows].toString()) + ")", LOG.Tmi);

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
                c.a = 0.5;
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
    log("Calling buildMarkitWindow(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling addTargetPlanetKeyListener(" + ([rows].toString()) + ")", LOG.Tmi);

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
 * Determine which button to show by default in the galaxy view (if any)
 * Different player -> save button that will replace
 * New player -> default save button
 * Saved player -> Green check, delete the player on click
 *
 * @param storedName
 * @param newName
 * @param coords
 */
function showDefaultButton(storedName, newName, coords) {
    log("Calling showDefaultButton(" + ([storedName, newName, coords].toString()) + ")", LOG.Tmi);

    if (!g_scriptInfo.EasyTarget) {
        return;
    }

    if (storedName && storedName !== newName) {
        // There's a different person here than what we have stored
        log("Different Person at " + coords.str, LOG.Verbose);
        if (usingOldVersion()) {
            replacePlayerInDatabase(newName, storedName, coords);
        } else {
            f.$("#save_0_" + coords.p)[0].style.display = "block";
        }
    } else if (!storedName) {
        // Found a new player at a new position
        if (usingOldVersion()) {
            setPlayerLocation(newName, coords);
            g_galaxyDataChanged = true;
        } else {
            f.$("#save_1_" + coords.p)[0].style.display = "block";
        }
    } else if (!usingOldVersion()) {
        // storedName === newName, no change. Add "saved" icon
        f.$("#save_2_" + coords.p)[0].style.display = "block";
    }
}

/**
 * Determine whether the player qualifies for processing
 * @param nameDiv
 * @param newName
 * @param rank
 * @param coords
 * @param settings
 */
function shouldProcessGalaxyItem(nameDiv, newName, rank, coords, settings) {
    log("Calling shouldProcessGalaxyItem(" + ([nameDiv, newName, rank, coords, settings].toString()) + ")", LOG.Tmi);

    // The player is inactive
    var inactive = nameDiv.className.indexOf("inactive") !== -1;
    var isBot = newName.indexOf("Bot_") === 0;
    return settings &&
        ((inactive && settings.inactive)          ||
            (!inactive && settings.active && !isBot)  ||
            (isBot && settings.bot))                  &&
        ((!g_config.EasyTarget.spyCutoff  ||
            rank < g_config.EasyTarget.spyCutoff) &&
            (!g_config.EasyTarget.useDoNotSpy || !g_doNotSpy[coords.g][coords.s][coords.p]));
}

/**
 * Add the option to delete a player from the galaxy data if
 * they're no longer seen in the galaxy itself
 * @param row
 * @param storedName
 * @param coords
 */
function deleteIfNeeded(row, storedName, coords) {
    log("Calling deleteIfNeeded(" + ([row, storedName, coords].toString()) + ")", LOG.Tmi);

    if (g_scriptInfo.EasyTarget && getPlayerAtLocation(coords)) {
        if (usingOldVersion()) {
            deleteUnusedPosition(coords, storedName);
        } else {
            var delDiv = createGalaxyDataButton(g_delIcon, 3, coords.p, 0.5);
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

/**
 * Creates the hidden div that contains the tooltip for each
 * player in the galaxy view
 * @param name - the name of the player
 * @param i - the player index
 */
function appendEasyTargetTooltipToWindow(name, i) {
    log("Calling appendEasyTargetTooltipToWindow(" + ([name, i].toString()) + ")", LOG.Tmi);

    getDomXpath("//body", f.document, 0).appendChild(buildNode("script", ["type"], ["text/javascript"],
        "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip(" +
        "{width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "
    ));

    var div = buildNode("div", ["style", "id"], ["display:none;", "divToolTip"], "");
    f.document.getElementsByTagName("body")[0].appendChild(div);
    div = buildNode("div", ['style', 'id'], ['display:none', 'data_tooltip_' + i], "");
    f.document.getElementsByTagName("body")[0].appendChild(div);
    writeLocationsOnMarkitTarget(name, i);
}

/**
 * Create the target icon in the galaxy view. This is also the
 * target for the tooltip
 * @param row
 * @param coords
 */
function appendTargetIcon(row, coords) {
    log("Calling appendTargetIcon(" + ([row, coords].toString()) + ")", LOG.Tmi);

    var div = buildNode('a', ['class', 'id', 'style'], ['tooltip', 'tooltip_' + (coords.p - 1), 'float:left; width:15px;'], "");
    var img = buildNode('img', ['src', 'id'], ['http://i.imgur.com/vCZBxno.png', 'img_' + coords.p], "");
    div.appendChild(img);
    row.childNodes[15].appendChild(div);
}

/**
 * Highlight the target planet after an EasyTarget redirect
 * Also transition to the markit color a second later if applicable
 * @param nameDiv
 * @param coords
 * @param rows
 */
function highlightTargetPlanet(nameDiv, coords, rows) {
    log("Calling highlightTargetPlanet(" + ([nameDiv, coords, rows].toString()) + ")", LOG.Tmi);

    nameDiv.parentNode.parentNode.style.backgroundColor = 'rgba(0, 100, 0, .8)';
    if (g_scriptInfo.Markit && g_markit[coords.str]) {
        // This person is also marked. Show the marking after a second.
        (function (coords, nameDiv) {
            setTimeout(function () {
                var newCoords = new Coordinates(coords.g, coords.s, g_targetPlanet);
                var c = hexToRgb('#' + g_config.Markit.color[g_markit[newCoords.str]]);
                if (nameDiv) {
                    c.a = 0.5;
                    animateBackground(rows[g_targetPlanet - 1], c, 600, false);
                }
            }, 1000);
        })(coords, nameDiv);
    }
}

/**
 * Add the click handler to the target icon in galaxy view
 * @param coords
 */
function addMarkitTargetClick(coords) {
    log("Calling addMarkitTargetClick(" + ([coords].toString()) + ")", LOG.Tmi);

    f.$('#img_' + coords.p).click(function() {
        f.$('#markit_current').html(coords.p);
        if (g_markit[coords.str]) {
            f.$('#' + g_markit[coords.str])[0].checked = 'checked';
        }
        else f.$('#default')[0].checked = 'checked';
        f.$('#markit_choose').fadeIn(500);
    });
}

/**
 * Add event handlers to show the EasyTarget div when the row
 * is clicked, also setting it as the active planet if it's not
 * already
 * @param rows
 * @param row
 * @param coords
 */
function addGalaxyRowClickHandler(rows, row, coords) {
    log("Calling addGalaxyRowClickHandler(" + ([rows, row, coords].toString()) + ")", LOG.Tmi);

    for (var j = 1; j < 14; j += 2) {
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
            if (g_targetPlanet !== -1 && g_targetPlanet !== coords.p) {
                var oldPos = coords.g + ":" + coords.s + ":" + g_targetPlanet;
                if (g_markit[oldPos]) {
                    var c =  hexToRgb('#' + g_config.Markit.color[g_markit[oldPos]]);
                    c.a = 0.5;
                    animateBackground(rows[g_targetPlanet - 1], c, 600, false);
                } else {
                    animateBackground(rows[g_targetPlanet - 1], g_targetPlanet % 2 === 0 ? "#111111" : "transparent", 600, true);
                }
            }

            if (g_targetPlanet !== coords.p) {
                g_targetPlanet = coords.p;
                animateBackground(rows[coords.p - 1], { r: 0, g: 100, b: 0, a: 0.8 }, 600, false);
            }
        });
    }
}

/**
 * Start the SFM routine
 * @param list
 */
function initiateSfm(list) {
    log("Calling initiateSfm(" + ([list].toString()) + ")", LOG.Tmi);

    var sfmLen = parseInt(getValue("autoSpyLength"));
    if (!isNaN(sfmLen) && sfmLen >= 0) {
        var fullGalaxySpy = getValue("fullGalaxySpy") && false;
        if (list.length === 0) {
            setValue("autoSpyLength", sfmLen - 1);
            if (sfmLen > 0) {
                setTimeout(function () {
                    f.document.getElementsByName('systemRight')[0].click();
                }, Math.random() * 300 + g_config.EasyTarget.spyDelay);
            } else if (fullGalaxySpy) {
                if (!autoAttack) {
                    setTimeout(function () {
                        setValue("redirToSpy", "1");
                        setValue("CompleteBot", true);
                        f.$("#sfmCheck").prop("checked", true);
                        f.$("#aaCheck").prop("checked", true);
                        f.location = "messages.php";
                    }, 5 * 60 * 1000); // After 5 minutes (waiting for fleet to arrive), turn on autoAttack and go to messages
                }
            }
        }

        for (var i = 0; i < list.length; i++) {
            var row = list[i];
            var last = i === list.length - 1;
            (function (row, last, i) {
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
                            setTimeout(function () {
                                f.document.getElementsByName('systemRight')[0].click();
                            }, Math.random() * 400 + g_config.EasyTarget.spyDelay);
                    }
                }, i * (g_config.EasyTarget.spyDelay) + g_config.EasyTarget.spyDelay);
            }(row, last, i));
        }
    } else {
        deleteValue("sfmSettings");
    }
}

/**
 * Append the Go Box to the galaxy view
 */
function appendGoBox() {
    log("Calling appendGoBox(" + ([].toString()) + ")", LOG.Tmi);

    var len = buildNode("input", ["type", "id", "size"], ["text", "autoSpyLength", "5"], "", "keyup", function(e) {
        if (e.keyCode === KEY.ENTER) {
            f.$("#sfmSubmit").click();
        }
    });
    var names = ["Inactive", "Active", "Bot"];
    var checks = [];
    var div;
    for (var i = 0; i < names.length; i++) {
        div = buildNode("div", ["style"], ["width:100px;display:inline"], "");
        var check = buildNode("input", ["type", "name", "id"], ["checkbox", names[i] + "_check", names[i] + "_check"], "");
        check.style.display = "none";
        var styleCheck = buildNode("label", ["for", "style"], [names[i] + "_check", "width:20px;height:20px;min-height:1px;margin:2px;background-color:#444;border:1px solid #999"], "&nbsp&nbsp&nbsp&nbsp", "click", function() {
            if (this.style.backgroundColor === "rgb(68, 68, 68)") {
                this.style.backgroundColor ="#111";
            } else {
                this.style.backgroundColor = "#444";
            }
        });
        if (i === 0) {
            f.$(check).prop("checked", true);
            styleCheck.style.backgroundColor = "#111";
        }
        var label = buildNode("label", ["for", "style"], [names[i] + "_check", ["padding-right:5px"]], names[i]);
        div.appendChild(check);
        div.append(styleCheck);
        div.appendChild(label);
        checks.push(div);
    }

    var goBox = buildNode("input", ["type", "id"], ["submit", "sfmSubmit"], "", "click", function() {
        var num = f.$("#autoSpyLength").val();
        var settings = {
            inactive : f.$("#Inactive_check").prop("checked"),
            active   : f.$("#Active_check").prop("checked"),
            bot      : f.$("#Bot_check").prop("checked")
        };
        setValue("autoSpyLength", num);
        setValue("fullGalaxySpy", parseInt(num) === 498);
        setValue("sfmSettings", JSON.stringify(settings));
        f.$("#galaxy_form").submit();
    });

    var newDiv = document.createElement("div");
    newDiv.append(checks[0]);
    newDiv.append(checks[1]);
    newDiv.append(checks[2]);
    newDiv.append(document.createElement("br"));
    newDiv.append(len);
    newDiv.append(goBox);
    div.appendChild(document.createElement("br"));
    f.$("#main").prepend(newDiv);
}

/**
 * After everything in the galaxy page has been processed,
 * make sure any needed changes are saved
 *
 * @param changedPlayers
 */
function handleGalaxyViewDataChanges(changedPlayers) {
    log("Calling handleGalaxyViewDataChanges(" + ([changedPlayers].toString()) + ")", LOG.Tmi);

    // If we've added entries for a player, sort
    // the coordinates before storing them
    for (var i = 0; i < changedPlayers.length; i++) {
        g_galaxyData.players[changedPlayers[i]].sort(galaxySort);
    }

    // Only write the potentially massive text file if we need to
    // TODO: Separate into smaller chunks?
    if (g_scriptInfo.EasyTarget && g_galaxyDataChanged) {
        log("Galaxy Data changed", LOG.Verbose);
        changeHandler(false /*forceSave*/);
    }

    if (g_inactivesChanged) {
        log("Inactive list changed", LOG.Verbose);
        changeHandler(false /*forceSave*/);
    }
}

/**
 * Grab the rows in the galaxy view, strip away ones we don't
 * care about, and add some custom CSS
 * @returns {*}
 */
function getGalaxyRows() {
    log("Calling getGalaxyRows(" + ([].toString()) + ")", LOG.Tmi);

    var rows = f.$('.curvedtot.space, .curvedtot.space1');
    rows.splice(0, 2);
    rows.splice(15);

    // Things get accidentally highlighted too often, disable selection
    rows.css({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    });

    return rows;
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
    log("Calling galaxySort(" + ([a, b].toString()) + ")", LOG.Tmi);

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
    log("Calling easyTargetRedirect(" + ([oldCoords, newCoords, rows, name].toString()) + ")", LOG.Tmi);

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
        } else if (oldCoords.p !== -1) {
            animateBackground(rows[oldCoords.p - 1], { r: 17, g: 17, b: 17, a: 0.0 }, 200, true);
        }
        // Mark the next target green
        animateBackground(rows[newCoords.p - 1], { r: 0, g: 100, b: 0, a: 0.8}, 200, false);

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
    log("Calling replacePlayerInDatabase(" + ([newName, storedName, coords].toString()) + ")", LOG.Tmi);

    // There's a different person at this location than what we have stored
    g_galaxyDataChanged = true;
    var locations, j;
    if (!g_galaxyData.players[newName]) {
        // If the owner of a planet has changed, and the new owner is not in the list, assume that
        // the user changed names and change things accordingly. I think
        locations = g_galaxyData.players[storedName];
        for (j = 0; j < locations.length; j++) {
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
    log("Calling coordsEqualStoredData(" + ([coords, location].toString()) + ")", LOG.Tmi);

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
    log("Calling indexOfPlanet(" + ([name, coords].toString()) + ")", LOG.Tmi);

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
    log("Calling storageFromCoords(" + ([coords].toString()) + ")", LOG.Tmi);

    return ((coords.g - 1) << GAL_SHIFT) + ((coords.s - 1) << SYS_SHIFT) + ((coords.p - 1) << PLN_SHIFT) + coords.l;
}

/**
 * Return a set of coordinates from the given storage representation
 * @param storage
 * @returns {Coordinates}
 */
function coordsFromStorage(storage) {
    log("Calling coordsFromStorage(" + ([storage].toString()) + ")", LOG.Tmi);

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
    log("Calling coordsStrFromStorage(" + ([storage, lune].toString()) + ")", LOG.Tmi);

    return getGal(storage) + ":" + getSys(storage) + ":" + getPln(storage) + (lune && getLun(storage) ? " (L)" : "");
}

/**
 * Returns the galaxy stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getGal(val) {
    log("Calling getGal(" + ([val].toString()) + ")", LOG.Tmi);

    // +1 to go from 0-based to 1-based indexing
    return ((val & GAL_MASK) >> GAL_SHIFT) + 1;
}

/**
 * Returns the system stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getSys(val) {
    log("Calling getSys(" + ([val].toString()) + ")", LOG.Tmi);

    return ((val & SYS_MASK) >> SYS_SHIFT) + 1;
}

/**
 * Returns the planet stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getPln(val) {
    log("Calling getPln(" + ([val].toString()) + ")", LOG.Tmi);

    return ((val & PLN_MASK) >> PLN_SHIFT) + 1;
}

/**
 * Returns the lune stored in the compressed localstorage number
 * @param val
 * @returns {number}
 */
function getLun(val) {
    log("Calling getLun(" + ([val].toString()) + ")", LOG.Tmi);

    return val & LUN_MASK;
}

/**
 * Update galaxyData player information
 * @param name
 * @param coords
 */
function updatePlayerInfo(name, coords) {
    log("Calling updatePlayerInfo(" + ([name, coords].toString()) + ")", LOG.Tmi);

    if (!g_galaxyData.players[name]) {
        // No entry for this particular player, create it
        g_galaxyDataChanged = true;
        g_galaxyData.players[name] = [];
    }

    var changedPlayer = false;
    // If we haven't added this planet location yet
    if (indexOfPlanet(name, coords) === -1) {
        changedPlayer = true;

        g_galaxyDataChanged = true;
        g_galaxyData.players[name].push(storageFromCoords(coords));
    }

    // If we don't have a moon and we used to
    var index = indexOfPlanet(name, coords);
    var stored = g_galaxyData.players[name][index];
    if ((!coords.l && getLun(stored)) || (coords.l && !getLun(stored))) {
        g_galaxyDataChanged = true;
        g_galaxyData.players[name][index] = stored + (coords.l ? 1 : -1);
    }

    if (changedPlayer) {
        g_galaxyData.players[name].sort(galaxySort);
    }
}

/**
 * Delete a position from the galaxy data. MUST be called on a
 * position/player combo that actually exists
 * @param coords
 * @param storedName
 */
function deleteUnusedPosition(coords, storedName) {
    log("Calling deleteUnusedPosition(" + ([coords, storedName].toString()) + ")", LOG.Tmi);

    g_galaxyDataChanged = true;
    log("Attempting to remove " + storedName + " at " + coords.str, LOG.Verbose);
    var player;
    if (storedName) {
        var index = indexOfPlanet(storedName, coords);
        if (index !== -1) {
            g_galaxyData.players[storedName].splice(index, 1);
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

/**
 * Create a button for the galaxyData save/remove options
 * @param saveIcon
 * @param id
 * @param index
 * @param opacity
 * @returns {Element}
 */
function createGalaxyDataButton(saveIcon, id, index, opacity) {
    log("Calling createGalaxyDataButton(" + ([saveIcon, id, index, opacity].toString()) + ")", LOG.Tmi);

    return buildNode('img', ['src', 'id', "style"], [saveIcon, 'save_' + id + "_" + index, "float:right;width:15px;height:15px;margin-bottom:-4px;margin-left:2px;opacity:" + opacity], "");
}

/**
 * Add a tooltip to the markit target that displays all
 * the player's known/saved locations
 * @param name
 * @param i
 */
function writeLocationsOnMarkitTarget(name, i) {
    log("Calling writeLocationsOnMarkitTarget(" + ([name, i].toString()) + ")", LOG.Tmi);

    var div = f.document.getElementById("data_tooltip_" + i);
    if (!div) {
        return;
    }

    var html = "<div><span style='color:#FFCC33'>Locations :</span><br />";
    var personExists = !!g_galaxyData.players[name];
    var loc = personExists ? g_galaxyData.players[name] : [];
    for (var j = 0; j < loc.length; j++) {
        var locStr = coordsStrFromStorage(loc[j], true /*lune*/);
        var space = (j < 9) ? "&nbsp" : "";
        html += (j + 1) + space + " : " + locStr;
        html += "<br />";
    }

    div.innerHTML = html;
}

/**
 * Create the div containing all the player's locations and append it
 *
 * @param nameDiv
 * @param name
 * @param coords
 * @param i
 * @param rows
 */
function createEasyTargetLocationDiv(nameDiv, name, coords, i, rows) {
    log("Calling createEasyTargetLocationDiv(" + ([nameDiv, name, coords, i, rows].toString()) + ")", LOG.Tmi);

    var oldInsert = f.document.getElementById("easyTargetList" + i);

    var insert = f.document.createElement("div");
    insert.id = "easyTargetList" + i;
    // TODO: getPlayerLocations = function(name) { return g_galaxyData.players[name]; }
    var personExists = !!g_galaxyData.players[name];
    for (var j = 0; personExists && j < g_galaxyData.players[name].length; j++) {
        var element = f.document.createElement('a');
        element.innerHTML = coordsStrFromStorage(g_galaxyData.players[name][j], true /*lune*/);
        if (coordsStrFromStorage(g_galaxyData.players[name][j], false /*lune*/) === coords.str) {
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
    for (j = 0; personExists && j < g_galaxyData.players[name].length; j++) {
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
    log("Calling autoCompleteSelected(" + ([p].toString()) + ")", LOG.Tmi);

    var pages = g_config.NoAutoComplete;
    if (pages[p]) return true;
    else if (pages.sims && p.indexOf('sim') !== -1) {
        return true;
    }
    return false;
}

/**
 * Show how much research/buildings cost in all deut
 */
function loadAllinDeut() {
    log("Calling loadAllinDeut(" + ([].toString()) + ")", LOG.Tmi);

    var xpathPages = {
        "buildings": "//div[@class='buildings_1b']/div[@class='buildings_1b1'][3]",
        "research": "//div[@class='research_1b']/div[@class='research_1b1'][3]"
    };

    var strings = [L_.AllinDeut_metal, L_.AllinDeut_crystal, L_.AllinDeut_deuterium];
    var ratios = [4, 2, 1];
    var doms = getDomXpath(xpathPages[g_page], f.document, -1);
    var inDeut = 0;
    for (var i = 0; i < doms.length; i++) {
        inDeut = 0;
        for (var j = 0; j < 3; j++) {
            var match = new RegExp(strings[j] + "\\s:\\s<font\\s.{15}>([^<]*)</font>").exec(doms[i].innerHTML);
            if (match && match.length) {
                inDeut = add(inDeut, divide(match[1].replace(/\./g, ""), ratios[j]));
            }
        }

        doms[i].appendChild(buildNode("div", [], [],
            "<font color='lime'>AllinDeut</font> : " + getSlashedNb(inDeut)));
    }

}

/**
 *
 */
function loadiFly() {
    log("Calling loadiFly(" + ([].toString()) + ")", LOG.Tmi);

    var i = 1,
        ressources, metal, cristal, deut, metal_total = 0,
        cristal_total = 0,
        deut_total = 0,
        equivalent_deut_total,
        chaine_total = "";
    while (f.document.getElementById("data_tooltip_" + i)) {
        ressources = f.document.getElementById("data_tooltip_" + i).getElementsByTagName(
            "div");
        if (ressources[0].innerHTML.indexOf(L_.iFly_metal) !== -1) {
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
    html += "<div class='default_space padding5 curvedot'>" + L_.iFly_deutfly +
        " : " + getSlashedNb(equivalent_deut_total) + "</div>";
    f.document.getElementById("data_tooltip_10000").appendChild(buildNode("div", [], [],
        html));
}

/**
 * Improved chat
 */
function loadTChatty() {
    log("Calling loadTChatty(" + ([].toString()) + ")", LOG.Tmi);

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
        if (this.value.length > 232) this.value = this.value.substring(0, 232); //\u00a8La limite de 255 - la place que les balises colors prennent
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
    log("Calling disableAutoComplete(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling saveFleetPage(" + ([].toString()) + ")", LOG.Tmi);

    var locData = JSON.stringify(f.location);
    setValue("savedFleet", locData);
    var mc = f.$('#ship217');
    if (mc[0])
        mc[0].focus();

    var attackData;
    try {
        attackData = JSON.parse(getValue("attackData"));
    } catch (ex) {}

    if (autoAttack && attackData) {

        if (attackData.waves > 0)
        {
            var regx = /[a-z ]+([0-9]+)[on ]+([0-9]+)/;
            var x = regx.exec(f.document.getElementsByClassName("flotte_header_left")[0].innerHTML);
            var fleetOut = parseInt(x[1]);
            var fleetMax = parseInt(x[2]);

            var dotted = mc.parent().parent().children()[1].childNodes[0].innerHTML.replace(/\./g, "");
            var max = parseInt(dotted);
            var totalShips = 0;
            var futureShips = attackData.mc;
            for (var i = 0; i < attackData.waves; i++) {
                totalShips += futureShips;
                futureShips = Math.ceil((futureShips / 2) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
            }

            var enoughAttackType = true;
            var shipSel;
            if (attackData.type !== -1) {
                shipSel = f.$("#ship" + g_merchantMap[g_fleetNames[attackData.type]]);
                var maxAttack = parseFloat(shipSel.parent().parent().children()[1].childNodes[0].innerHTML.replace(/\./g, ""));
                var totalAttShip = 0;
                var futureAttShip = attackData.val;
                for (i = 0; i < attackData.waves; i++) {
                    totalAttShip += futureAttShip;
                    futureAttShip = Math.ceil((futureAttShip * 0.7) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
                }
                enoughAttackType = maxAttack >= totalAttShip;
            }

            if (fleetOut + attackData.waves > fleetMax || max < totalShips || !enoughAttackType) {
                deleteValue("attackData");
                deleteValue("autoAttackIndex");
                // setValue("fleetNotSent", true);
                var div = f.document.createElement("div");
                div.style.color = "Red";
                div.style.fontWeight = "bold";
                div.style.fontSize = "14pt";
                var minReturn = findMinReturn();
                if (minReturn !== 1E12) {
                    div.innerHTML = "Requirements not met! Next fleet back in " + minReturn + " seconds";
                } else {
                    div.innerHTML = "Requirements not met! Trying again in 30 seconds";
                    minReturn = 30;
                }
                f.$("#main").prepend(div);
                // Wait 30 seconds and try again
                g_interval = setInterval(function(minReturn) {
                    var text = "Requirements not met! Next fleet back in " + (minReturn - g_intervalCount) + " seconds";
                    if (minReturn === 30) {
                        text = "Requirements not met! Trying again in " + (minReturn - g_intervalCount) + " seconds";
                    }
                    f.$("#main").children()[0].innerHTML = text;
                    if (g_intervalCount++ === minReturn) {
                        g_intervalCount = 1;
                        clearInterval(g_interval);
                        setValue("redirToSpy", "1");
                        f.location.href = "messages.php?mode=show?messcat=0";
                    }
                }, 1000, minReturn);
                return;
            }

            mc.val(attackData.mc);
            attackData.waves--;
            attackData.mc = Math.ceil((attackData.mc / 2) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
            if (attackData.type >= 0) {
                shipSel.val(attackData.val);
                attackData.val = Math.ceil((attackData.val * 0.7) / g_config.EasyFarm.granularity) * g_config.EasyFarm.granularity;
            }
            setValue("attackData", JSON.stringify(attackData));
            setTimeout(function() {
                f.$('input[type=submit]')[0].click();
            }, Math.random() * 400 + 200); // It takes awhile to enter ships, take a bit longer here
            // }
        } else {
            deleteValue("attackData");
        }
    } else {
        if (attackData) {
            var typeDiv = f.$("#ship" + g_merchantMap[g_fleetNames[attackData.type]]);
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
 * Find the time to the next fleet return
 * @returns {number}
 */
function findMinReturn() {
    log("Calling findMinReturn(" + ([].toString()) + ")", LOG.Tmi);

    var min = 1E12;
    f.$(".flotte_liste_6").each(function() {
        min = Math.min(min, getSeconds(f.$(this).text()));
    });
    return min;
}

/**
 * Parse a fleet time (xxh xxm xxs) into the number of seconds
 * @param time
 * @returns {number}
 */
function getSeconds(time) {
    log("Calling getSeconds(" + ([time].toString()) + ")", LOG.Tmi);

    var rgx = /(\d{2})\D+(\d{2})\D+(\d{2})/;
    var matches = rgx.exec(time);
    if (matches && matches.length === 4) {
        return (parseInt(matches[1]) * 60 * 60) + (parseInt(matches[2]) * 60) + parseInt(matches[3]);
    } else {
        return 1E12;
    }
}

/**
 * More autoAttack and keyboard shortcuts
 */
function continueAttack() {
    log("Calling continueAttack(" + ([].toString()) + ")", LOG.Tmi);

    if (autoAttack && parseInt(getValue("autoAttackIndex")) >= 0) {
        setTimeout(function() {
            f.$('input[type=submit]')[0].click();
        }, Math.random() * 100 + 50); // Just Enter/Enter/Enter, doesn't take as long
    }
}

function setupFleet2() {
    log("Calling setupFleet2(" + ([].toString()) + ")", LOG.Tmi);

    sendAttack();
}

function sendAttack() {
    log("Calling sendAttack(" + ([].toString()) + ")", LOG.Tmi);

    if (autoAttack && parseInt(getValue("autoAttackIndex")) >= 0) {
        setTimeout(function() {
            f.$('input[type=submit]')[0].click();
        }, Math.random() * 100 + 50); // Again, just pressing enter. Much faster.
    }
}

/**
 * Entry point for loading the scripts located under the "more" config category
 */
function loadMore() {
    log("Calling loadMore(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling loadMoonList(" + ([].toString()) + ")", LOG.Tmi);

    var options = f.document.getElementById("changeplanet").getElementsByTagName("option");
    for (var i = 0; i < options.length; i++)
        if (/(\(M\))|(\(L\))/.test(options[i].innerHTML)) options[i].style.color =
            "SteelBlue";
}

/**
 * Loads the additional functionality in the merchant page
 */
function loadConvertDeut() {
    log("Calling loadConvertDeut(" + ([].toString()) + ")", LOG.Tmi);

    if (f.document.getElementById('marchand_suba')) {

        var a = f.document.getElementById("marchand_suba").getElementsByTagName("a");
        var script = "";
        for (var i = 0; i < a.length; i++)
            script += a[i].getAttribute("onclick");
        var div = buildNode("div", [], [], L_.More_convertInto +
            ' : <a style="color:#F2A10A" id="allMetal" href="javascript:" onclick="' + script +
            'document.getElementById(\'metal2\').checked=\'checked\'; calcul();">' +
            "metal" +
            '</a> | <a style="color:#55BBFF" id="allCryst" href="javascript:" onclick="' + script +
            'document.getElementById(\'cristal2\').checked=\'checked\'; calcul();">' +
            L_.More_crystal +
            '</a> | <a style="color:#7BE654" id="allDeut" href="javascript:" onclick="' + script +
            'document.getElementById(\'deut2\').checked=\'checked\'; calcul();">' +
            L_.More_deuterium + '</a>');
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
    log("Calling loadTraductor(" + ([].toString()) + ")", LOG.Tmi);

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
    log("Calling loadResources(" + ([].toString()) + ")", LOG.Tmi);

    var html = "<div class='ressources_sub1a' style='float:left'>" + L_.More_allTo + "</div>";
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
    log("Calling loadRedirectFleet(" + ([].toString()) + ")", LOG.Tmi);

    var fullLoc = false;
    var loc = null;
    try {
        loc = JSON.parse(getValue("savedFleet"));
        if (loc)
            fullLoc = true;
    } catch (ex) {
        fullLoc = false;
    }

    var attackData;
    try {
        attackData = JSON.parse(getValue("attackData"));
    } catch (ex) {}

    if (autoAttack && attackData && attackData.waves === 0) {
        deleteValue("attackData");
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
    log("Calling processSim(" + ([].toString()) + ")", LOG.Tmi);

    var winStringEn = "The attacker has won the battle!";
    var winStringFr = "L'attaquant gagne la bataille !";
    var sel = $(".rc_contain.curvedtot");
    // var nextRoundForm = $("#formulaireID");
    var victory = sel[sel.length - 2].children[0].innerHTML === winStringEn || sel[sel.length - 2].children[0].innerHTML === winStringFr;
    // Things get wonky with very high values and it'll tell us we lost units when we haven't.
    // M/C/D seems to be correct though, so make sure those are all 0.
    var regex = new RegExp(/<font color="#7BE654">([\d.E+]+)<\/font>/);
    var text = sel[sel.length - 1].children[0].innerHTML;
    regex.exec(text);
    var lostUnits = 0;
    for (var i = 0; i < 3; i++) {
        var amount = regex.exec(text)[1];
        if (amount.indexOf("E") !== -1) {
            lostUnits += parseFloat(amount);
        } else {
            lostUnits += parseInt(amount.replace(/\./g, ""));
        }
    }

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
    log("Calling setValue(" + ([key, value].toString()) + ")", LOG.Tmi);

    return GM_setValue(key + g_uni, value);
}

/**
 * Retrieve the given key with the universe appended
 *
 * @param key
 */
function getValue(key) {
    log("Calling getValue(" + ([key].toString()) + ")", LOG.Tmi);

    return GM_getValue(key + g_uni);
}

/**
 * Delete the given key with the universe appended
 * @param key
 */
function deleteValue(key) {
    log("Calling deleteValue(" + ([key].toString()) + ")", LOG.Tmi);

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
    log("Calling Coordinates(" + ([gal, sys, planet, lune].toString()) + ")", LOG.Tmi);

// TODO: Definitely shouldn't use g/s/p/l, use gal/sys/pln/lun at least, preferably full names
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
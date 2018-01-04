// ==UserScript==
// @name        SpacesWars_Inner
// @namespace   none
//
// @exclude     http://spaceswars.com/*/frames.php*
// @include     http://spaceswars.com*
// @include     http://www.spaceswars.com*
//
// @include     http://spaceswars.com/forum*
// @include     http://www.spaceswars.com/forum*
// @include     http://spaceswars.fr/forum*
// @include     http://www.spaceswars.fr/forum*
//
// @grant GM_getValue
//
// ==/UserScript==
//
// userscript created by NiArK
//                      (some scripts by d4rkv3nom, banned for bot using...)
// userscript updated and expanded by DTR

/* global GM_getValue*/
/* global $*/


var g_info = getInfoFromPage();
var g_page = g_info.loc;


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

// Only load jscolor if it's needed. It's currently used by the chat page and the config page
if (g_page === "chat" || (g_page === "achatbonus") && window.location.search.includes("config=1")) {
    document.getElementsByTagName("head")[0].appendChild(buildNodeInner("script", [
        "src", "type"
    ], ["https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js", "text/javascript"], ""));
}

if (window.top.notifyNewPage)
    window.top.notifyNewPage(g_page);

if (g_page === "rw") {
    loadRConverter();
}

/**
 * Creates nicely formatted battle reports. Not written by me, but has
 * been tweaked so as not to break anything.
 *
 * Probably not going to attempt a refactor. Mostly because this is one
 * of the oldest parts the the code and has remained relatively untouched
 * other than ensuring it continues to work as the game updated
 */
function loadRConverter() {
    var config;
    try {
        console.log("uni: " + g_info.universe);
        config = JSON.parse(GM_getValue("configScripts" + g_info.universe));
        console.log(config);
    } catch (ex) {}

    if (!config) {
        config = {};
        config.RConverter = {};
        config.RConverter.header = "";
        config.RConverter.boom = "";
        config.RConverter.destroyed = "";
        config.RConverter.result = "";
        config.RConverter.renta = "";
    }

    // The original icons are gone.
    var scriptsIcons = "";
    
    var couleurs_rc = {
        0: "#0000FF",
        1: "#8A2BE2",
        2: "#A52A2A",
        3: "#D2691E",
        4: "#6495ED",
        5: "#DC143C",
        6: "#00008B",
        7: "#008B8B",
        8: "#006400",
        9: "#8B008B",
        10: "#8B0000",
        11: "#1E90FF",
        12: "#B22222",
        13: "#008000",
        14: "#4B0082",
        15: "#800000",
        16: "#800080",
        17: "#FF4500",
        18: "#000",
        19: "#2E8B57",
        20: "#4682B4",
        21: "#8B4513",
        22: "#FA8072",
        23: "#FF0000",
        24: "#DA70D6",
        25: "#7B68EE",
        26: "#3CB371",
        27: "#0000CD"
    };
    var rapport = document.getElementById('rc_main').getElementsByClassName('rc_contain curvedtot');
    var nb_tours = ((rapport.length === 3) ? 1 : 2); //nb_tours = 2 lorsqu'il y a au moins deux tours

    var rapport_tour1 = rapport[0];
    if (nb_tours !== 1) {
        var rapport_tour2 = rapport[rapport.length - 4];
    }

    var date_rc = document.getElementById('rc_main').getElementsByClassName('divtop curvedtot')[0].innerHTML;
    var participants = [];
    participants[0] = []; // Pseudos et techs
    participants[1] = []; // Flottes Avant
    participants[2] = []; // Flottes Après
    //Noms des joueurs et technos
    var i, j;
    for (i = 0; i < rapport_tour1.getElementsByClassName('divtop curvedtot').length; i++) {
        participants[0][i] = rapport_tour1.getElementsByClassName(
            'divtop curvedtot')[i].innerHTML.replace(
            /(?:Attaquant|Attacker) ([a-zA-Z0-9_]*)/g,
            'Attaquant [b][size=128][color=#FF0040]$1[/color][/size][/b]').replace(
            /(?:Défenseur|Defender) ([a-zA-Z0-9_]*)/g,
            'Défenseur [b][size=128][color=#008040]$1[/color][/size][/b]').replace(
            /\(/g, '\n').replace(/\)/g, '\n').replace(/\[\d:\d{1,3}:\d{1,2}]/g, '').replace(
            /<font color="#7BE654">/g, '[b]').replace(/<\/font>/g, '[/b]');
    }

    var flotte_joueur_tmp, nom_vaisseau, quantite_vaisseau;

    var flottes = rapport_tour1.getElementsByClassName('rc_space curvedtot');
    for (i = 0; i < flottes.length; i++) {
        flotte_joueur_tmp = flottes[i].getElementsByClassName('rc_rows');
        participants[1][i] = [];
        for (j = 0; j < flotte_joueur_tmp.length; j++) {
            nom_vaisseau = flotte_joueur_tmp[j].getElementsByClassName('rc_rows1')[0].innerHTML;
            quantite_vaisseau = flotte_joueur_tmp[j].getElementsByTagName('font')[0].innerHTML;
            participants[1][i][j] = [nom_vaisseau, quantite_vaisseau];
        }
    }

    if (nb_tours !== 1) {
        flottes = rapport_tour2.getElementsByClassName('rc_space curvedtot');
        for (i = 0; i < flottes.length; i++) {
            flotte_joueur_tmp = flottes[i].getElementsByClassName('rc_rows');
            participants[2][i] = [];
            for (j = 0; j < flotte_joueur_tmp.length; j++) {
                nom_vaisseau = flotte_joueur_tmp[j].getElementsByClassName('rc_rows1')[0].innerHTML;
                quantite_vaisseau = flotte_joueur_tmp[j].getElementsByTagName('font')[0].innerHTML;
                participants[2][i][j] = [nom_vaisseau, quantite_vaisseau];
            }
        }
    }

    var resultat_combat = rapport[rapport.length - 3].getElementsByClassName('divtop curvedtot')[0].innerHTML;
    if (rapport[rapport.length - 3].getElementsByClassName('space0')[0] !== null && rapport[rapport.length - 3].getElementsByClassName('space0')[0] !== undefined) {
        resultat_combat += "  " + rapport[rapport.length - 3].getElementsByClassName(
            'space0')[0].innerHTML.replace(/<font color="#7BE654">/g,
            '[b][size=120][color=#C03000]').replace(/<\/font>/g,
            '[/b][/size][/color]')
    }
    var resultat_CDR = rapport[rapport.length - 2].getElementsByClassName(
        'space0')[2].innerHTML.replace(/<font color="#7BE654">/g,
        '[b][size=120][color=#7BE654]').replace(/<\/font>/g,
        '[/b][/size][/color]');
    var renta_attaquant = rapport[rapport.length - 2].getElementsByClassName(
        'space0')[3].innerHTML.replace(/<font color="#7BE654">/g,
        '[b][size=120][color=#7BE654]').replace(/<\/font>/g,
        '[/b][/size][/color]').replace(/<font color="#DB5656">/g,
        '[b][size=120][color=#DB5656]').replace(/<\/font>/g,
        '[/b][/size][/color]').replace(/<br>/g, '\n');
    var renta_defenseur = rapport[rapport.length - 2].getElementsByClassName(
        'space0')[4].innerHTML.replace(/<font color="#7BE654">/g,
        '[b][size=120][color=#7BE654]').replace(/<\/font>/g,
        '[/b][/size][/color]').replace(/<font color="#DB5656">/g,
        '[b][size=120][color=#DB5656]').replace(/<\/font>/g,
        '[/b][/size][/color]').replace(/<br>/g, '\n');

    var rapport_converti = "";
    rapport_converti += "[center][b][img]" + ((config.RConverter.header === '') ?
        scriptsIcons + 'RConverter/header.png' : config.RConverter.header) + "[/img]\n\n";
    rapport_converti += date_rc + "[/b]\n";
    rapport_converti += "_________________________________________________\n\n";
    for (i = 0; i < participants[0].length; i++) {
        rapport_converti += participants[0][i];
        if (participants[1][i].length === 0) {
            rapport_converti += "[img]" + ((config.RConverter.destroyed === '') ?
                scriptsIcons + 'RConverter/destroyed.png' : config.RConverter.destroyed) + "[/img]\n";
        }
        for (j = 0; j < participants[1][i].length; j++) {
            rapport_converti += "[color=" + couleurs_rc[j] + "]" + participants[1][i][j][0] + " " + participants[1][i][j][1] + "[/color]\n";
        }
        rapport_converti += "\n\n";
    }

    if (nb_tours !== 1) {
        var difference;
        rapport_converti += "[img]" + ((config.RConverter.boom === '') ?
            scriptsIcons + 'RConverter/boom.png' : config.RConverter.boom) +
            "[/img]";
        rapport_converti += "\n\n";

        for (i = 0; i < participants[0].length; i++) {
            rapport_converti += participants[0][i];
            if (participants[2][i].length === 0) {
                rapport_converti += "[img]" + ((config.RConverter.destroyed === '') ?
                        scriptsIcons + 'RConverter/destroyed.png' : config.RConverter.destroyed
                ) + "[/img]\n";
            }
            for (j = 0; j < participants[2][i].length; j++) {
                for (var k = 0; k < participants[1][i].length; k++) {
                    if (participants[2][i][j][0] === participants[1][i][k][0]) {
                        difference = swToNumberRc(participants[1][i][k][1]) -
                            swToNumberRc(participants[2][i][j][1]);
                        break;
                    }
                }
                rapport_converti += "[color=" + couleurs_rc[j] + "]" + participants[2][i][j][0] +
                    " " + participants[2][i][j][1] + "[/color][color=#FF0040]         -" +
                    getSlashedNb(difference) + "[/color]\n";
            }
            rapport_converti += "\n\n\n";
        }
    }
    rapport_converti += "[img]" + ((config.RConverter.result === '') ?
        scriptsIcons + 'RConverter/result.png' : config.RConverter.result) + "[/img]\n";
    rapport_converti += resultat_combat + "\n\n";
    rapport_converti += resultat_CDR + "\n\n";
    rapport_converti += "[img]" + ((config.RConverter.renta === '') ?
        scriptsIcons + 'RConverter/renta.png' : config.RConverter.renta) + "[/img]\n";
    rapport_converti += renta_attaquant + "\n\n";
    rapport_converti += renta_defenseur + "\n\n";
    rapport_converti += "[/center]";

    var html =
        "<textarea id='RConverter' cols=50 rows=9 onclick='this.select()'>" +
        rapport_converti + "</textarea><div>" + "Appuyez sur Ctrl+C pour copier, Ctrl+V pour coller" + "</div>";
    html +=
        "<input type='radio' onclick='document.getElementById(\"RConverter\").value+=\"[spoiler=lien][url]\"+window.location.href+\"[/url][/spoiler]\";" +
        " document.getElementById(\"RConverter\").select();'/>" + "Cochez si c'est un HoF (afin d'ajouter le lien, obligatoire sur le forum)";
    getDomXpathInner("//body", document, 0).appendChild(buildNodeInner("center", ["class", "style"], ["space1 curvedtot", "position:absolute; right:0; top:30px;"], html));
    document.getElementById("RConverter").select();
}

/**
 * Parses a number represented by a string with comma separators
 * @param sw_stringnumber - the String to parse
 * @returns {Number}
 */
function swToNumberRc(sw_stringnumber) { //Spécial pour les RC ( virgules à la place des points) {
    return parseInt(sw_stringnumber.replace(/,/g, ''));
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
 * Get dom elements based on an xpath and return a specific result
 *
 * @param xpath - the xpath expression
 * @param inDom - document to search
 * @param row - the row to return (optionally -1 to return all and -42 to return the last)
 * @returns {*} the desired dom element(s)
 */
function getDomXpathInner(xpath, inDom, row) {
    var tab = [];
    var alltags = document.evaluate(xpath, inDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < alltags.snapshotLength; i++) {
        tab[i] = alltags.snapshotItem(i);
    }
    if (row === -1) return tab;
    if (row === -42) return tab[tab.length - 1];
    else return tab[row];
}

function buildNodeInner(type, attr, attrValue, content, event, eventFunc) {
    var elem = document.createElement(type);
    for (var i = 0; i < attr.length; i++)
        elem.setAttribute(attr[i], attrValue[i]);
    if (event) elem.addEventListener(event, eventFunc, false);
    elem.innerHTML = content;
    return elem;
}
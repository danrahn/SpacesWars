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
// ==/UserScript==
//
// userscript created by NiArK
//                      (some scripts by d4rkv3nom, banned for bot using...)
// userscript updated and expanded by DTR


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

if (window.top.notifyNewPage)
    window.top.notifyNewPage(g_page);
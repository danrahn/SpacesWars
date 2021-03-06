/******************************
 * Begin Config/Settings page
 ******************************/

/* global GM_setValue*/
/* global GM_deleteValue*/
/**
 * Overwrites the "Bonus" page with our script config page. So ugly,
 * but when you build up an entire page of elements using mostly vanilla
 * JS, that's what you get.
 */
function createAndLoadConfigurationPage() {

    // Clear out the current contents and replace with
    // the settings div
    var main = f.document.getElementById("main");
    main.innerHTML = "";
    main.removeAttribute("id");
    main.className = "mainSettings";

    setStyle();

    // Needed to get new tooltips to work
    getDomXpath("//body", f.document, 0).appendChild(buildNode("script", ["type"], ["text/javascript"],
        `
        $(document).ready(
            function(){
                setTimeout(
                    function(){
                        $('.tooltip').tooltip(
                            {
                                width: 'auto',
                                height: 'auto',
                                fontcolor: '#FFF',
                                bordercolor: '#666',
                                padding: '5px',
                                bgcolor: '#111',
                                fontsize: '10px'
                            }
                        );
                    }, 10
                );
            }
        );
        `
    ));

    var scripts = createScripts();

    // Attach main new scripts and their options
    var save = buildNode('input', ['type', 'id', 'value'], ['button', 'save', 'Save'], '');
    save.onclick = saveSettings;
    var deleteAll = buildNode('input', ['type', 'id', 'value'], ['button', 'delAll', 'Delete All Data'], '', 'click', function() {
        if (confirm("Are you sure you want to delete all data across all universes?")) {
            deleteAllData();
            this.value = "Deleted";
            window.location = 'http://www.spaceswars.com/';
        }
    });

    if (g_inPlanetView) {
        var GM = createCheckBoxItems(["\x47\x6f\x64\x20\x4d\x6f\x64\x65"], 100)[0];
        GM.childNodes[0].checked = usingOldVersion();
        GM.childNodes[0].addEventListener("change", function() {
            GM_setValue("gb", !!this.checked);
            window.location = "frames.php";
        });
        GM.style.float = "right";
        main.appendChild(GM);
    }

    var col1 = buildNode('div', ['class', 'id'], ['col', 'col1'], '');
    var col2 = buildNode('div', ['class', 'id'], ['col', 'col2'], '');
    var col1Cutoff = 8; // Show the first n scripts in the first column, the rest go in the second
    main.appendChild(save);
    main.appendChild(col1);
    main.appendChild(col2);
    main.appendChild(deleteAll);

    // Current order: Col1: RConverter, EasyFarm, AllinDeut, iFly, TChatty, InactiveStats, EasyTarget, NoAutoComplete
    //                Col2: Markit, GalaxyRanks, BetterEmpire, FleetPoints, More, Log
    for (var i = 0; i < scripts.length; i++) {
        if (i < col1Cutoff)
            col1.append(scripts[i]);
        else
            col2.append(scripts[i]);
    }

    if (!usingOldVersion()) {
        g_scriptInfo.FleetPoints = 0;
        scripts[scripts.length - 2].style.display = "none";
    }

    f.document.body.appendChild(main);

    // Add click events to betterEmpire
    f.$('#' + L_.betterEmpMain.replace(" ", "") + "_check").click(function() {
        if (!this.checked) {
            var betterEmpId = f.$("#" + L_.betterEmpMoon.replace(" ", "") + "_check");
            betterEmpId.attr("checked", false);
            betterEmpId.attr("disabled", true);
        } else {
            f.$("#" + L_.betterEmpMoon.replace(" ", "") + "_check").removeAttr("disabled");
        }
    });

    // fill in the config with the stored values
    populateConfig();
}

/**
 * Set the various styles for the config page, as it must be built from scratch in JS only
 */
function setStyle() {
    (function() {
        // Set custom CSS inline in JS, because why not
        var style = document.createElement('style');
        //noinspection JSAnnotator,JSAnnotator
        style.appendChild(f.document.createTextNode(
            `
        .hidden {
            display: none;
        }

        #divToolTip {
            z-index: 99999;
        }

        .mainSettings {
            background-color: rgba(0,0,0,.5);
            border: 1px solid #444;
            padding: 5% auto;
            margin-top: 40px;
            margin-left: 10%;
            margin-right: 10%;
            width: auto;
            min-width: 1000px;
            overflow: auto;
        }
        .hidden {
            display : none;
        }

        .col {
            width: 50%;
            display: inline-block;
            min-width: 500px;
            vertical-align: top;
            position: relative;
            margin: 0 auto;
        }

        .script_container {
            border: 2px solid #666;
            border-radius: 3px;
            margin: 10px;
            min-width: 300px;
        }

        .script {
            border-bottom: 2px solid #666;
            padding: 5px;
            background-color: rgba(50, 50, 50, .5);
            margin: 0;
            width: auto;
            overflow: hidden;
        }

        .script:hover {
            background-color: rgba(50, 50, 50, .4);
        }
        .script_title {
            display: inline;
            min-width: 100px;
        }
        .script_active {
            display: inline;
            position: relative;
            float: right;
        }
        .tooltip {
            display: inline;
        }
        .script_options {
            width: auto;
            background-color: rgba(100,100,100,.5);
            border: 2px solid rgba(100,100,100,.5);
            padding: 5px;
        }

        .script_options:hover {
            background-color: rgba(100, 100, 100, .4);
        }

        #save, #delAll {
            display: block;
            padding: 2px;
            margin: 10px;
            padding: 4px;
        }

        #save {
            font-size: 12pt;
            color: green;
        }

        #delAll {
            color: red;
            float: right;
        }

        #save:hover {
            color: black;
            background-color: green;
            box-shadow: 0 0 6px green;
        }

        #delAll:hover {
            color: black;
            background-color: red;
            box-shadow: 0, 0, 4px red;
        }

        .scriptDesc {
            color: lime;
        }

        #EasyTarget_text {
            border: 1px solid #545454;
            padding: 1px;
            vertical-align: middle;
            border-radius: 5px;
            color: #CDD7F8;
            font: 8pt "Times New Roman" normal;
            margin: 1%;
            background-color: rgba(0,0,0,0.8);
            width: 96%;
            max-width: 96%
        }
        `));
        f.document.head.appendChild(style);
    })();
}

/**
 * Fill the config fields with what's stored (or defaults if we don't have any data)
 */
function populateConfig() {

    var actives = getDomXpath("//div[@class='script_active']/input[1]", f.document, -1),
        script;
    var options = getDomXpath("//div[@class='script_options']", f.document, -1),
        inputs;

    if (g_scriptInfo === undefined || g_scriptInfo === null) {
        log("reset", LOG.Warn);
        g_scriptInfo = setScriptsInfo();
    }

    // RConverter
    inputs = options[0].getElementsByTagName("input");
    inputs[0].value = g_config.RConverter.header;
    inputs[1].value = g_config.RConverter.boom;
    inputs[2].value = g_config.RConverter.destroyed;
    inputs[3].value = g_config.RConverter.result;
    inputs[4].value = g_config.RConverter.renta;

    // EasyFarm
    inputs = options[1].getElementsByTagName("input");
    inputs[0].value = g_config.EasyFarm.minPillage;
    inputs[1].value = g_config.EasyFarm.colorPill;
    inputs[2].value = g_config.EasyFarm.minCDR;
    inputs[3].value = g_config.EasyFarm.colorCDR;
    inputs[4].value = g_config.EasyFarm.defMultiplier ? g_config.EasyFarm.defMultiplier : 1;
    inputs[5].value = g_config.EasyFarm.granularity ? g_config.EasyFarm.granularity : 100000;
    inputs[6].value = g_config.EasyFarm.simGranularity;
    inputs[7].value = g_config.EasyFarm.simThreshold;
    inputs[8].value = g_config.EasyFarm.botLootLevel;
    f.$("#simShip").val(g_config.EasyFarm.simShip);
    if (g_config.EasyFarm.botSn) inputs[9].checked = "checked";

    // EasyTarget
    inputs = options[2].getElementsByTagName('input');
    inputs[0].addEventListener('click', function() {
        // EasyTarget import
        var easyTargetText = f.$('#EasyTarget_text')[0];
        var data = easyTargetText.value;
        try {
            JSON.parse(data);
        } catch (err) {
            alert('Invalid format, not changing');
            return;
        }
        if (data.length !== 0) {
            var conf = confirm("Are you sure you want to change the galaxy data? This cannot be undone.");
            if (!data.universe) {
                data.universe = {};
            }

            if (!data.players) {
                data.players = {}
            }

            if (conf) {
                setValue("galaxyData", data);
                g_galaxyData = JSON.parse(data);
            }
            easyTargetText.value = '';
        }
    });
    inputs[1].addEventListener('click', function() {
        var easyTargetText = f.$('#EasyTarget_text')[0];
        easyTargetText.value = getValue("galaxyData");
        easyTargetText.focus();
        easyTargetText.select();
    });
    inputs[2].value = g_config.EasyTarget.spyCutoff ? g_config.EasyTarget.spyCutoff : 0;
    inputs[3].value = g_config.EasyTarget.spyDelay ? g_config.EasyTarget.spyDelay : 0;
    if (g_config.EasyTarget.useDoNotSpy) inputs[4].checked = true;

    // NoAutoComplete
    inputs = options[3].getElementsByTagName('input');
    inputs[0].checked = g_config.NoAutoComplete.galaxy;
    inputs[1].checked = g_config.NoAutoComplete.fleet;
    inputs[2].checked = g_config.NoAutoComplete.floten1;
    inputs[3].checked = g_config.NoAutoComplete.floten2;
    inputs[4].checked = g_config.NoAutoComplete.build_fleet;
    inputs[5].checked = g_config.NoAutoComplete.build_def;
    inputs[6].checked = g_config.NoAutoComplete.sims;
    inputs[7].checked = g_config.NoAutoComplete.marchand;
    inputs[8].checked = g_config.NoAutoComplete.scrapdealer;

    // Markit
    inputs = options[4].getElementsByTagName("input");
    inputs[0].value = g_config.Markit.color.fridge;
    inputs[1].value = g_config.Markit.color.bunker;
    inputs[2].value = g_config.Markit.color.raidy;
    inputs[3].value = g_config.Markit.color.dont;
    inputs[4].addEventListener("click", function() {
        if (confirm("Reset ?")) {
            g_config.Markit.coord = {};
            setValue("markit_data", JSON.stringify({}));
            setValue("configScripts", JSON.stringify(g_config));
        }
    }, false);

    // GalaxyRanks
    inputs = options[5].getElementsByTagName('input');
    for (var j = 0; j < g_config.GalaxyRanks.ranks.length; j++) {
        inputs[j * 2].value = g_config.GalaxyRanks.ranks[j];
        inputs[j * 2 + 1].value = g_config.GalaxyRanks.values[j];
        inputs[j * 2 + 1].style.backgroundColor = "#" + g_config.GalaxyRanks.values[j];
    }
    inputs[inputs.length - 3].value = g_config.GalaxyRanks.values[g_config.GalaxyRanks.values.length - 1];
    if (g_config.GalaxyRanks.inactives) inputs[inputs.length - 2].checked = true;

    // BetterEmpire
    inputs = options[6].getElementsByTagName('input');
    if (g_config.BetterEmpire.byMainSort) inputs[0].checked = true;
    if (g_config.BetterEmpire.moonsLast) inputs[1].checked = true;

    // More
    inputs = options[7].getElementsByTagName("input");
    if (g_config.More.moonsList) inputs[0].checked = true;
    if (g_config.More.convertDeut) inputs[2].checked = true;
    if (g_config.More.traductor) inputs[4].checked = true;
    if (g_config.More.resources) inputs[6].checked = true;
    if (g_config.More.redirectFleet) inputs[8].checked = true;
    if (g_config.More.arrows) inputs[10].checked = true;
    if (g_config.More.returns) inputs[12].checked = true;
    if (g_config.More.deutRow) inputs[14].checked = true;
    if (g_config.More.convertClick) inputs[16].checked = true;
    if (g_config.More.mcTransport) inputs[18].checked = true;

    f.$("#logLevel").val(g_config.Logging.level);
    inputs = options[8].getElementsByTagName("input");
    if (g_config.Logging.muteForAutoAttack) inputs[0].checked = true;


    // Top-level activate/deactivate
    for (var i = 0; i < g_nbScripts; i++) {
        script = /(.*)_activate/.exec(actives[i].id)[1];
        if (g_scriptInfo[script]) {
            actives[i].checked = true;
        } else {
            actives[i].parentNode.getElementsByTagName("input")[1].checked = "false";
        }
    }
}

/**
 * Returns an array of scripts to add to the config page.
 *
 * If you create a new script, you should start the build process here.
 *
 * @returns {Array} all the scripts to display on the config page
 */
function createScripts() {

    var spanText = "<br /><br /><span class=scriptDesc>";
    return [
        createRConvScript(),
        createEasyFarmScript(),
        packScript(createScriptActivity("AllinDeut", 3, L_.allinDeutDescrip1 + spanText + L_.allinDeutDescrip2 + "</span>"), null, "AllinDeut"),
        packScript(createScriptActivity("IFly", 4, "???" + spanText + "???</span>"), null, "IFly"),
        packScript(createScriptActivity("TChatty", 5, L_.tChattyDescrip1 + spanText + L_.tChattyDescrip2 + "</span>"), null, "TChatty"),
        packScript(
            createScriptActivity("InactiveStats", 9, L_.inactiveDescrip1 + spanText + L_.inactiveDescrip2 + "</span>"), null, "InactiveStats"
        ),
        createEasyTargetScript(),
        createAutoCompleteScript(),
        createMarkitScript(),
        createGalaxyRanksScript(),
        createBetterEmpireScript(),
        packScript(createScriptActivity("FleetPoints", 14,
            L_.FPDescrip1 + spanText + L_.FPDescrip2 + (usingOldVersion() ? "" : " (No longer working, sorry!)") + "</span>"),
            null, "FleetPoints"),
        createMoreScript(),
        createLogScript()
    ];
}

/**
 * RConverter Config - fields for 5 custom pictures to include in the report
 *     Intro
 *     'BOOM'
 *     Destroyed
 *     Result
 *     Retentability (original French, potentially recycling?)
 * @returns {Element}
 */
function createRConvScript() {
    var rConverter = createScriptActivity("RConverter", 1,
        L_.rConverterDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.rConverterDescrip2 + "</span>");
    var converterContainer = buildNode('div', ['class'], ['script_options'], '');
    var rConvOptions = createRConvOptions();
    for (var i = 0; i < rConvOptions.length; i++) {
        converterContainer.appendChild(rConvOptions[i]);
    }
    return packScript(rConverter, converterContainer, "RConverter");
}

/**
 * EasyFarm Config - Input for custom looting and ruins levels, and respective colors
 * @returns {Element}
 */
function createEasyFarmScript() {
    var easyFarm = createScriptActivity("EasyFarm", 2,
        L_.easyFarmDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.easyFarmDescrip2 + "</span>");
    var easyFarmContainer = buildNode('div', ['class'], ['script_options'], '');
    var easyFarmOptions = createEasyFarmOptions();
    for (var i = 0; i < easyFarmOptions.length; i++) {
        easyFarmContainer.appendChild(easyFarmOptions[i]);
    }
    return packScript(easyFarm, easyFarmContainer, "EasyFarm");
}

/**
 * EasyTarget Config - Allows for the import and export of galaxy data
 * @returns {Element}
 */
function createEasyTargetScript() {
    var easyTarget = createScriptActivity("EasyTarget", 11,
        L_.easyTargetDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.easyTargetDescrip2 + "</span>");
    var targetContainer = buildNode('div', ['class'], ['script_options'], '');
    var easyTargetTextArea = buildNode('textarea', ['rows', 'placeholder', 'id'], ['5', L_.EasyImportDescrip, 'EasyTarget_text'
    ], '');
    var importBtn = buildNode('input', ['type', 'value'], ['button', L_.import], '');
    var exportBtn = buildNode('input', ['type', 'value'], ['button', L_.export], '');
    targetContainer.appendChild(importBtn);
    targetContainer.appendChild(exportBtn);
    targetContainer.appendChild(easyTargetTextArea);
    targetContainer.appendChild(document.createElement('br'));

    // Hacky stuff for usingOldVersion(). Don't remove them, just hide them. This
    // allows no change in logic when filling/retrieving setting information
    createInputAndLabel("spyCut", "autoSpy Cutoff", targetContainer, true /*useHide*/);
    createInputAndLabel("spyDelay", "autoSpy Delay", targetContainer, true /*useHide*/);

    var useDoNotSpy = createCheckBoxItems(["Use doNotSpy"], 150)[0];
    if (!usingOldVersion()) {
        useDoNotSpy.style.display = "none";
    }
    targetContainer.style.overflow = "auto";
    targetContainer.appendChild(useDoNotSpy);

    return packScript(easyTarget, targetContainer, "EasyTarget");
}

/**
 * NoAutoComplete Config - various checkmarks to enable/disable autocomplete on different pages
 * @returns {Element}
 */
function createAutoCompleteScript() {
    var autoComplete = createScriptActivity("NoAutoComplete", 12,
        L_.noAutoDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.noAutoDescrip2 + "</span>");
    var autoOptions = createCheckBoxItems(
        [
            L_.noAutoGalaxy, L_.noAutoFleet1, L_.noAutoFleet2, L_.noAutoFleet3,
            L_.noAutoShip, L_.noAutoDef, L_.noAutoSims, L_.noAutoMerch, L_.noAutoScrap
        ],
        100);
    var widthConstraint = buildNode('div', ['style'], ['max-width:300px'], '');
    var autoContainer = buildNode('div', ['class', 'style'], ['script_options', 'overflow:auto'], '');
    for (var i = 0; i < autoOptions.length; i++) {
        widthConstraint.appendChild(autoOptions[i]);
    }
    autoContainer.appendChild(widthConstraint);
    return packScript(autoComplete, autoContainer, "NoAutoComplete");
}

/**
 * Markit Config - choose the colors to display when marking players in galaxy view
 * and reset the database
 * @returns {Element}
 */
function createMarkitScript() {
    var markit = createScriptActivity("Markit", 6, L_.markitDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.markitDescrip2 + "</span>");
    var markitContainer = buildNode('div', ['class'], ['script_options'], '');
    var markitOptions = createMarkitOptions();
    for (var i = 0; i < markitOptions.length; i++) {
        markitContainer.appendChild(markitOptions[i]);
    }
    return packScript(markit, markitContainer, "Markit");
}

/**
 * GalaxyRanks Config - Level cap and color choices
 * @returns {Element}
 */
function createGalaxyRanksScript() {
    var galaxyRanks = createScriptActivity("GalaxyRanks", 10,
        L_.galaxyRanksDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.galaxyRanksDescrip2 + "</span>");
    var rankContainer = buildNode('div', ['class'], ['script_options'], '');
    var rankOptions = createRankOptions(g_config.GalaxyRanks.ranks.length);
    for (var i = 0; i < rankOptions.length; i++) {
        rankContainer.appendChild(rankOptions[i]);
    }

    rankContainer.appendChild(document.createElement('br'));
    var rankInactive = createRadioScriptOption('ShowInactive', L_.galaxyRanksInactive);
    for (i = 0; i < rankInactive.length; i++) {
        rankContainer.appendChild(rankInactive[i]);
    }
    return packScript(galaxyRanks, rankContainer, "GalaxyRanks");
}

/**
 * BetterEmpire Config
 * @returns {Element}
 */
function createBetterEmpireScript() {
    var betterEmpire = createScriptActivity("BetterEmpire", 13,
        L_.betterEmpDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.betterEmpDescrip2 + "</span>");
    var empContainer = buildNode('div', ['class', 'style'], ['script_options', 'overflow:auto;'], '');
    var empOptions = createCheckBoxItems([L_.betterEmpMain, L_.betterEmpMoon], 150);
    empOptions[0].style.clear = 'both';
    empContainer.appendChild(empOptions[0]);
    empContainer.appendChild(empOptions[1]);
    return packScript(betterEmpire, empContainer, "BetterEmpire");
}

/**
 * More Config - additional smaller scripts
 * @returns {Element}
 */
function createMoreScript() {
    var more = createScriptActivity("More", 8, "Additional smaller scripts");

    // Currently contains moonList, convertDeut, traductor, resources, redirectFleet, arrows, returns, deutR, convertC, and mcTrans
    var moreItems = createMoreOptions();
    var moreDesc = createMoreDesc();

    var descripContainer = document.createElement("ul");

    var moreContainer = buildNode("div", ["class"], ["script_options"], "");
    for (var i = 0; i < moreItems.length; i++) {
        for (var j = 0; j < moreItems[i].length; j++)
            moreContainer.appendChild(moreItems[i][j]);
    }

    for (i = 0; i < moreDesc.length; i++) {
        descripContainer.appendChild(moreDesc[i]);
    }

    more.childNodes[0].childNodes[1].appendChild(descripContainer);
    return packScript(more, moreContainer, "More");
}

function createLogScript() {
    var logScript = createScriptActivity("Logging Level", 15, "Set the logging level in the developer console");
    var logLevels = document.createElement("select");
    logLevels.id = "logLevel";
    for (var level in LOG) {
        if (!LOG.hasOwnProperty(level)) {
            continue;
        }

        logLevels.appendChild(buildNode("option", ["value"], [LOG[level]], g_logStr[LOG[level]]));
    }

    var logContainer = buildNode("div", ["class"], ["script_options"], "");
    logContainer.appendChild(logLevels);
    var inp = f.$(logScript).find("input");
    inp[0].checked = "checked";
    inp[1].checked = "";
    inp.each(function() {
        f.$(this).attr("disabled", "disabled");
    });

    logContainer.appendChild(document.createElement("br"));
    var box = createCheckBoxItems(["Mute for autoAttack"], 155)[0];
    logContainer.append(box);
    if (!usingOldVersion()) {
        box.style.display = "none";
    }

    return packScript(logScript, logContainer, "Log");
}

/**
 * Attach the script options to the top level script
 *
 * @param header - The main option - "ScriptName      [x] Activate [] Deactivate"
 * @param options - The container that hold the script options
 * @param id - The id for the script
 * @returns {Element}
 */
function packScript(header, options, id) {
    var div = document.createElement("div");
    div.className = "script_container";
    div.id = id;
    div.appendChild(header);
    if (options !== null)
        div.appendChild(options);
    return div;
}

/**
 * Creates a top level script with the given name, script number, and tooltip text
 *
 * @param name - The name of the script
 * @param n - The script index
 * @param tooltipText - The tooltip text to display
 * @returns {Element}
 */
function createScriptActivity(name, n, tooltipText) {
    var scr = buildNode("div", ["class"], ["script"], "");
    var scrTitle = buildNode("div", ["class"], ["script_title"], "");
    var tooltip = buildNode("div", ["class", "id", "style"], ["tooltip", "tooltip_" + n, "cursor:help"], name);
    var toolText = buildNode("div", ["id", "class"], ["data_tooltip_" + n, "hidden"], tooltipText);
    var activate = buildNode("input", ["type", "name", "id"], ["radio", name + "_active", name + "_activate"], "");
    var activateLabel = buildNode("label", ["for"], [name + "_activate"], L_.activate);
    var deactivate = buildNode("input", ["type", "name", "id", "checked"], ["radio", name + "_active", name + "_deactivate", "checked"], "");
    var deactivateLabel = buildNode("label", ["for"], [name + "_deactivate"], L_.deactivate);
    var scrActive = buildNode("div", ["class"], ["script_active"], "");
    scrActive.appendChild(activate);
    scrActive.appendChild(activateLabel);
    scrActive.appendChild(deactivate);
    scrActive.appendChild(deactivateLabel);
    scrTitle.appendChild(tooltip);
    scrTitle.appendChild(toolText);
    scrTitle.appendChild(scrActive);
    scr.appendChild(scrTitle);
    return scr;
}

/**
 * Creates the given element.
 *
 * Ex: buildNode('div',
 * @param type - The type of node to create
 * @param attr - The attributes to set
 * @param attrValue - The values of the attributes
 * @param content - The innerHTML
 * @param event - The type of event
 * @param eventFunc - The event callback
 * @returns {Element}
 */
function buildNode(type, attr, attrValue, content, event, eventFunc) {
    var elem = document.createElement(type);
    for (var i = 0; i < attr.length; i++)
        elem.setAttribute(attr[i], attrValue[i]);
    if (event) elem.addEventListener(event, eventFunc, false);
    elem.innerHTML = content;
    return elem;
}

/**
 * Builds an array of elements that represent the options of a script
 * @param types - Array of element types
 * @param attributes - Array of attribute arrays
 * @param values - Array of attribute value arrays
 * @param contents - Array of element contents
 * @returns {Array} - The list of built nodes
 */
function createScriptOption(types, attributes, values, contents) {
    var result = [];
    for (var i = 0; i < types.length; i++) {
        result.push(buildNode(types[i], attributes[i], values[i], contents[i]));
    }
    return result;
}

/**
 * Create an input box with an attached label. Hiding if necessary
 * @param id
 * @param text
 * @param parent
 * @param useHide
 * @param optInputOptions
 * @param optLabelOptions
 */
function createInputAndLabel(id, text, parent, useHide, optInputOptions, optLabelOptions) {
    var inputOptions = [['type', 'id'], ['text', id]];
    var labelOptions = [['for'], [id]];
    for (var i = 0; optInputOptions && i < optInputOptions.length; i++) {
        inputOptions[0].push(optInputOptions[0][i]);
        inputOptions[1].push(optInputOptions[1][i]);
    }
    for (i = 0; optLabelOptions && i < optLabelOptions.length; i++) {
        labelOptions[0].push(optLabelOptions[0][i]);
        labelOptions[1].push(optLabelOptions[1][i]);
    }

    var item = createScriptOption(['input', 'label'],
        [inputOptions[0], labelOptions[0]], [inputOptions[1], labelOptions[1]], ['', " " + text]);
    for (i = 0; i < item.length; i++) {
        if (useHide && !usingOldVersion()) {
            item[i].style.display = "none";
        }

        parent.push ? parent.push(item[i]) : parent.appendChild(item[i]);
    }

    var lineBreak = document.createElement("br");
    if (!useHide || usingOldVersion()) {
        parent.push ? parent.push(lineBreak) : parent.appendChild(lineBreak);
    }
}

/**
 * Creates an array of elements that when put in a container
 * will display something of the form
 *
 *     niceName: [] Activate  [] Deactivate
 *
 * @param name - the underlying name of the radio button
 * @param niceName - the "nice" name to display
 * @returns {Array} - The array of radio button elements
 */
function createRadioScriptOption(name, niceName) {
    var arr = [];
    arr.push(f.document.createTextNode(niceName + " : "));
    arr.push(buildNode("input", ["type", "name", "id"], ["radio", name + "_active", name + "_activate"], ""));
    arr.push(buildNode("label", ["for"], [name + '_activate'], L_.activate));
    arr.push(buildNode("input", ["type", "name", "id", "checked"], ["radio", name + "_active", name + "_deactivate", "checked"], ""));
    arr.push(buildNode("label", ["for"], [name + "_deactivate"], L_.deactivate + "<br />"));
    return arr;
}

/**
 * Creates and returns a list of checkboxes with the given names
 * @param names - Array of names to use
 * @param width - The width of each item
 * @returns {Array}
 */
function createCheckBoxItems(names, width) {
    var result = [];
    for (var i = 0; i < names.length; i++) {
        var div = buildNode("div", ["style"], ["width : " + width + "px;float:left"], "");
        var condensed = names[i].replace(/ /, "");
        div.appendChild(buildNode("input", ["type", "name", "id"], ["checkbox", condensed + "_check", condensed + "_check"], ""));
        div.appendChild(buildNode("label", ["for"], [condensed + "_check"], names[i]));
        result.push(div);
    }
    return result;
}

/**
 * Create the options for RConverter
 * @returns {Array}
 */
function createRConvOptions() {
    var result = [];
    var text = ['Intro picture', "'BOOM' picture", "'Destroyed' picture", "'Result' picture", "Retentability picture"];
    for (var i = 0; i < 5; i++) {
        createInputAndLabel("RConvOpt_" + i, text[i], result, false /*useHide*/, [["style"],["width:30%"]]);
    }
    return result;
}

/**
 * Create the options for EasyFarm
 * @returns {Array}
 */
function createEasyFarmOptions() {
    var result = [];
    var text = ["Looting level", "Looting color", "Field ruins level", "Field ruins color"];
    for (var i = 0; i < 2; i++) {
        createInputAndLabel("easyFarm_" + i, text[i * 2], result, false /*useHide*/, [["style"],["width:30%"]]);
        createInputAndLabel("easyFarmColor_" + i, text[(i * 2) - 1], result, false /*useHide*/, [["style", "class"],["width:30%", "jscolor"]]);
    }

    createInputAndLabel("defMult", "Defense Multiplier", result, true /*useHide*/);
    createInputAndLabel("granularity", "Granularity", result, true /*useHide*/);
    createInputAndLabel("simGranularity", "Sim Granularity", result, true /*useHide*/);
    createInputAndLabel("simThreshold", "Sim Threshold", result, true /*useHide*/);
    createInputAndLabel("botLimit", "Bot Looting Level", result, true /*useHide*/);

    var simType = document.createElement("select");
    var rejectList = [0, 1, 6, 7, 8, 10, 15, 16, 18];
    simType.id = "simShip";
    simType.appendChild(buildNode("option", ["value"], [0], "None"));
    for (var ship in g_fleetNames) {
        if (!g_fleetNames.hasOwnProperty(ship)) {
            continue;
        }

        ship = parseInt(ship);
        if (rejectList.indexOf(ship) === -1) {
            simType.appendChild(buildNode("option", ["value"], [ship], g_fleetNames[ship]));
        }
    }

    if (!usingOldVersion()) {
        simType.style.display = "none";
    }

    result.push(simType);

    var botSns = createCheckBoxItems(["Use SN for bot fights"], 150)[0];
    botSns.style.float = "";

    if (!usingOldVersion()) {
        botSns.style.display = "none";
    }
    result.push(botSns);

    return result;
}

/**
 * Create the options for Markit
 * @returns {Array}
 */
function createMarkitOptions() {
    var result = [], i, j;
    var text = ["'Fridge' color", "'Bunker' color", "'To attack' color", "'To not attack' color"];
    for (i = 0; i < 4; i++) {
        createInputAndLabel("markit_" + i, text[i], result, false /*useHide*/, [["class", "style"], ["jscolor", "width:30%"]]);
    }
    result.push(document.createElement('br'));

    var option = createScriptOption(
        ['label', 'input'],
        [['for'], ['type', 'id', 'value', 'style']],
        [['markit_reset'], ['button', 'markit_reset', 'Reset', 'width:20%;min-width:40px;']],
        ['Markit coordinates : ', '']);
    for (j = 0; j < option.length; j++) {
        result.push(option[j]);
    }
    return result;
}

/**
 * Build the list of GalaxyRanks options
 * @param len - The number of color choices
 * @returns {Array}
 */
function createRankOptions(len) {
    var result = [], option, i, j;
    for (i = 0; i < len; i++) {
        // Top [   x   ] : [   #color   ]
        // Uses JSColor
        option = createScriptOption(["label", "input", "label", "input"], [
            ["for"],
            ["type", "id", "style"],
            [],
            ["type", "id", "class"]
        ], [
            ["GalaxyRanks_r" + i],
            ["text", "GalaxyRanks_r" + i, "width:10%"],
            [],
            ["text", "GalaxyRanks_c" + i, "jscolor"]
        ], ["Top ", "", " : ", ""]);
        for (j = 0; j < option.length; j++) {
            result.push(option[j]);
        }
        result.push(document.createElement("br"));
    }

    // All others : [   #color   ]
    option = createScriptOption(["label", "input"], [
        ["for"],
        ["type", "id", "class"]
    ], [
        ["GalaxyRanks_r" + len],
        ["text", "GalaxyRanks_c" + i, "jscolor"]
    ], [L_.galaxyRanksOthers + " : ", ""]);
    for (j = 0; j < option.length; j++) {
        result.push(option[j]);
    }
    return result;
}

/**
 * Returns the array of scripts that are under the "more" category
 * @returns {[]}
 */
function createMoreOptions() {
    return [
        createRadioScriptOption("More_moonsList", 'MoonsList'),
        createRadioScriptOption("More_convertDeuty", "ConvertDeut"),
        createRadioScriptOption("More_traductor", "Traductor"),
        createRadioScriptOption("More_resources", "Resources"),
        createRadioScriptOption("More_redirectFleet", "RedirectFleet"),
        createRadioScriptOption("More_arrows", "Arrows"),
        createRadioScriptOption("More_returns", "Returns"),
        createRadioScriptOption("More_deutRow", "DeutRow"),
        createRadioScriptOption("More_convertClick", "ConvertClick"),
        createRadioScriptOption("More_mcTransport", "mcTransport")
    ];
}

function createMoreDesc() {
    var names = ["DeutRow", "ConvertClick", "mcTransport", "MoonList", "ConvertDeut",
        "Traductor", "Resources", "RedirectFleet", "Arrows", "Returns"];
    var d1 = [L_.deutRowDescrip1, L_.convertCDescrip1, L_.mcTransDescrip1, L_.mMoonListDescrip1, L_.mConvertDeutDescrip1,
        L_.mTraductorDescrip1, L_.mResourcesDescrip1, L_.mRedirectFleetDescrip1, L_.mArrowsDescrip1, L_.mReturnsDescrip1];
    var d2 = [L_.deutRowDescrip2, L_.convertCDescrip2, L_.mcTransDescrip2, L_.mMoonListDescrip2, L_.mConvertDeutDescrip2,
        L_.mTraductorDescrip2, L_.mResourcesDescrip2, L_.mRedirectFleetDescrip2, L_.mArrowsDescrip2, L_.mReturnsDescrip2];
    var spanText = "<br />(<span class=scriptDesc>";

    var container = [];
    for (var i = 0; i < names.length; i++) {
        container.push(buildNode("li", [], [], names[i] + " : " + d1[i] + spanText + d2[i] + "</span>)"));
    }

    return container;
}


/**
 * Save currently stored settings
 * TODO: fix similarly to populateSettings - no need to switch, we know the order
 */
function saveSettings() {
    var saveButton = f.$("#save")[0];
    saveButton.value = "Saving";
    var inputs, script;
    var actives = getDomXpath("//div[@class='script_active']/input[1]", f.document, -1);
    var options = getDomXpath("//div[@class='script_options']", f.document, -1);

    for (var i = 0; i < g_nbScripts; i++) {
        script = /(.*)_activate/.exec(actives[i].id)[1];
        g_scriptInfo[script] = actives[i].checked;
        switch (script) {
            case "RConverter":
                inputs = options[0].getElementsByTagName("input");
                g_config.RConverter.header = inputs[0].value;
                g_config.RConverter.boom = inputs[1].value;
                g_config.RConverter.destroyed = inputs[2].value;
                g_config.RConverter.result = inputs[3].value;
                g_config.RConverter.renta = inputs[4].value;
                break;
            case "EasyFarm":
                inputs = options[1].getElementsByTagName("input");
                g_config.EasyFarm.minPillage = parseInt(inputs[0].value);
                g_config.EasyFarm.colorPill = inputs[1].value;
                g_config.EasyFarm.minCDR = parseInt(inputs[2].value);
                g_config.EasyFarm.colorCDR = inputs[3].value;
                g_config.EasyFarm.defMultiplier = usingOldVersion() ? parseInt(inputs[4].value) : 1;
                g_config.EasyFarm.granularity = parseInt(inputs[5].value);
                g_config.EasyFarm.simGranularity = parseInt(inputs[6].value);
                g_config.EasyFarm.simThreshold = parseInt(inputs[7].value);
                g_config.EasyFarm.botLootLevel = parseInt(inputs[8].value);
                g_config.EasyFarm.simShip = parseInt(f.$("#simShip").val());
                g_config.EasyFarm.botSn = inputs[9].checked;
                break;
            case "EasyTarget":
                inputs = options[2].getElementsByTagName("input");
                g_config.EasyTarget.spyCutoff = parseInt(inputs[2].value);
                g_config.EasyTarget.spyDelay = parseInt(inputs[3].value);
                g_config.EasyTarget.useDoNotSpy = inputs[4].checked;
                break;
            case "NoAutoComplete":
                inputs = options[3].getElementsByTagName('input');
                g_config.NoAutoComplete.galaxy = inputs[0].checked;
                g_config.NoAutoComplete.fleet = inputs[1].checked;
                g_config.NoAutoComplete.floten1 = inputs[2].checked;
                g_config.NoAutoComplete.floten2 = inputs[3].checked;
                g_config.NoAutoComplete.build_fleet = inputs[4].checked;
                g_config.NoAutoComplete.build_def = inputs[5].checked;
                g_config.NoAutoComplete.sims = inputs[6].checked;
                g_config.NoAutoComplete.marchand = inputs[7].checked;
                g_config.NoAutoComplete.scrapdealer = inputs[8].checked;
                break;
            case "Markit":
                inputs = options[4].getElementsByTagName("input");
                g_config.Markit.color.fridge = inputs[0].value;
                g_config.Markit.color.bunker = inputs[1].value;
                g_config.Markit.color.raidy = inputs[2].value;
                g_config.Markit.color.dont = inputs[3].value;
                break;
            case "GalaxyRanks":
                inputs = options[5].getElementsByTagName('input');
                var rs = [];
                var vals = [];
                for (var j = 0; j < (inputs.length - 3) / 2; j++) {
                    rs.push(inputs[j * 2].value);
                    vals.push(inputs[j * 2 + 1].value);
                }
                vals.push(inputs[inputs.length - 3].value);
                g_config.GalaxyRanks.ranks = rs;
                g_config.GalaxyRanks.values = vals;
                g_config.GalaxyRanks.inactives = inputs[inputs.length - 2].checked;
                break;
            case "BetterEmpire":
                inputs = options[6].getElementsByTagName('input');
                g_config.BetterEmpire.byMainSort = inputs[0].checked;
                g_config.BetterEmpire.moonsLast = inputs[1].checked;
                break;
            case "More":
                inputs = options[7].getElementsByTagName("input");
                g_config.More.moonsList = inputs[0].checked;
                g_config.More.convertDeut = inputs[2].checked;
                g_config.More.traductor = inputs[4].checked;
                g_config.More.resources = inputs[6].checked;
                g_config.More.redirectFleet = inputs[8].checked;
                g_config.More.arrows = inputs[10].checked;
                g_config.More.returns = inputs[12].checked;
                g_config.More.deutRow = inputs[14].checked;
                g_config.More.convertClick = inputs[16].checked;
                g_config.More.mcTransport = inputs[18].checked;
                break;
            case "Logging Level":
                inputs = options[8].getElementsByTagName("input");
                g_config.Logging.level = parseInt(f.$("#logLevel").val());
                g_config.Logging.muteForAutoAttack = inputs[0].checked;
                break;
            default:
                break;
        }
    }

    setValue("configScripts", JSON.stringify(g_config));
    setValue("infos_scripts", JSON.stringify(g_scriptInfo));
    if (f.setConfig) {
        log("Setting internal config", LOG.Info);
        f.setConfig(g_config, g_scriptInfo, g_uni);
    }
    saveButton.value = "Saved";
    setTimeout(function() {
        f.$("#save")[0].value = "Save";
    }, 2000);
}

/**
 * Delete all spaceswars related storage
 */
function deleteAllData() {
    // Keys stored per universe
    var uniKeys = [
        "attackData",
        "autoAttackIndex",
        "autoAttackMasterSwitch",
        "autoSim",
        "autoSimIndex",
        "autoSpyLength",
        "configScripts",
        "doNotSpy",
        "fleetPoints",
        "fpRedirect",
        "galaxyData",
        "inactiveList",
        "infos_scripts",
        "markitData",
        "merchantItem",
        "redirToSpy",
        "resourceRedirect",
        "resourceRedirectRef",
        "resourceRedirectType",
        "savedFleet",
        "scan",
        "simAutoAttack",
        "simShips",
        "simVictory",
        "spacesCount",
        "spacesGalaxy"
    ];

    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < uniKeys.length; j++) {
            try {
                GM_deleteValue(uniKeys[j] + i);
            } catch (ex) {
                log(uniKeys[j] + i + " not found", LOG.Warn);
            }
        }
    }

    try {
        GM_deleteValue("infos_version");
    } catch (ex) {
        log("infos_version not found", LOG.Warn);
    }
}

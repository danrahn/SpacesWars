/******************************
 * Begin Config/Settings page
 ******************************/

/* global GM_setValue*/
/* global GM_getValue*/
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

    //First time using DTR's scripts, reset the config file.
    if (g_config.GalaxyRanks === undefined || g_config.NoAutoComplete === undefined) {
        g_config = setConfigScripts(g_uni);
    }
    if (g_config.BetterEmpire === undefined) {
        g_config.BetterEmpire = {};
        g_config.BetterEmpire.byMainSort = 1;
        g_config.BetterEmpire.moonsLast = 1;
    }
    // Needed to get new tooltips to work
    getDomXpath("//body", f.document, 0).appendChild(buildNode("script", ["type"], ["text/javascript"],
        "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip({width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "
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

    var col1 = buildNode('div', ['class', 'id'], ['col', 'col1'], '');
    var col2 = buildNode('div', ['class', 'id'], ['col', 'col2'], '');
    var col1Cutoff = 8;
    main.appendChild(save);
    main.appendChild(col1);
    main.appendChild(col2);
    main.appendChild(deleteAll);

    // Current order: Col1: RConverter, EasyFarm, AllinDeut, iFly, TChatty, InactiveStats, EasyTarget, NoAutoComplete
    //                Col2: Markit, GalaxyRanks, BetterEmpire, More
    for (var i = 0; i < scripts.length; i++) {
        if (i < col1Cutoff)
            col1.append(scripts[i]);
        else
            col2.append(scripts[i]);
    }

    f.document.body.appendChild(main);

    f.$('#' + L_.betterEmpMain.replace(" ", "") + "_check").click(function() {
        if (!this.checked) {
            var betterEmpId = f.$("#" + L_.betterEmpMoon.replace(" ", "") + "_check");
            betterEmpId.attr("checked", false);
            betterEmpId.attr("disabled", true);
        } else {
            f.$("#" + L_.betterEmpMoon.replace(" ", "") + "_check").removeAttr("disabled");
        }
    });

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
        console.log("reset");
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
            if (conf) {
                GM_setValue('galaxy_data_' + g_uni, data);
                g_galaxyData = JSON.parse(data);
                g_galaxyDataChanged = true;
            }
            easyTargetText.value = '';
        }
    });
    inputs[1].addEventListener('click', function() {
        var easyTargetText = f.$('#EasyTarget_text')[0];
        easyTargetText.value = GM_getValue('galaxy_data_' + g_uni);
        easyTargetText.focus();
        easyTargetText.select();
    });

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
            GM_setValue('markit_data_' + g_uni, JSON.stringify({}));
            GM_setValue("config_scripts_uni_" + g_uni, JSON.stringify(g_config));
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

    // Top-level activate/deactivate
    for (var i = 0; i < g_nbScripts; i++) {
        script = /(.*)_activate/.exec(actives[i].id)[1];
        (g_scriptInfo[script]) ? actives[i].checked = true : actives[i].parentNode.getElementsByTagName("input")[1].checked = "false";
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
        packScript(createScriptActivity("InactiveStats", 9, L_.inactiveDescrip1 + spanText + L_.inactiveDescrip2 + "</span>"), null, "InactiveStats"),
        createEasyTargetScript(),
        createAutoCompleteScript(),
        createMarkitScript(),
        createGalaxyRanksScript(),
        createBetterEmpireScript(),
        createMoreScript()
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
    var rConverter = createScriptActivity("RConverter", 1, L_.rConverterDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.rConverterDescrip2 + "</span>");
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
    var easyFarm = createScriptActivity("EasyFarm", 2, L_.easyFarmDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.easyFarmDescrip2 + "</span>");
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
    var easyTarget = createScriptActivity("EasyTarget", 11, L_.easyTargetDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.easyTargetDescrip2 + "</span>");
    var targetContainer = buildNode('div', ['class'], ['script_options'], '');
    var easyTargetTextArea = buildNode('textarea', ['rows', 'placeholder', 'id'], ['5', L_.EasyImportDescrip, 'EasyTarget_text'
    ], '');
    var imprt = buildNode('input', ['type', 'value'], ['button', L_['import']], '');
    var exprt = buildNode('input', ['type', 'value'], ['button', L_['export']], '');
    targetContainer.appendChild(imprt);
    targetContainer.appendChild(exprt);
    targetContainer.appendChild(easyTargetTextArea);
    return packScript(easyTarget, targetContainer, "EasyTarget");
}

/**
 * NoAutoComplete Config - various checkmarks to enable/disable autocomplete on different pages
 * @returns {Element}
 */
function createAutoCompleteScript() {
    var autoComplete = createScriptActivity("NoAutoComplete", 12, L_.noAutoDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.noAutoDescrip2 + "</span>");
    var autoOptions = createCheckBoxItems([L_.noAutoGalaxy, L_.noAutoFleet1, L_.noAutoFleet2, L_.noAutoFleet3, L_.noAutoShip, L_.noAutoDef, L_.noAutoSims, L_.noAutoMerch, L_.noAutoScrap], 100);
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
    var galaxyRanks = createScriptActivity("GalaxyRanks", 10, L_.galaxyRanksDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.galaxyRanksDescrip2 + "</span>");
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
    var betterEmpire = createScriptActivity("BetterEmpire", 13, L_.betterEmpDescrip1 + "<br /><br /><span class=scriptDesc>" + L_.betterEmpDescrip2 + "</span>");
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

/**
 * Attach the script options to the top leve script
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
 * @param tooltiptext - The tooltip text to display
 * @returns {Element}
 */
function createScriptActivity(name, n, tooltiptext) {
    var scr = buildNode("div", ["class"], ["script"], "");
    var scrTitle = buildNode("div", ["class"], ["script_title"], "");
    var tooltip = buildNode("div", ["class", "id", "style"], ["tooltip", "tooltip_" + n, "cursor:help"], name);
    var toolText = buildNode("div", ["id", "class"], ["data_tooltip_" + n, "hidden"], tooltiptext);
    var activate = buildNode("input", ["type", "name", "id"], ["radio", name + "_active", name + "_activate"], "");
    var activateLabel = buildNode("label", ["for"], [name + "_activate"], L_['activate']);
    var deactivate = buildNode("input", ["type", "name", "id", "checked"], ["radio", name + "_active", name + "_deactivate", "checked"], "");
    var deactivateLabel = buildNode("label", ["for"], [name + "_deactivate"], L_["deactivate"]);
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
    arr.push(buildNode("label", ["for"], [name + '_activate'], L_["activate"]));
    arr.push(buildNode("input", ["type", "name", "id", "checked"], ["radio", name + "_active", name + "_deactivate", "checked"], ""));
    arr.push(buildNode("label", ["for"], [name + "_deactivate"], L_["deactivate"] + "<br />"));
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
        var option = createScriptOption(['input', 'label'], [['type', 'style', 'id'], ['for']], [['text', 'width:30%', 'RConvOpt_' + i], ['RConvOpt_' + i]], ['', text[i]]);

        for (var j = 0; j < option.length; j++) {
            result.push(option[j]);
        }
        result.push(document.createElement('br'));
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
        var option = createScriptOption(['input', 'label', 'br', 'input', 'label'],
            [
                ['type', 'style', 'id'],
                ['for'],
                [],
                ['style', 'id', 'class'],
                ['for']
            ],
            [
                ['text', 'width:30%', 'easyFarm_' + i],
                ['easyFarm_' + i],
                [],
                ['width:30%', 'easyFarmColor_' + i, 'jscolor'],
                ['easyFarmColor_' + i]
            ],
            ['', text[i * 2], '', '', text[(i*2)+1]]
        );
        for (var j = 0; j < option.length; j++) {
            result.push(option[j]);
        }
        result.push(document.createElement('br'));
    }
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
        var option = createScriptOption(['input', 'label'], [['id', 'class', 'style'], ['for']], [['markit_' + i, 'jscolor', 'width:30%'], ['markit_' + i]], ['', text[i]]);
        for (j = 0; j < option.length; j++) {
            result.push(option[j]);
        }
        result.push(document.createElement('br'));
    }
    result.push(document.createElement('br'));
    option = createScriptOption(['label', 'input'], [['for'], ['type', 'id', 'value', 'style']], [['markit_reset'], ['button', 'markit_reset', 'Reset', 'width:20%;min-width:40px;']], ['Markit coordinates : ', '']);
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
    var names = ["DeutRow", "ConvertClick", "mcTransport", "MoonList", "ConvertDeut", "Traductor", "Resources", "RedirectFleet", "Arrows", "Returns"];
    var d1 = [L_.deutRowDescrip1, L_.convertCDescrip1, L_.mcTransDescrip1, L_.mMoonListDescrip1, L_.mConvertDeutDescrip1, L_.mTraductorDescrip1, L_.mResourcesDescrip1, L_.mRedirectFleetDescrip1, L_.mArrowsDescrip1, L_.mReturnsDescrip1];
    var d2 = [L_.deutRowDescrip2, L_.convertCDescrip2, L_.mcTransDescrip2, L_.mMoonListDescrip2, L_.mConvertDeutDescrip2, L_.mTraductorDescrip2, L_.mResourcesDescrip2, L_.mRedirectFleetDescrip2, L_.mArrowsDescrip2, L_.mReturnsDescrip2];
    var spanText = "<br />(<span class=scriptDesc>";

    var container = [];
    for (var i = 0; i < names.length; i++) {
        container.push(buildNode("li", [], [], names[i] + " : " + d1[i] + spanText + d2[i] + "</span>)"));
    }

    return container;
}


// When "Save" is clicked...
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
            default:
                break;
        }
    }
    GM_setValue("config_scripts_uni_" + g_uni, JSON.stringify(g_config));
    GM_setValue("infos_scripts", JSON.stringify(g_scriptInfo));
    saveButton.value = "Saved";
    setTimeout(function() {
        f.$("#save")[0].value = "Save";
    }, 2000);
}

/**
 * Delete all spaceswars related storage
 */
function deleteAllData() {
    var uniKeys = ["config_scripts_uni_", "galaxy_data_", "markit_data_", "InactiveList_"];
    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < uniKeys.length; j++) {
            try {
                GM_deleteValue(uniKeys[j] + i);
                console.log("deleted " + uniKeys[j] + i);
            } catch (ex) {
                console.log(uniKeys[j] + i + " not found");
            }
        }
    }

    // TODO: everything but infos_scripts and infos_version should probably be uni specific
    var singleKeys =
        [
            "infos_scripts",
            "infos_version",
            "InactiveList",
            "ResourceRedirect",
            "ResourceRedirectType",
            "ResourceRedirectRef",
            "savedFleet"
        ];
    for (i = 0; i < singleKeys.length; i++) {
        try {
            GM_deleteValue(singleKeys);
            console.log("deleted " + singleKeys[i])
        } catch (ex) {
            console.log(singleKeys[i] + " not found");
        }
    }
}
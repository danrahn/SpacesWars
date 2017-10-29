/**
 * Created by Daniel on 5/6/2017.
 */
/* global GM_setValue*/
/* global GM_getValue*/
/* global GM_deleteValue*/
// ==UserScript==
// @name        SpacesWars_Revamped
// @namespace   none
//
// @include     http://spaceswars.fr*
// @include     http://www.spaceswars.fr*
// @include     http://spaceswars.com*
// @include     http://www.spaceswars.com*
// @include     http://niark.spaceswars.fr/userscripts/NiArK_SpacesWars/config.php*
//
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
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
//
// bugs :
// 1- var name 'location' makes Opera bugging
// 2- add innerHTML after addEventListener don't work (Clic&Go, weird, maybe because of my code)


// Ignore all this obfuscated code below. On FF I needed it for certain color/document manipulation functions. Since this script is local it should have that much of a performane hit.

// Better to have all jQuery loaded locally instead of @requiring it.
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
    a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
    null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});

/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko
 *
 * See usage examples at http://jscolor.com/examples/
 */window.jscolor||(window.jscolor=function(){var e={register:function(){e.attachDOMReadyEvent(e.init),e.attachEvent(document,"mousedown",e.onDocumentMouseDown),e.attachEvent(document,"touchstart",e.onDocumentTouchStart),e.attachEvent(window,"resize",e.onWindowResize)},init:function(){e.jscolor.lookupClass&&e.jscolor.installByClassName(e.jscolor.lookupClass)},tryInstallOnElements:function(t,n){var r=new RegExp("(^|\\s)("+n+")(\\s*(\\{[^}]*\\})|\\s|$)","i");for(var i=0;i<t.length;i+=1){if(t[i].type!==undefined&&t[i].type.toLowerCase()=="color"&&e.isColorAttrSupported)continue;var s;if(!t[i].jscolor&&t[i].className&&(s=t[i].className.match(r))){var o=t[i],u=null,a=e.getDataAttr(o,"jscolor");a!==null?u=a:s[4]&&(u=s[4]);var f={};if(u)try{f=(new Function("return ("+u+")"))()}catch(l){e.warn("Error parsing jscolor options: "+l+":\n"+u)}o.jscolor=new e.jscolor(o,f)}}},isColorAttrSupported:function(){var e=document.createElement("input");if(e.setAttribute){e.setAttribute("type","color");if(e.type.toLowerCase()=="color")return!0}return!1}(),isCanvasSupported:function(){var e=document.createElement("canvas");return!!e.getContext&&!!e.getContext("2d")}(),fetchElement:function(e){return typeof e=="string"?document.getElementById(e):e},isElementType:function(e,t){return e.nodeName.toLowerCase()===t.toLowerCase()},getDataAttr:function(e,t){var n="data-"+t,r=e.getAttribute(n);return r!==null?r:null},attachEvent:function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)},detachEvent:function(e,t,n){e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent&&e.detachEvent("on"+t,n)},_attachedGroupEvents:{},attachGroupEvent:function(t,n,r,i){e._attachedGroupEvents.hasOwnProperty(t)||(e._attachedGroupEvents[t]=[]),e._attachedGroupEvents[t].push([n,r,i]),e.attachEvent(n,r,i)},detachGroupEvents:function(t){if(e._attachedGroupEvents.hasOwnProperty(t)){for(var n=0;n<e._attachedGroupEvents[t].length;n+=1){var r=e._attachedGroupEvents[t][n];e.detachEvent(r[0],r[1],r[2])}delete e._attachedGroupEvents[t]}},attachDOMReadyEvent:function(e){var t=!1,n=function(){t||(t=!0,e())};if(document.readyState==="complete"){setTimeout(n,1);return}if(document.addEventListener)document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",function(){document.readyState==="complete"&&(document.detachEvent("onreadystatechange",arguments.callee),n())}),window.attachEvent("onload",n);if(document.documentElement.doScroll&&window==window.top){var r=function(){if(!document.body)return;try{document.documentElement.doScroll("left"),n()}catch(e){setTimeout(r,1)}};r()}}},warn:function(e){window.console&&window.console.warn&&window.console.warn(e)},preventDefault:function(e){e.preventDefault&&e.preventDefault(),e.returnValue=!1},captureTarget:function(t){t.setCapture&&(e._capturedTarget=t,e._capturedTarget.setCapture())},releaseTarget:function(){e._capturedTarget&&(e._capturedTarget.releaseCapture(),e._capturedTarget=null)},fireEvent:function(e,t){if(!e)return;if(document.createEvent){var n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}else if(document.createEventObject){var n=document.createEventObject();e.fireEvent("on"+t,n)}else e["on"+t]&&e["on"+t]()},classNameToList:function(e){return e.replace(/^\s+|\s+$/g,"").split(/\s+/)},hasClass:function(e,t){return t?-1!=(" "+e.className.replace(/\s+/g," ")+" ").indexOf(" "+t+" "):!1},setClass:function(t,n){var r=e.classNameToList(n);for(var i=0;i<r.length;i+=1)e.hasClass(t,r[i])||(t.className+=(t.className?" ":"")+r[i])},unsetClass:function(t,n){var r=e.classNameToList(n);for(var i=0;i<r.length;i+=1){var s=new RegExp("^\\s*"+r[i]+"\\s*|"+"\\s*"+r[i]+"\\s*$|"+"\\s+"+r[i]+"(\\s+)","g");t.className=t.className.replace(s,"$1")}},getStyle:function(e){return window.getComputedStyle?window.getComputedStyle(e):e.currentStyle},setStyle:function(){var e=document.createElement("div"),t=function(t){for(var n=0;n<t.length;n+=1)if(t[n]in e.style)return t[n]},n={borderRadius:t(["borderRadius","MozBorderRadius","webkitBorderRadius"]),boxShadow:t(["boxShadow","MozBoxShadow","webkitBoxShadow"])};return function(e,t,r){switch(t.toLowerCase()){case"opacity":var i=Math.round(parseFloat(r)*100);e.style.opacity=r,e.style.filter="alpha(opacity="+i+")";break;default:e.style[n[t]]=r}}}(),setBorderRadius:function(t,n){e.setStyle(t,"borderRadius",n||"0")},setBoxShadow:function(t,n){e.setStyle(t,"boxShadow",n||"none")},getElementPos:function(t,n){var r=0,i=0,s=t.getBoundingClientRect();r=s.left,i=s.top;if(!n){var o=e.getViewPos();r+=o[0],i+=o[1]}return[r,i]},getElementSize:function(e){return[e.offsetWidth,e.offsetHeight]},getAbsPointerPos:function(e){e||(e=window.event);var t=0,n=0;return typeof e.changedTouches!="undefined"&&e.changedTouches.length?(t=e.changedTouches[0].clientX,n=e.changedTouches[0].clientY):typeof e.clientX=="number"&&(t=e.clientX,n=e.clientY),{x:t,y:n}},getRelPointerPos:function(e){e||(e=window.event);var t=e.target||e.srcElement,n=t.getBoundingClientRect(),r=0,i=0,s=0,o=0;return typeof e.changedTouches!="undefined"&&e.changedTouches.length?(s=e.changedTouches[0].clientX,o=e.changedTouches[0].clientY):typeof e.clientX=="number"&&(s=e.clientX,o=e.clientY),r=s-n.left,i=o-n.top,{x:r,y:i}},getViewPos:function(){var e=document.documentElement;return[(window.pageXOffset||e.scrollLeft)-(e.clientLeft||0),(window.pageYOffset||e.scrollTop)-(e.clientTop||0)]},getViewSize:function(){var e=document.documentElement;return[window.innerWidth||e.clientWidth,window.innerHeight||e.clientHeight]},redrawPosition:function(){if(e.picker&&e.picker.owner){var t=e.picker.owner,n,r;t.fixed?(n=e.getElementPos(t.targetElement,!0),r=[0,0]):(n=e.getElementPos(t.targetElement),r=e.getViewPos());var i=e.getElementSize(t.targetElement),s=e.getViewSize(),o=e.getPickerOuterDims(t),u,a,f;switch(t.position.toLowerCase()){case"left":u=1,a=0,f=-1;break;case"right":u=1,a=0,f=1;break;case"top":u=0,a=1,f=-1;break;default:u=0,a=1,f=1}var l=(i[a]+o[a])/2;if(!t.smartPosition)var c=[n[u],n[a]+i[a]-l+l*f];else var c=[-r[u]+n[u]+o[u]>s[u]?-r[u]+n[u]+i[u]/2>s[u]/2&&n[u]+i[u]-o[u]>=0?n[u]+i[u]-o[u]:n[u]:n[u],-r[a]+n[a]+i[a]+o[a]-l+l*f>s[a]?-r[a]+n[a]+i[a]/2>s[a]/2&&n[a]+i[a]-l-l*f>=0?n[a]+i[a]-l-l*f:n[a]+i[a]-l+l*f:n[a]+i[a]-l+l*f>=0?n[a]+i[a]-l+l*f:n[a]+i[a]-l-l*f];var h=c[u],p=c[a],d=t.fixed?"fixed":"absolute",v=(c[0]+o[0]>n[0]||c[0]<n[0]+i[0])&&c[1]+o[1]<n[1]+i[1];e._drawPosition(t,h,p,d,v)}},_drawPosition:function(t,n,r,i,s){var o=s?0:t.shadowBlur;e.picker.wrap.style.position=i,e.picker.wrap.style.left=n+"px",e.picker.wrap.style.top=r+"px",e.setBoxShadow(e.picker.boxS,t.shadow?new e.BoxShadow(0,o,t.shadowBlur,0,t.shadowColor):null)},getPickerDims:function(t){var n=!!e.getSliderComponent(t),r=[2*t.insetWidth+2*t.padding+t.width+(n?2*t.insetWidth+e.getPadToSliderPadding(t)+t.sliderSize:0),2*t.insetWidth+2*t.padding+t.height+(t.closable?2*t.insetWidth+t.padding+t.buttonHeight:0)];return r},getPickerOuterDims:function(t){var n=e.getPickerDims(t);return[n[0]+2*t.borderWidth,n[1]+2*t.borderWidth]},getPadToSliderPadding:function(e){return Math.max(e.padding,1.5*(2*e.pointerBorderWidth+e.pointerThickness))},getPadYComponent:function(e){switch(e.mode.charAt(1).toLowerCase()){case"v":return"v"}return"s"},getSliderComponent:function(e){if(e.mode.length>2)switch(e.mode.charAt(2).toLowerCase()){case"s":return"s";case"v":return"v"}return null},onDocumentMouseDown:function(t){t||(t=window.event);var n=t.target||t.srcElement;n._jscLinkedInstance?n._jscLinkedInstance.showOnClick&&n._jscLinkedInstance.show():n._jscControlName?e.onControlPointerStart(t,n,n._jscControlName,"mouse"):e.picker&&e.picker.owner&&e.picker.owner.hide()},onDocumentTouchStart:function(t){t||(t=window.event);var n=t.target||t.srcElement;n._jscLinkedInstance?n._jscLinkedInstance.showOnClick&&n._jscLinkedInstance.show():n._jscControlName?e.onControlPointerStart(t,n,n._jscControlName,"touch"):e.picker&&e.picker.owner&&e.picker.owner.hide()},onWindowResize:function(t){e.redrawPosition()},onParentScroll:function(t){e.picker&&e.picker.owner&&e.picker.owner.hide()},_pointerMoveEvent:{mouse:"mousemove",touch:"touchmove"},_pointerEndEvent:{mouse:"mouseup",touch:"touchend"},_pointerOrigin:null,_capturedTarget:null,onControlPointerStart:function(t,n,r,i){var s=n._jscInstance;e.preventDefault(t),e.captureTarget(n);var o=function(s,o){e.attachGroupEvent("drag",s,e._pointerMoveEvent[i],e.onDocumentPointerMove(t,n,r,i,o)),e.attachGroupEvent("drag",s,e._pointerEndEvent[i],e.onDocumentPointerEnd(t,n,r,i))};o(document,[0,0]);if(window.parent&&window.frameElement){var u=window.frameElement.getBoundingClientRect(),a=[-u.left,-u.top];o(window.parent.window.document,a)}var f=e.getAbsPointerPos(t),l=e.getRelPointerPos(t);e._pointerOrigin={x:f.x-l.x,y:f.y-l.y};switch(r){case"pad":switch(e.getSliderComponent(s)){case"s":s.hsv[1]===0&&s.fromHSV(null,100,null);break;case"v":s.hsv[2]===0&&s.fromHSV(null,null,100)}e.setPad(s,t,0,0);break;case"sld":e.setSld(s,t,0)}e.dispatchFineChange(s)},onDocumentPointerMove:function(t,n,r,i,s){return function(t){var i=n._jscInstance;switch(r){case"pad":t||(t=window.event),e.setPad(i,t,s[0],s[1]),e.dispatchFineChange(i);break;case"sld":t||(t=window.event),e.setSld(i,t,s[1]),e.dispatchFineChange(i)}}},onDocumentPointerEnd:function(t,n,r,i){return function(t){var r=n._jscInstance;e.detachGroupEvents("drag"),e.releaseTarget(),e.dispatchChange(r)}},dispatchChange:function(t){t.valueElement&&e.isElementType(t.valueElement,"input")&&e.fireEvent(t.valueElement,"change")},dispatchFineChange:function(e){if(e.onFineChange){var t;typeof e.onFineChange=="string"?t=new Function(e.onFineChange):t=e.onFineChange,t.call(e)}},setPad:function(t,n,r,i){var s=e.getAbsPointerPos(n),o=r+s.x-e._pointerOrigin.x-t.padding-t.insetWidth,u=i+s.y-e._pointerOrigin.y-t.padding-t.insetWidth,a=o*(360/(t.width-1)),f=100-u*(100/(t.height-1));switch(e.getPadYComponent(t)){case"s":t.fromHSV(a,f,null,e.leaveSld);break;case"v":t.fromHSV(a,null,f,e.leaveSld)}},setSld:function(t,n,r){var i=e.getAbsPointerPos(n),s=r+i.y-e._pointerOrigin.y-t.padding-t.insetWidth,o=100-s*(100/(t.height-1));switch(e.getSliderComponent(t)){case"s":t.fromHSV(null,o,null,e.leavePad);break;case"v":t.fromHSV(null,null,o,e.leavePad)}},_vmlNS:"jsc_vml_",_vmlCSS:"jsc_vml_css_",_vmlReady:!1,initVML:function(){if(!e._vmlReady){var t=document;t.namespaces[e._vmlNS]||t.namespaces.add(e._vmlNS,"urn:schemas-microsoft-com:vml");if(!t.styleSheets[e._vmlCSS]){var n=["shape","shapetype","group","background","path","formulas","handles","fill","stroke","shadow","textbox","textpath","imagedata","line","polyline","curve","rect","roundrect","oval","arc","image"],r=t.createStyleSheet();r.owningElement.id=e._vmlCSS;for(var i=0;i<n.length;i+=1)r.addRule(e._vmlNS+"\\:"+n[i],"behavior:url(#default#VML);")}e._vmlReady=!0}},createPalette:function(){var t={elm:null,draw:null};if(e.isCanvasSupported){var n=document.createElement("canvas"),r=n.getContext("2d"),i=function(e,t,i){n.width=e,n.height=t,r.clearRect(0,0,n.width,n.height);var s=r.createLinearGradient(0,0,n.width,0);s.addColorStop(0,"#F00"),s.addColorStop(1/6,"#FF0"),s.addColorStop(2/6,"#0F0"),s.addColorStop(.5,"#0FF"),s.addColorStop(4/6,"#00F"),s.addColorStop(5/6,"#F0F"),s.addColorStop(1,"#F00"),r.fillStyle=s,r.fillRect(0,0,n.width,n.height);var o=r.createLinearGradient(0,0,0,n.height);switch(i.toLowerCase()){case"s":o.addColorStop(0,"rgba(255,255,255,0)"),o.addColorStop(1,"rgba(255,255,255,1)");break;case"v":o.addColorStop(0,"rgba(0,0,0,0)"),o.addColorStop(1,"rgba(0,0,0,1)")}r.fillStyle=o,r.fillRect(0,0,n.width,n.height)};t.elm=n,t.draw=i}else{e.initVML();var s=document.createElement("div");s.style.position="relative",s.style.overflow="hidden";var o=document.createElement(e._vmlNS+":fill");o.type="gradient",o.method="linear",o.angle="90",o.colors="16.67% #F0F, 33.33% #00F, 50% #0FF, 66.67% #0F0, 83.33% #FF0";var u=document.createElement(e._vmlNS+":rect");u.style.position="absolute",u.style.left="-1px",u.style.top="-1px",u.stroked=!1,u.appendChild(o),s.appendChild(u);var a=document.createElement(e._vmlNS+":fill");a.type="gradient",a.method="linear",a.angle="180",a.opacity="0";var f=document.createElement(e._vmlNS+":rect");f.style.position="absolute",f.style.left="-1px",f.style.top="-1px",f.stroked=!1,f.appendChild(a),s.appendChild(f);var i=function(e,t,n){s.style.width=e+"px",s.style.height=t+"px",u.style.width=f.style.width=e+1+"px",u.style.height=f.style.height=t+1+"px",o.color="#F00",o.color2="#F00";switch(n.toLowerCase()){case"s":a.color=a.color2="#FFF";break;case"v":a.color=a.color2="#000"}};t.elm=s,t.draw=i}return t},createSliderGradient:function(){var t={elm:null,draw:null};if(e.isCanvasSupported){var n=document.createElement("canvas"),r=n.getContext("2d"),i=function(e,t,i,s){n.width=e,n.height=t,r.clearRect(0,0,n.width,n.height);var o=r.createLinearGradient(0,0,0,n.height);o.addColorStop(0,i),o.addColorStop(1,s),r.fillStyle=o,r.fillRect(0,0,n.width,n.height)};t.elm=n,t.draw=i}else{e.initVML();var s=document.createElement("div");s.style.position="relative",s.style.overflow="hidden";var o=document.createElement(e._vmlNS+":fill");o.type="gradient",o.method="linear",o.angle="180";var u=document.createElement(e._vmlNS+":rect");u.style.position="absolute",u.style.left="-1px",u.style.top="-1px",u.stroked=!1,u.appendChild(o),s.appendChild(u);var i=function(e,t,n,r){s.style.width=e+"px",s.style.height=t+"px",u.style.width=e+1+"px",u.style.height=t+1+"px",o.color=n,o.color2=r};t.elm=s,t.draw=i}return t},leaveValue:1,leaveStyle:2,leavePad:4,leaveSld:8,BoxShadow:function(){var e=function(e,t,n,r,i,s){this.hShadow=e,this.vShadow=t,this.blur=n,this.spread=r,this.color=i,this.inset=!!s};return e.prototype.toString=function(){var e=[Math.round(this.hShadow)+"px",Math.round(this.vShadow)+"px",Math.round(this.blur)+"px",Math.round(this.spread)+"px",this.color];return this.inset&&e.push("inset"),e.join(" ")},e}(),jscolor:function(t,n){function i(e,t,n){e/=255,t/=255,n/=255;var r=Math.min(Math.min(e,t),n),i=Math.max(Math.max(e,t),n),s=i-r;if(s===0)return[null,0,100*i];var o=e===r?3+(n-t)/s:t===r?5+(e-n)/s:1+(t-e)/s;return[60*(o===6?0:o),100*(s/i),100*i]}function s(e,t,n){var r=255*(n/100);if(e===null)return[r,r,r];e/=60,t/=100;var i=Math.floor(e),s=i%2?e-i:1-(e-i),o=r*(1-t),u=r*(1-t*s);switch(i){case 6:case 0:return[r,u,o];case 1:return[u,r,o];case 2:return[o,r,u];case 3:return[o,u,r];case 4:return[u,o,r];case 5:return[r,o,u]}}function o(){e.unsetClass(d.targetElement,d.activeClass),e.picker.wrap.parentNode.removeChild(e.picker.wrap),delete e.picker.owner}function u(){function l(){var e=d.insetColor.split(/\s+/),n=e.length<2?e[0]:e[1]+" "+e[0]+" "+e[0]+" "+e[1];t.btn.style.borderColor=n}d._processParentElementsInDOM(),e.picker||(e.picker={owner:null,wrap:document.createElement("div"),box:document.createElement("div"),boxS:document.createElement("div"),boxB:document.createElement("div"),pad:document.createElement("div"),padB:document.createElement("div"),padM:document.createElement("div"),padPal:e.createPalette(),cross:document.createElement("div"),crossBY:document.createElement("div"),crossBX:document.createElement("div"),crossLY:document.createElement("div"),crossLX:document.createElement("div"),sld:document.createElement("div"),sldB:document.createElement("div"),sldM:document.createElement("div"),sldGrad:e.createSliderGradient(),sldPtrS:document.createElement("div"),sldPtrIB:document.createElement("div"),sldPtrMB:document.createElement("div"),sldPtrOB:document.createElement("div"),btn:document.createElement("div"),btnT:document.createElement("span")},e.picker.pad.appendChild(e.picker.padPal.elm),e.picker.padB.appendChild(e.picker.pad),e.picker.cross.appendChild(e.picker.crossBY),e.picker.cross.appendChild(e.picker.crossBX),e.picker.cross.appendChild(e.picker.crossLY),e.picker.cross.appendChild(e.picker.crossLX),e.picker.padB.appendChild(e.picker.cross),e.picker.box.appendChild(e.picker.padB),e.picker.box.appendChild(e.picker.padM),e.picker.sld.appendChild(e.picker.sldGrad.elm),e.picker.sldB.appendChild(e.picker.sld),e.picker.sldB.appendChild(e.picker.sldPtrOB),e.picker.sldPtrOB.appendChild(e.picker.sldPtrMB),e.picker.sldPtrMB.appendChild(e.picker.sldPtrIB),e.picker.sldPtrIB.appendChild(e.picker.sldPtrS),e.picker.box.appendChild(e.picker.sldB),e.picker.box.appendChild(e.picker.sldM),e.picker.btn.appendChild(e.picker.btnT),e.picker.box.appendChild(e.picker.btn),e.picker.boxB.appendChild(e.picker.box),e.picker.wrap.appendChild(e.picker.boxS),e.picker.wrap.appendChild(e.picker.boxB));var t=e.picker,n=!!e.getSliderComponent(d),r=e.getPickerDims(d),i=2*d.pointerBorderWidth+d.pointerThickness+2*d.crossSize,s=e.getPadToSliderPadding(d),o=Math.min(d.borderRadius,Math.round(d.padding*Math.PI)),u="crosshair";t.wrap.style.clear="both",t.wrap.style.width=r[0]+2*d.borderWidth+"px",t.wrap.style.height=r[1]+2*d.borderWidth+"px",t.wrap.style.zIndex=d.zIndex,t.box.style.width=r[0]+"px",t.box.style.height=r[1]+"px",t.boxS.style.position="absolute",t.boxS.style.left="0",t.boxS.style.top="0",t.boxS.style.width="100%",t.boxS.style.height="100%",e.setBorderRadius(t.boxS,o+"px"),t.boxB.style.position="relative",t.boxB.style.border=d.borderWidth+"px solid",t.boxB.style.borderColor=d.borderColor,t.boxB.style.background=d.backgroundColor,e.setBorderRadius(t.boxB,o+"px"),t.padM.style.background=t.sldM.style.background="#FFF",e.setStyle(t.padM,"opacity","0"),e.setStyle(t.sldM,"opacity","0"),t.pad.style.position="relative",t.pad.style.width=d.width+"px",t.pad.style.height=d.height+"px",t.padPal.draw(d.width,d.height,e.getPadYComponent(d)),t.padB.style.position="absolute",t.padB.style.left=d.padding+"px",t.padB.style.top=d.padding+"px",t.padB.style.border=d.insetWidth+"px solid",t.padB.style.borderColor=d.insetColor,t.padM._jscInstance=d,t.padM._jscControlName="pad",t.padM.style.position="absolute",t.padM.style.left="0",t.padM.style.top="0",t.padM.style.width=d.padding+2*d.insetWidth+d.width+s/2+"px",t.padM.style.height=r[1]+"px",t.padM.style.cursor=u,t.cross.style.position="absolute",t.cross.style.left=t.cross.style.top="0",t.cross.style.width=t.cross.style.height=i+"px",t.crossBY.style.position=t.crossBX.style.position="absolute",t.crossBY.style.background=t.crossBX.style.background=d.pointerBorderColor,t.crossBY.style.width=t.crossBX.style.height=2*d.pointerBorderWidth+d.pointerThickness+"px",t.crossBY.style.height=t.crossBX.style.width=i+"px",t.crossBY.style.left=t.crossBX.style.top=Math.floor(i/2)-Math.floor(d.pointerThickness/2)-d.pointerBorderWidth+"px",t.crossBY.style.top=t.crossBX.style.left="0",t.crossLY.style.position=t.crossLX.style.position="absolute",t.crossLY.style.background=t.crossLX.style.background=d.pointerColor,t.crossLY.style.height=t.crossLX.style.width=i-2*d.pointerBorderWidth+"px",t.crossLY.style.width=t.crossLX.style.height=d.pointerThickness+"px",t.crossLY.style.left=t.crossLX.style.top=Math.floor(i/2)-Math.floor(d.pointerThickness/2)+"px",t.crossLY.style.top=t.crossLX.style.left=d.pointerBorderWidth+"px",t.sld.style.overflow="hidden",t.sld.style.width=d.sliderSize+"px",t.sld.style.height=d.height+"px",t.sldGrad.draw(d.sliderSize,d.height,"#000","#000"),t.sldB.style.display=n?"block":"none",t.sldB.style.position="absolute",t.sldB.style.right=d.padding+"px",t.sldB.style.top=d.padding+"px",t.sldB.style.border=d.insetWidth+"px solid",t.sldB.style.borderColor=d.insetColor,t.sldM._jscInstance=d,t.sldM._jscControlName="sld",t.sldM.style.display=n?"block":"none",t.sldM.style.position="absolute",t.sldM.style.right="0",t.sldM.style.top="0",t.sldM.style.width=d.sliderSize+s/2+d.padding+2*d.insetWidth+"px",t.sldM.style.height=r[1]+"px",t.sldM.style.cursor="default",t.sldPtrIB.style.border=t.sldPtrOB.style.border=d.pointerBorderWidth+"px solid "+d.pointerBorderColor,t.sldPtrOB.style.position="absolute",t.sldPtrOB.style.left=-(2*d.pointerBorderWidth+d.pointerThickness)+"px",t.sldPtrOB.style.top="0",t.sldPtrMB.style.border=d.pointerThickness+"px solid "+d.pointerColor,t.sldPtrS.style.width=d.sliderSize+"px",t.sldPtrS.style.height=m+"px",t.btn.style.display=d.closable?"block":"none",t.btn.style.position="absolute",t.btn.style.left=d.padding+"px",t.btn.style.bottom=d.padding+"px",t.btn.style.padding="0 15px",t.btn.style.height=d.buttonHeight+"px",t.btn.style.border=d.insetWidth+"px solid",l(),t.btn.style.color=d.buttonColor,t.btn.style.font="12px sans-serif",t.btn.style.textAlign="center";try{t.btn.style.cursor="pointer"}catch(c){t.btn.style.cursor="hand"}t.btn.onmousedown=function(){d.hide()},t.btnT.style.lineHeight=d.buttonHeight+"px",t.btnT.innerHTML="",t.btnT.appendChild(document.createTextNode(d.closeText)),a(),f(),e.picker.owner&&e.picker.owner!==d&&e.unsetClass(e.picker.owner.targetElement,d.activeClass),e.picker.owner=d,e.isElementType(v,"body")?e.redrawPosition():e._drawPosition(d,0,0,"relative",!1),t.wrap.parentNode!=v&&v.appendChild(t.wrap),e.setClass(d.targetElement,d.activeClass)}function a(){switch(e.getPadYComponent(d)){case"s":var t=1;break;case"v":var t=2}var n=Math.round(d.hsv[0]/360*(d.width-1)),r=Math.round((1-d.hsv[t]/100)*(d.height-1)),i=2*d.pointerBorderWidth+d.pointerThickness+2*d.crossSize,o=-Math.floor(i/2);e.picker.cross.style.left=n+o+"px",e.picker.cross.style.top=r+o+"px";switch(e.getSliderComponent(d)){case"s":var u=s(d.hsv[0],100,d.hsv[2]),a=s(d.hsv[0],0,d.hsv[2]),f="rgb("+Math.round(u[0])+","+Math.round(u[1])+","+Math.round(u[2])+")",l="rgb("+Math.round(a[0])+","+Math.round(a[1])+","+Math.round(a[2])+")";e.picker.sldGrad.draw(d.sliderSize,d.height,f,l);break;case"v":var c=s(d.hsv[0],d.hsv[1],100),f="rgb("+Math.round(c[0])+","+Math.round(c[1])+","+Math.round(c[2])+")",l="#000";e.picker.sldGrad.draw(d.sliderSize,d.height,f,l)}}function f(){var t=e.getSliderComponent(d);if(t){switch(t){case"s":var n=1;break;case"v":var n=2}var r=Math.round((1-d.hsv[n]/100)*(d.height-1));e.picker.sldPtrOB.style.top=r-(2*d.pointerBorderWidth+d.pointerThickness)-Math.floor(m/2)+"px"}}function l(){return e.picker&&e.picker.owner===d}function c(){d.importColor()}this.value=null,this.valueElement=t,this.styleElement=t,this.required=!0,this.refine=!0,this.hash=!1,this.uppercase=!0,this.onFineChange=null,this.activeClass="jscolor-active",this.minS=0,this.maxS=100,this.minV=0,this.maxV=100,this.hsv=[0,0,100],this.rgb=[255,255,255],this.width=181,this.height=101,this.showOnClick=!0,this.mode="HSV",this.position="bottom",this.smartPosition=!0,this.sliderSize=16,this.crossSize=8,this.closable=!1,this.closeText="Close",this.buttonColor="#000000",this.buttonHeight=18,this.padding=12,this.backgroundColor="#FFFFFF",this.borderWidth=1,this.borderColor="#BBBBBB",this.borderRadius=8,this.insetWidth=1,this.insetColor="#BBBBBB",this.shadow=!0,this.shadowBlur=15,this.shadowColor="rgba(0,0,0,0.2)",this.pointerColor="#4C4C4C",this.pointerBorderColor="#FFFFFF",this.pointerBorderWidth=1,this.pointerThickness=2,this.zIndex=1e3,this.container=null;for(var r in n)n.hasOwnProperty(r)&&(this[r]=n[r]);this.hide=function(){l()&&o()},this.show=function(){u()},this.redraw=function(){l()&&u()},this.importColor=function(){this.valueElement?e.isElementType(this.valueElement,"input")?this.refine?!this.required&&/^\s*$/.test(this.valueElement.value)?(this.valueElement.value="",this.styleElement&&(this.styleElement.style.backgroundImage=this.styleElement._jscOrigStyle.backgroundImage,this.styleElement.style.backgroundColor=this.styleElement._jscOrigStyle.backgroundColor,this.styleElement.style.color=this.styleElement._jscOrigStyle.color),this.exportColor(e.leaveValue|e.leaveStyle)):this.fromString(this.valueElement.value)||this.exportColor():this.fromString(this.valueElement.value,e.leaveValue)||(this.styleElement&&(this.styleElement.style.backgroundImage=this.styleElement._jscOrigStyle.backgroundImage,this.styleElement.style.backgroundColor=this.styleElement._jscOrigStyle.backgroundColor,this.styleElement.style.color=this.styleElement._jscOrigStyle.color),this.exportColor(e.leaveValue|e.leaveStyle)):this.exportColor():this.exportColor()},this.exportColor=function(t){if(!(t&e.leaveValue)&&this.valueElement){var n=this.toString();this.uppercase&&(n=n.toUpperCase()),this.hash&&(n="#"+n),e.isElementType(this.valueElement,"input")?this.valueElement.value=n:this.valueElement.innerHTML=n}t&e.leaveStyle||this.styleElement&&(this.styleElement.style.backgroundImage="none",this.styleElement.style.backgroundColor="#"+this.toString(),this.styleElement.style.color=this.isLight()?"#000":"#FFF"),!(t&e.leavePad)&&l()&&a(),!(t&e.leaveSld)&&l()&&f()},this.fromHSV=function(e,t,n,r){if(e!==null){if(isNaN(e))return!1;e=Math.max(0,Math.min(360,e))}if(t!==null){if(isNaN(t))return!1;t=Math.max(0,Math.min(100,this.maxS,t),this.minS)}if(n!==null){if(isNaN(n))return!1;n=Math.max(0,Math.min(100,this.maxV,n),this.minV)}this.rgb=s(e===null?this.hsv[0]:this.hsv[0]=e,t===null?this.hsv[1]:this.hsv[1]=t,n===null?this.hsv[2]:this.hsv[2]=n),this.exportColor(r)},this.fromRGB=function(e,t,n,r){if(e!==null){if(isNaN(e))return!1;e=Math.max(0,Math.min(255,e))}if(t!==null){if(isNaN(t))return!1;t=Math.max(0,Math.min(255,t))}if(n!==null){if(isNaN(n))return!1;n=Math.max(0,Math.min(255,n))}var o=i(e===null?this.rgb[0]:e,t===null?this.rgb[1]:t,n===null?this.rgb[2]:n);o[0]!==null&&(this.hsv[0]=Math.max(0,Math.min(360,o[0]))),o[2]!==0&&(this.hsv[1]=o[1]===null?null:Math.max(0,this.minS,Math.min(100,this.maxS,o[1]))),this.hsv[2]=o[2]===null?null:Math.max(0,this.minV,Math.min(100,this.maxV,o[2]));var u=s(this.hsv[0],this.hsv[1],this.hsv[2]);this.rgb[0]=u[0],this.rgb[1]=u[1],this.rgb[2]=u[2],this.exportColor(r)},this.fromString=function(e,t){var n;if(n=e.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i))return n[1].length===6?this.fromRGB(parseInt(n[1].substr(0,2),16),parseInt(n[1].substr(2,2),16),parseInt(n[1].substr(4,2),16),t):this.fromRGB(parseInt(n[1].charAt(0)+n[1].charAt(0),16),parseInt(n[1].charAt(1)+n[1].charAt(1),16),parseInt(n[1].charAt(2)+n[1].charAt(2),16),t),!0;if(n=e.match(/^\W*rgba?\(([^)]*)\)\W*$/i)){var r=n[1].split(","),i=/^\s*(\d*)(\.\d+)?\s*$/,s,o,u;if(r.length>=3&&(s=r[0].match(i))&&(o=r[1].match(i))&&(u=r[2].match(i))){var a=parseFloat((s[1]||"0")+(s[2]||"")),f=parseFloat((o[1]||"0")+(o[2]||"")),l=parseFloat((u[1]||"0")+(u[2]||""));return this.fromRGB(a,f,l,t),!0}}return!1},this.toString=function(){return(256|Math.round(this.rgb[0])).toString(16).substr(1)+(256|Math.round(this.rgb[1])).toString(16).substr(1)+(256|Math.round(this.rgb[2])).toString(16).substr(1)},this.toHEXString=function(){return"#"+this.toString().toUpperCase()},this.toRGBString=function(){return"rgb("+Math.round(this.rgb[0])+","+Math.round(this.rgb[1])+","+Math.round(this.rgb[2])+")"},this.isLight=function(){return.213*this.rgb[0]+.715*this.rgb[1]+.072*this.rgb[2]>127.5},this._processParentElementsInDOM=function(){if(this._linkedElementsProcessed)return;this._linkedElementsProcessed=!0;var t=this.targetElement;do{var n=e.getStyle(t);n&&n.position.toLowerCase()==="fixed"&&(this.fixed=!0),t!==this.targetElement&&(t._jscEventsAttached||(e.attachEvent(t,"scroll",e.onParentScroll),t._jscEventsAttached=!0))}while((t=t.parentNode)&&!e.isElementType(t,"body"))};if(typeof t=="string"){var h=t,p=document.getElementById(h);p?this.targetElement=p:e.warn("Could not find target element with ID '"+h+"'")}else t?this.targetElement=t:e.warn("Invalid target element: '"+t+"'");if(this.targetElement._jscLinkedInstance){e.warn("Cannot link jscolor twice to the same element. Skipping.");return}this.targetElement._jscLinkedInstance=this,this.valueElement=e.fetchElement(this.valueElement),this.styleElement=e.fetchElement(this.styleElement);var d=this,v=this.container?e.fetchElement(this.container):document.getElementsByTagName("body")[0],m=3;if(e.isElementType(this.targetElement,"button"))if(this.targetElement.onclick){var g=this.targetElement.onclick;this.targetElement.onclick=function(e){return g.call(this,e),!1}}else this.targetElement.onclick=function(){return!1};if(this.valueElement&&e.isElementType(this.valueElement,"input")){var y=function(){d.fromString(d.valueElement.value,e.leaveValue),e.dispatchFineChange(d)};e.attachEvent(this.valueElement,"keyup",y),e.attachEvent(this.valueElement,"input",y),e.attachEvent(this.valueElement,"blur",c),this.valueElement.setAttribute("autocomplete","off")}this.styleElement&&(this.styleElement._jscOrigStyle={backgroundImage:this.styleElement.style.backgroundImage,backgroundColor:this.styleElement.style.backgroundColor,color:this.styleElement.style.color}),this.value?this.fromString(this.value)||this.exportColor():this.importColor()}};return e.jscolor.lookupClass="jscolor",e.jscolor.installByClassName=function(t){var n=document.getElementsByTagName("input"),r=document.getElementsByTagName("button");e.tryInstallOnElements(n,t),e.tryInstallOnElements(r,t)},e.register(),e.jscolor}());

/**
 * Delete all spaceswars related storage
 */
function deleteAllData() {
    var uniKeys = ["fleet_points_uni_", "config_scripts_uni", "galaxy_data_", "markit_data_"];
    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < uniKeys.length; j++) {
            try {
                GM_deleteValue(uniKeys[i] + i);
            } catch (ex) {
                console.log(uniKeys[i] + i + " not found");
            }
        }
    }

    // TODO: everything but infos_scripts and infos_version should probably be uni specific
    var singleKeys = ["infos_scripts", "infos_version", "fp_redirect", "InactiveList", "ResourceRedirect", "ResourceRedirectType"];
    for (var i = 0; i < singleKeys.length; i++) {
        try {
            GM_deleteValue(singleKeys);
        } catch (ex) {
            console.log(singleKeys + " not found");
        }
    }
}

$( document ).ready(function() {
    //GM_setValue("scan", "false");
    //GM_setValue("scan", "true");
    if (window.location.href.indexOf("galaxy") !== -1) {
        galScan();
    }
});
function galScan() {
    var scan = false;
    if (!GM_getValue("scan") || GM_getValue("scan") === "true") {
        scan = true;
        GM_setValue("scan", "true");
    }
    scan = false;
    if (scan) {
        var gSel = $("#galaxy");
        var sSel = $("[name=system]");
        var g = parseInt(gSel.val());
        var s = parseInt(sSel.val());
        var wait = ((Math.random() / 2)) * 1000;
        if (s < 499) {
            $sSel.val(s + 1);
            setTimeout(function() {
                $("[type=submit]")[0].click()
            }, wait);
        } else if (g !== 7 && s !== 499) {
            gSel.val(g + 1);
            sSel.val(1);
            setTimeout(function() {
                $("[type=submit]")[0].click()
            }, wait);
        } else {
            GM_setValue("scan", "false");
        }
    }
}

// A bit of a misnomer, as it's function changed. Determines
// whether to selectively ignore planets when spying because old
// reports show they have nothing of use
var spyForMe = !!parseInt(GM_getValue("SpyForMe"));

// Ah, the bread and butter. Should we go through every spy report
// and attack? True bottiness
var autoAttack = !!parseInt(GM_getValue("AutoAttackMasterSwitch"));
var advancedAutoAttack = autoAttack; // No longer used?

var nbScripts = 13;
var thisVersion = "4.1";
var user = "user";
var gmicon = "http://i.imgur.com/OrSr0G6.png"; // Old icon was broken, all hail the new icon

// Language dictionary. FR and EN
var L_ = [];
var lang = "en";

var infos_version, infos_scripts;
try {
    infos_version = JSON.parse(GM_getValue("infos_version"));
} catch (ex) {
    infos_version = undefined;
}
try {
    infos_scripts = JSON.parse(GM_getValue("infos_scripts"));
} catch (ex) {
    infos_scripts = undefined;
}

var info, page, config, uni, i, j;

function can_load_in_page(script) {
    // type "1" : get all the matching pages
    // type "2" : get all the not matching pages
    var can_load = null;
    if (can_load === null) {
        can_load = {};
        can_load.RConverter = {};
        can_load.RConverter.type = 1;
        can_load.RConverter.rw = true;
        can_load.EasyFarm = {};
        can_load.EasyFarm.type = 1;
        can_load.EasyFarm.messages = true;
        can_load.AllinDeut = {};
        can_load.AllinDeut.type = 1;
        can_load.AllinDeut.buildings = true;
        can_load.AllinDeut.research = true;
        can_load.Carto = {};
        can_load.Carto.type = 1;
        can_load.Carto.galaxy = true;
        can_load.iFly = {};
        can_load.iFly.type = 1;
        can_load.iFly.overview = true;
        can_load.TChatty = {};
        can_load.TChatty.type = 1;
        can_load.TChatty.chat = true;
        can_load.Markit = {};
        can_load.Markit.type = 1;
        can_load.Markit.galaxy = true;
        can_load.ClicNGo = {};
        can_load.ClicNGo.type = 1;
        can_load.ClicNGo.index = true;
        can_load.More_moonsList = {};
        can_load.More_moonsList.type = 2;
        can_load.More_moonsList.chat = false;
        can_load.More_moonsList.forum = false;
        can_load.More_moonsList.index = false;
        can_load.More_moonsList.niark = false;
        can_load.More_moonsList.rw = false;
        can_load.More_moonsList.frames = false;
        can_load.More_moonsList.leftmenu = false;
        can_load.More_convertDeut = {};
        can_load.More_convertDeut.type = 1;
        can_load.More_convertDeut.marchand = true;
        can_load.More_traductor = {};
        can_load.More_traductor.type = 1;
        can_load.More_traductor.chat = true;
        can_load.More_traductor.forum = true;
        can_load.More_traductor.message = true;
        can_load.More_resources = {};
        can_load.More_resources.type = 1;
        can_load.More_resources.resources = true;
        can_load.More_redirectFleet = {};
        can_load.More_redirectFleet.type = 1;
        can_load.More_redirectFleet.floten3 = true;
        can_load.More_arrows = {};
        can_load.More_arrows.type = 2;
        can_load.More_arrows.chat = false;
        can_load.More_arrows.forum = false;
        can_load.More_arrows.index = false;
        can_load.More_arrows.niark = false;
        can_load.More_arrows.rw = false;
        can_load.More_arrows.frames = false;
        can_load.More_arrows.leftmenu = false;
        can_load.More_returns = {};
        can_load.More_returns.type = 1;
        can_load.More_returns.overview = true;
        can_load.EasyTarget = {};
        can_load.EasyTarget.type = 1;
        can_load.EasyTarget.galaxy = true;
        can_load.InactiveStats = {};
        can_load.InactiveStats.type = 1;
        can_load.InactiveStats.stat = true;
        can_load.AllianceLink = {};
        can_load.AllianceLink.type = 1;
        can_load.AllianceLink.alliance = true;
        can_load.More_deutRow = {};
        can_load.More_deutRow.type = 2;
        can_load.More_deutRow.niark = false;
        can_load.More_deutRow.forum = false;
        can_load.More_deutRow.index = false;
        can_load.More_deutRow.chat = false;
        can_load.More_deutRow.rw = false;
        can_load.More_deutRow.frames = false;
        can_load.More_deutRow.leftmenu = false;
        can_load.empireTotal = {};
        can_load.empireTotal.type = 1;
        can_load.empireTotal.imperium = true;
    }
    if (can_load[script].type === 1) {
        return can_load[script][page] !== undefined;
    }

    if (can_load[script].type === 2) {
        return can_load[script][page] === undefined;
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
function get_slashed_nb(nStr) {
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
 * @returns {{}} The dictionary
 */
function set_dictionary() {
    var tab = [];
    switch (lang) {
        case "fr":
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
            break;
        case "en":
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
            tab.collector = "Collector";
            tab.blast = "Blast";
            tab.extractor = "Extractor";
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
            break;
        default:
            alert("Error with language !");
            return 0;
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
    var m = {};

    // Buildings
    m["Metal Mine"] = 1;
    m["Crystal Mine"] = 2;
    m["Deuterium Synthesizer"] = 3;
    m["Solar Plant"] = 4;
    m["Fusion Reactor"] = 12;
    m["Robotics Factory"] = 14;
    m["Nanite Factory"] = 15;
    m["Shipyard"] = 21;
    m["Metal Storage"] = 22;
    m["Crystal Storage"] = 23;
    m["Deuterium Storage"] = 24;
    m["Research Lab"] = 31;
    m["Terraformer"] = 33;
    m["Alliance Depot"] = 34;
    m["Advanced Lab"] = 35;
    m["Training Center"] = 36;
    m["Missile Silo"] = 44;
    m["Lunar Base"] = 41;
    m["Sensor Phalanx"] = 42;
    m["Jump Gate"] = 43;

    // Research
    m["Metal production"] = 101;
    m["Crystal production"] = 102;
    m["Deuterium production"] = 103;
    m["Espionage Technology"] = 106;
    m["Computer Technology"] = 108;
    m["Weapons Technology"] = 109;
    m["Shielding Technology"] = 110;
    m["Armor Technology"] = 111;
    m["Energy Technology"] = 113;
    m["Hyperspace Technology"] = 114;
    m["Combustion Drive"] = 115;
    m["Impulse Drive"] = 117;
    m["Hyperspace Drive"] = 118;
    m["Laser Technology"] = 120;
    m["Ion Technology"] = 121;
    m["Plasma Technology"] = 122;
    m["Intergalactic Research Network"] = 123;
    m["Expedition Technology"] = 124;
    m["Teaching technology"] = 125;
    m["Consistency"] = 196;
    m["Extractor Hangar"] = 197;

    // Spaceships
    m["Small cargo"] = 202;
    m["Large cargo"] = 203;
    m["Light Fighter"] = 204;
    m["Heavy Fighter"] = 205;
    m["Cruiser"] = 206;
    m["Battleship"] = 207;
    m["Colony Ship"] = 208;
    m["Recycler"] = 209;
    m["Espionage Probe"] = 210;
    m["Bomber"] = 211;
    m["Solar Satellite"] = 212;
    m["Destroyer"] = 213;
    m["Deathstar"] = 214;
    m["Battlecruiser"] = 215;
    m["Supernova"] = 216;
    m["Massive cargo"] = 217;
    m["Heavy recycler"] = 218;
    m["Blast"] = 219;
    m["Extractor"] = 235;

    // Def
    m["Rocket Launcher"] = 401;
    m["Light Laser"] = 402;
    m["Heavy Laser"] = 403;
    m["Gauss Cannon"] = 404;
    m["Ion Cannon"] = 405;
    m["Plasma Turret"] = 406;
    m["Small Shield Dome"] = 407;
    m["Large Shield Dome"] = 408;
    m["Ultimate Guard"] = 409;
    m["Anti-Ballistic Missiles"] = 502;
    m["Interplanetary Missiles"] = 503;

    return m;
}

/**
 * Sets the default userscript info. Not written by
 * me and not really used anymore.
 *
 * @returns {*}
 */
function set_infos_version() {
    var date = new Date();
    var tab = {};
    tab.version = "4.1";
    tab.language = "fr";
    tab.news = "";
    tab.nbUnis = 18;
    tab.toUp = false;
    tab.lastCheck = date.getTime();
    GM_setValue("infos_version", JSON.stringify(tab));
    return tab[0];
}

/**
 * Sets the default script states (all set to active)
 *
 * @returns the list of top-level script options
 */
function set_infos_scripts() {
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
function set_config_scripts(uni) {
    if (uni > infos_version.nbUnis) {
        infos_version.nbUnis = uni;
        GM_setValue("infos_version", JSON.stringify(infos_version));
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
    } else // => index / niark / forum
    {
        list.ClicNGo = {};
        list.ClicNGo.universes = [];
        list.ClicNGo.usernames = [];
        list.ClicNGo.passwords = [];

        list.More = {};
        list.More.traductor = 1;
    }
    GM_setValue("config_scripts_uni_" + uni, JSON.stringify(list));
    return list;
}

/**
 * Determine where we are in the game, and what universe we're in.
 *
 * @returns {{}} the page information
 */
function get_infos_from_page() {
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
function get_dom_xpath(xpath, inDom, row) {
    var tab = [];
    var alltags = document.evaluate(xpath, inDom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < alltags.snapshotLength; i++) {
        tab[i] = alltags.snapshotItem(i);
    }
    if (row === -1) return tab;
    if (row === -42) return tab[tab.length - 1];
    else return tab[row];
}

/**
 * Parses a number represented by a string with comma separators
 * @param sw_stringnumber - the String to parse
 * @returns {Number}
 */
function sw_to_number_rc(sw_stringnumber) { //Spécial pour les RC ( virgules à la place des points) {
    return parseInt(sw_stringnumber.replace(/,/g, ''));
}

/**
 * Returns a number represented by the given array
 *
 * ["100", "042"] -> 100042
 *
 * @param tab - an array of string digits
 * @returns {Number} The number resulting in parsing the concatenation of @tab
 */
function get_nb_from_stringtab(tab) {
    return parseInt(tab.join(''));
}

/**
 * Creates the given element.
 *
 * Ex: build_node('div',
 * @param type - The type of node to create
 * @param attr - The attributes to set
 * @param attrValue - The values of the attributes
 * @param content - The innerHTML
 * @param event - The type of event
 * @param eventFunc - The event callback
 * @returns {Element}
 */
function build_node(type, attr, attrValue, content, event, eventFunc) {
    var elem = document.createElement(type);
    for (var i = 0; i < attr.length; i++)
        elem.setAttribute(attr[i], attrValue[i]);
    if (event) elem.addEventListener(event, eventFunc, false);
    elem.innerHTML = content;
    return elem;
}

/**
 * Creates a top level script with the given name, script number, and tooltip text
 *
 * @param name - The name of the script
 * @param n - The script index
 * @param tooltiptext - The tooltip text to display
 * @returns {Element}
 */
function create_script_activity(name, n, tooltiptext) {
    var scr = build_node("div", ["class"], ["script"], "");
    var scr_title = build_node("div", ["class"], ["script_title"], "");
    var tooltip = build_node("div", ["class", "id", "style"], ["tooltip", "tooltip_" + n, "cursor:help"], name);
    var tool_text = build_node("div", ["id", "class"], ["data_tooltip_" + n, "hidden"], tooltiptext);
    var activate = build_node("input", ["type", "name", "id"], ["radio", name + "_active", name + "_activate"], "");
    var activate_label = build_node("label", ["for"], [name + "_activate"], L_['activate']);
    var deactivate = build_node("input", ["type", "name", "id", "checked"], ["radio", name + "_active", name + "_deactivate", "checked"], "");
    var deactivate_label = build_node("label", ["for"], [name + "_deactivate"], L_["deactivate"]);
    var scr_active = build_node("div", ["class"], ["script_active"], "");
    scr_active.appendChild(activate);
    scr_active.appendChild(activate_label);
    scr_active.appendChild(deactivate);
    scr_active.appendChild(deactivate_label);
    scr_title.appendChild(tooltip);
    scr_title.appendChild(tool_text);
    scr_title.appendChild(scr_active);
    scr.appendChild(scr_title);
    return scr;
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
function create_script_option_radio(name, niceName) {
    var arr = [];
    arr.push(document.createTextNode(niceName + " : "));
    arr.push(build_node("input", ["type", "name", "id"], ["radio", name + "_active", name + "_activate"], ""));
    arr.push(build_node("label", ["for"], [name + '_activate'], L_["activate"]));
    arr.push(build_node("input", ["type", "name", "id", "checked"], ["radio", name + "_active", name + "_deactivate", "checked"], ""));
    arr.push(build_node("label", ["for"], [name + "_deactivate"], L_["deactivate"] + "<br />"));
    return arr;
}

/**
 * Builds an array of elements that represent the options of a script
 * @param types - Array of element types
 * @param attributes - Array of attribute arrays
 * @param values - Array of attribute value arrays
 * @param contents - Array of element contents
 * @returns {Array} - The list of built nodes
 */
function create_script_option(types, attributes, values, contents) {
    var result = [];
    for (var i = 0; i < types.length; i++) {
        result.push(build_node(types[i], attributes[i], values[i], contents[i]));
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
        option = create_script_option(["label", "input", "label", "input"], [
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
    option = create_script_option(["label", "input"], [
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
 * Creates and returns a list of checkboxes with the given names
 * @param names - Array of names to use
 * @param width - The width of each item
 * @returns {Array}
 */
function createCheckBoxItems(names, width) {
    var result = [];
    for (var i = 0; i < names.length; i++) {
        var div = build_node("div", ["style"], ["width : " + width + "px;float:left"], "");
        var condensed = names[i].replace(/ /, "");
        div.appendChild(build_node("input", ["type", "name", "id"], ["checkbox", condensed + "_check", condensed + "_check"], ""));
        div.appendChild(build_node("label", ["for"], [condensed + "_check"], names[i]));
        result.push(div);
    }
    return result;
}

// Ugh, global stuff
// Is this actually necessary anymore?
// checking...
if (infos_version === undefined || infos_version === null || infos_version.version !== thisVersion) {
    // ... 1st install ?
    page = get_infos_from_page().loc;
    if (infos_version === undefined || infos_version === null) {
        infos_version = set_infos_version();
        infos_scripts = set_infos_scripts();
        // get a message if can't have the gm icon without F5 refresh (frames)
        if (infos_version.version === thisVersion && page !== "niark" && page !== "index" && page !== "forum" && page !== "leftmenu" && page !== "frames")
            alert("Script installé. Appuyez sur F5.\n\nScript installed. Press F5.");
    }

    // ... just as updating ?
    if (infos_version.version !== thisVersion) {
        console.log("Version mismatch");
        if (infos_version.version === undefined) // 3.8 version
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
            infos_version = set_infos_version();
            infos_scripts = set_infos_scripts();

            // get a message if can't have the gm icon without F5 refresh (frames)
            if (page !== "niark" && page !== "index" && page !== "forum" && page !== "leftmenu" && page !== "frames")
                alert("Script installé. Appuyez sur F5.\n\nScript installed. Press F5.");
        }
        if (infos_version.version === "4.0") {
            GM_deleteValue("config_scripts_uni_0");
            set_config_scripts(0);
            for (i = 1; i <= 17; i++) {
                try {
                    config = JSON.parse(GM_getValue("config_scripts_uni_" + i));
                } catch (ex) {
                    config = null;
                }
                if (config !== undefined && config !== null) {
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
                    GM_setValue("config_scripts_uni_" + i, JSON.stringify(config));
                }
            }
            infos_version = set_infos_version();

            // get a message if can't have the gm icon without F5 refresh (frames)
            page = get_infos_from_page().loc;
            if (page !== "niark" && page !== "index" && page !== "forum" && page !== "leftmenu" && page !== "frames") {
                alert("Script mis à jour.\n\nScript updated.");
            }
        }
    }
}

/**
 * Returns the desired GET parameter from a URL
 * @param name - the parameter to find
 * @param url - the URL to search
 * @returns {*} - The parameter value, or null if not found
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// More globals...
// the variable name 'location' makes Opera bugging
info = get_infos_from_page();
page = info.loc;
uni = info.universe;
lang = infos_version.language;
L_ = set_dictionary();
var MerchantMap = setMerchantMap();
var nbUnis = infos_version.nbUnis;

// Try to grab the config scripts for the universe, otherwise set them ourselves
if (uni !== 0 && uni !== undefined && uni !== null) {
    try {
        config = JSON.parse(GM_getValue("config_scripts_uni_" + uni));
        if (config === null || config === undefined)
            config = set_config_scripts(uni);
    } catch (ex) {
        config = set_config_scripts(uni);
    }
}

// Try to get general info scripts, set to default otherwise
try {
    infos_scripts = JSON.parse(GM_getValue("infos_scripts"));
    if (infos_scripts === null || infos_scripts === undefined)
        infos_scripts = set_infos_scripts();
} catch (ex) {
    infos_scripts = set_infos_scripts();
}

// uni_0 indicates index or forum, use that config
if (page === "forum" || page === "index") {
    try {
        config = JSON.parse(GM_getValue("config_scripts_uni_0"));
        if (config === undefined) config = set_config_scripts(0);
    } catch (ex) {
        config = set_config_scripts(0);
    }
}

// Persistent left menu
if (page === "leftmenu") {
    // NV for SW ?
    if (document.getElementsByClassName("lm_lang")[0] === undefined) {
        alert("Post on the forum (http://spaceswars.com/forum/viewforum.php?f=219)\r\nwith this message :\t'lang_box problem'\r\nThanks.\r\nNiArK");
        // return;
    }
    // get lang
    var logout_box = get_dom_xpath("//a[@href='logout.php']", document, 0);
    if (logout_box.innerHTML === "Logout") {
        infos_version.language = "en";
    } else {
        infos_version.language = "fr";
    }
    GM_setValue("infos_version", JSON.stringify(infos_version));
    lang = infos_version.language;
    // gm_icon
    var lang_box = get_dom_xpath("//div[@class='lm_lang']", document, 0);
    var gm_icon = build_node("div", ["class", "style"], ["lm_lang", "float:right; margin-right:5px;"],
        "<a href='achatbonus.php?lang=" + lang + "&uni=" + uni +
        "&config=1' target='Hauptframe' title='Scripts_SpacesWars_Corrigé'>" + "<img width='16px' height='16px' src='" + gmicon + "' alt='GM'/></a>");
    lang_box.appendChild(gm_icon);
    var sfm_check = build_node("input", ["type"], ["checkbox"]);
    var aa_check = build_node("input", ["type"], ["checkbox"]);

    $(sfm_check).change(function() {
        GM_setValue("SpyForMe", this.checked ? 1 : 0);
        spyForMe = this.checked;
    });

    $(aa_check).change(function() {
        GM_setValue("AutoAttackMasterSwitch", this.checked ? 1 : 0);
    });
    lang_box.appendChild(sfm_check);
    lang_box.appendChild(aa_check);

    $(sfm_check).prop("checked", spyForMe);
    $(aa_check).prop("checked", autoAttack);
}

// SpacesWars did away with userscripts, and along with it the
// configurating page that used to be built in. To work around it,
// redirect to the "bonus" page when the GM icon is clicked and set a
// flag that tells us to overwrite the page with our custom content below
if (page === "achatbonus" && window.location.search.includes("config=1")) {
    createAndLoadConfigurationPage();
}

/**
 * Overwrites the "Bonus" page with our script config page. So ugly,
 * but when you build up an entire page of elements using mostly vanilla
 * JS, that's what you get.
 */
function createAndLoadConfigurationPage() {
    var main = document.getElementById("main");
    main.innerHTML = "";
    main.removeAttribute("id");
    main.className = "mainSettings";

    uni = getParameterByName('uni'); // Why can't I just use the `uni` that we already defined?

    (function() {
        // Set custom CSS inline in JS, because why not
        var style = document.createElement('style');
        //noinspection JSAnnotator,JSAnnotator
        style.appendChild(document.createTextNode(
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
		`));
        document.head.appendChild(style);
    })();

    //First time using DTR's scripts, reset the config file.
    if (config.GalaxyRanks === undefined || config.NoAutoComplete === undefined) {
        config = set_config_scripts(uni);
    }
    if (config.BetterEmpire === undefined) {
        config.BetterEmpire = {};
        config.BetterEmpire.byMainSort = 1;
        config.BetterEmpire.moonsLast = 1;
    }
    // Needed to get new tooltips to work
    get_dom_xpath("//body", document, 0).appendChild(build_node("script", ["type"], ["text/javascript"],
        "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip({width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "
    ));
    // Scripts that will have their own entry
    var inactiveStats = create_script_activity("InactiveStats", 9, L_.inactiveDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.inactiveDescrip2 + "</span>");
    var galaxyRanks = create_script_activity("GalaxyRanks", 10, L_.galaxyRanksDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.galaxyRanksDescrip2 + "</span>");
    var easyTarget = create_script_activity("EasyTarget", 11, L_.easyTargetDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.easyTargetDescrip2 + "</span>");
    var autoComplete = create_script_activity("NoAutoComplete", 12, L_.noAutoDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.noAutoDescrip2 + "</span>");
    var easyTarget_textArea = build_node('textarea', ['rows', 'placeholder', 'style', 'id'], ['5', L_.EasyImportDescrip,
        'border:1px solid #545454;padding:1px;vertical-align:middle;border-radius:5px;color:#CDD7F8;font:8pt "Times New Roman" normal;margin:1%;background-color:rgba(0,0,0,0.8);width:96%;max-width:96%', 'EasyTarget_text'
    ], '');
    var betterEmpire = create_script_activity("BetterEmpire", 13, L_.betterEmpDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.betterEmpDescrip2 + "</span>");
    var FleetPoints = create_script_activity("FleetPoints", 14, L_.FPDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.FPDescrip2 + "</span>");

    // Old options that need to be created because the script site was removed
    //RConverter
    var rConverter = create_script_activity("RConverter", 1, L_.rConverterDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.rConverterDescrip2 + "</span>");
    var converter_container = build_node('div', ['class'], ['script_options'], '');
    var rConv_options = createRConvOptions();
    for (i = 0; i < rConv_options.length; i++) {
        converter_container.appendChild(rConv_options[i]);
    }

    // EasyFarm
    var easyFarm = create_script_activity("EasyFarm", 2, L_.easyFarmDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.easyFarmDescrip2 + "</span>");
    var easyFarm_container = build_node('div', ['class'], ['script_options'], '');
    var easyFarm_options = createEasyFarmOptions();
    for (i = 0; i < easyFarm_options.length; i++) {
        easyFarm_container.appendChild(easyFarm_options[i]);
    }

    // AllinDeut
    var allinDeut = create_script_activity("AllinDeut", 3, L_.allinDeutDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.allinDeutDescrip2 + "</span>");

    // iFly
    var iFly = create_script_activity("IFly", 4, "???<br /><br /><span style=\"color:lime\">???</span>");

    // TChatty
    var tChatty = create_script_activity("TChatty", 5, L_.tChattyDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.tChattyDescrip2 + "</span>");

    // Markit
    var markit = create_script_activity("Markit", 6, L_.markitDescrip1 + "<br /><br /><span style=\"color:lime\">" + L_.markitDescrip2 + "</span>");
    var markit_container = build_node('div', ['class'], ['script_options'], '');
    var markit_options = createMarkitOptions();
    for (i = 0; i < markit_options.length; i++) {
        markit_container.appendChild(markit_options[i]);
    }

    // create options for galaxyRanks
    var rank_container = build_node('div', ['class'], ['script_options'], '');
    var gRanks_options = createRankOptions(config.GalaxyRanks.ranks.length);
    for (i = 0; i < gRanks_options.length; i++) {
        rank_container.appendChild(gRanks_options[i]);
    }

    rank_container.appendChild(document.createElement('br'));
    var rank_inactive = create_script_option_radio('ShowInactive', L_.galaxyRanksInactive);
    for (i = 0; i < rank_inactive.length; i++) {
        rank_container.appendChild(rank_inactive[i]);
    }

    var emp_container = build_node('div', ['class', 'style'], ['script_options', 'overflow:auto;'], '');
    var emp_options = createCheckBoxItems([L_.betterEmpMain, L_.betterEmpMoon], 150);
    emp_options[0].style.clear = 'both';
    emp_container.appendChild(emp_options[0]);
    //emp_container.appendChild(document.createElement('br'));
    emp_container.appendChild(emp_options[1]);
    //betterEmpire.appendChild(emp_container);

    var target_container = build_node('div', ['class'], ['script_options'], '');
    var imprt = build_node('input', ['type', 'value'], ['button', L_['import']], '');
    var exprt = build_node('input', ['type', 'value'], ['button', L_['export']], '');
    target_container.appendChild(imprt);
    target_container.appendChild(exprt);
    target_container.appendChild(easyTarget_textArea);

    // create options for NoAutoComplete
    var auto_options = createCheckBoxItems([L_.noAutoGalaxy, L_.noAutoFleet1, L_.noAutoFleet2, L_.noAutoFleet3, L_.noAutoShip, L_.noAutoDef, L_.noAutoSims, L_.noAutoMerch, L_.noAutoScrap], 100);
    var width_constraint = build_node('div', ['style'], ['max-width:300px'], '');
    var auto_container = build_node('div', ['class', 'style'], ['script_options', 'overflow:auto'], '');
    for (i = 0; i < auto_options.length; i++) {
        width_constraint.appendChild(auto_options[i]);
    }
    auto_container.appendChild(width_constraint);


    // Attach main new scripts and their options
    var save = build_node('input', ['type', 'id', 'value'], ['button', 'save', 'Save'], '');
    save.onclick = saveSettings;
    var deleteAll = build_node('input', ['type', 'id', 'value'], ['button', 'delAll', 'Delete All Data'], '', 'click', function() {
        if (confirm("Are you sure you want to delete all data across all universes?")) {
            deleteAllData();
            this.value = "Deleted";
            window.location = 'achatbonus.php?lang=' + lang + '&uni=' + uni + '&config=1';
        }
    });
    var col1 = build_node('div', ['class', 'id'], ['col', 'col1'], '');
    var col2 = build_node('div', ['class', 'id'], ['col', 'col2'], '');
    main.appendChild(save);
    main.appendChild(col1);
    main.appendChild(col2);
    main.appendChild(deleteAll);
    rConverter = pack_script(rConverter, converter_container, "RConverter");
    easyFarm = pack_script(easyFarm, easyFarm_container, "EasyFarm");
    allinDeut = pack_script(allinDeut, null, "AllinDeut");
    iFly = pack_script(iFly, null, "IFly");
    tChatty = pack_script(tChatty, null, "TChatty");
    inactiveStats = pack_script(inactiveStats, null, "InactiveStats");
    easyTarget = pack_script(easyTarget, target_container, "EasyTarget");
    autoComplete = pack_script(autoComplete, auto_container, "NoAutoComplete");
    markit = pack_script(markit, markit_container, "Markit");
    galaxyRanks = pack_script(galaxyRanks, rank_container, "GalaxyRanks");
    betterEmpire = pack_script(betterEmpire, emp_container, "BetterEmpire");
    FleetPoints = pack_script(FleetPoints, null, "FleetPoints");
    col1.appendChild(rConverter);
    col1.appendChild(easyFarm);
    col1.appendChild(allinDeut);
    col1.appendChild(iFly);
    col1.appendChild(tChatty);
    col1.appendChild(inactiveStats);
    col1.appendChild(easyTarget);
    col1.appendChild(autoComplete);
    col2.appendChild(markit);
    col2.appendChild(galaxyRanks);
    col2.appendChild(betterEmpire);
    col2.appendChild(FleetPoints);
    document.body.appendChild(main);

    $('#' + L_.betterEmpMain.replace(" ", "") + "_check").click(function() {
        if (!this.checked) {
            var betterEmpId = $("#" + L_.betterEmpMoon.replace(" ", "") + "_check");
            betterEmpId.attr("checked", false);
            betterEmpId.attr("disabled", true);
        } else {
            $("#" + L_.betterEmpMoon.replace(" ", "") + "_check").removeAttr("disabled");
        }
    });

    // The "More" list
    var more = create_script_activity("More", 8, "Additional smaller scripts");

    // The fallen comrades
    var moonList = create_script_option_radio("More_moonsList", 'MoonsList');
    var convertDeut = create_script_option_radio("More_convertDeuty", "ConvertDeut");
    var traductor = create_script_option_radio("More_traductor", "Traductor");
    var resources = create_script_option_radio("More_resources", "Resources");
    var redirectFleet = create_script_option_radio("More_redirectFleet", "RedirectFleet");
    var arrows = create_script_option_radio("More_arrows", "Arrows");
    var returns = create_script_option_radio("More_returns", "Returns");



    // Create script that will go under "More"
    var deutR = create_script_option_radio("More_deutRow", "DeutRow");
    var convertC = create_script_option_radio("More_convertClick", "ConvertClick");
    var mcTrans = create_script_option_radio("More_mcTransport", "mcTransport");

    var moreItems = [moonList, convertDeut, traductor, resources, redirectFleet, arrows, returns, deutR, convertC, mcTrans];

    // Descriptions for the "More" script
    var descripContainer = document.createElement("ul");
    var deutR_descrip = build_node("li", [], [], "DeutRow : " + L_.deutRowDescrip1 + "<br />(<span style='color:lime'>" + L_.deutRowDescrip2 + "</span>)");
    var convertC_descrip = build_node("li", [], [], "ConvertClick : " + L_.convertCDescrip1 + "<br />(<span style='color:lime'>" + L_.convertCDescrip2 + "</span>)");
    var mcTrans_descrip = build_node("li", [], [], "mcTransport : " + L_.mcTransDescrip1 + "<br />(<span style='color:lime'>" + L_.mcTransDescrip2 + "</span>)");

    var moonList_descrip = build_node("li", [], [], "MoonList : " + L_.mMoonListDescrip1 + "<br />(<span style='color:lime'>" + L_.mMoonListDescrip2 + "</span>)");
    var convertDeut_descrip = build_node("li", [], [], "ConvertDeut : " + L_.mConvertDeutDescrip1 + "<br />(<span style='color:lime'>" + L_.mConvertDeutDescrip2 + "</span>)");
    var traductor_descrip = build_node("li", [], [], "Traductor : " + L_.mTraductorDescrip1 + "<br />(<span style='color:lime'>" +  L_.mTraductorDescrip2 + "</span>)");
    var resources_descrip = build_node("li", [], [], "Resources : " + L_.mResourcesDescrip1 + "<br />(<span style='color:lime'>" + L_.mResourcesDescrip2 + "</span>)");
    var redirectFleet_descrip = build_node("li", [], [], "RedirectFleet : " + L_.mRedirectFleetDescrip1 + "<br />(<span style='color:lime'>" + L_.mRedirectFleetDescrip2 + "</span>)");
    var arrows_descrip = build_node("li", [], [], "Arrows : " + L_.mArrowsDescrip1 + "<br />(<span style='color:lime'>" + L_.mArrowsDescrip2 + "</span>)");
    var returns_descrip = build_node("li", [], [], "Returns : " + L_.mReturnsDescrip1 + "<br />(<span style='color:lime'>" + L_.mReturnsDescrip2 + "</span>)");

    var moreDescrip = [moonList_descrip, convertDeut_descrip, traductor_descrip, resources_descrip, traductor_descrip, resources_descrip, redirectFleet_descrip, arrows_descrip, returns_descrip, deutR_descrip, convertC_descrip, mcTrans_descrip];

    var more_container = build_node("div", ["class"], ["script_options"], "");
    for (i = 0; i < moreItems.length; i++) {
        for (j = 0; j < moreItems[i].length; j++)
            more_container.appendChild(moreItems[i][j]);
    }

    for (i = 0; i < moreDescrip.length; i++) {
        descripContainer.appendChild(moreDescrip[i]);
    }

    more.childNodes[0].childNodes[1].appendChild(descripContainer);
    more = pack_script(more, more_container, "More");
    col2.appendChild(more);

    var actives = get_dom_xpath("//div[@class='script_active']/input[1]", document, -1),
        script;
    var options = get_dom_xpath("//div[@class='script_options']", document, -1),
        inputs;

    if (infos_scripts === undefined || infos_scripts === null) {
        console.log("reset");
        infos_scripts = set_infos_scripts();
    }

    // Fill page with current settings
    for (var i = 0; i < nbScripts; i++) {
        script = /(.*)_activate/.exec(actives[i].id)[1];
        (infos_scripts[script]) ? actives[i].checked = true: actives[i].parentNode.getElementsByTagName("input")[1].checked = "false";
        switch (script) {
            case "RConverter":
                inputs = options[0].getElementsByTagName("input");
                inputs[0].value = config.RConverter.header;
                inputs[1].value = config.RConverter.boom;
                inputs[2].value = config.RConverter.destroyed;
                inputs[3].value = config.RConverter.result;
                inputs[4].value = config.RConverter.renta;
                break;
            case "EasyFarm":
                inputs = options[1].getElementsByTagName("input");
                inputs[0].value = config.EasyFarm.minPillage;
                inputs[1].value = config.EasyFarm.colorPill;
                inputs[2].value = config.EasyFarm.minCDR;
                inputs[3].value = config.EasyFarm.colorCDR;
                break;
            case "Carto":
                inputs = options[2].getElementsByTagName("input");
                inputs[0].addEventListener("click", function() {
                    send_datas_to_carto();
                }, false);
                inputs[1].addEventListener("click", function() {
                    alert(config.Carto);
                }, false);
                inputs[2].addEventListener("click", function() {
                    if (confirm("Reset ?")) {
                        config.Carto = "";
                        GM_setValue("config_scripts_uni_" + uni, JSON.stringify(config));
                    }
                }, false);
                break;
            case "EasyTarget":
                inputs = options[2].getElementsByTagName('input');
                inputs[0].addEventListener('click', function() {
                    var easyTargetText = $('#EasyTarget_text')[0];
                    var data = easyTargetText.value;
                    try {
                        JSON.parse(data);
                    } catch (err) {
                        alert('Invalid format, not changing');
                        return;
                    }
                    if (data.length !== 0) {
                        var conf = confirm("Are you sure you want to change the galaxy data? This cannot be undone.");
                        if (conf) GM_setValue('galaxy_data_' + uni, data);
                        easyTargetText.value = '';
                    }
                });
                inputs[1].addEventListener('click', function() {
                    var easyTargetText = $('#EasyTarget_text')[0];
                    easyTargetText.value = GM_getValue('galaxy_data_' + uni);
                    easyTargetText.focus();
                    easyTargetText.select();
                });
                break;
            case "NoAutoComplete":
                inputs = options[3].getElementsByTagName('input');
                inputs[0].checked = config.NoAutoComplete.galaxy;
                inputs[1].checked = config.NoAutoComplete.fleet;
                inputs[2].checked = config.NoAutoComplete.floten1;
                inputs[3].checked = config.NoAutoComplete.floten2;
                inputs[4].checked = config.NoAutoComplete.build_fleet;
                inputs[5].checked = config.NoAutoComplete.build_def;
                inputs[6].checked = config.NoAutoComplete.sims;
                inputs[7].checked = config.NoAutoComplete.marchand;
                inputs[8].checked = config.NoAutoComplete.scrapdealer;
                break;
            case "Markit":
                inputs = options[4].getElementsByTagName("input");
                inputs[0].value = config.Markit.color.fridge;
                inputs[1].value = config.Markit.color.bunker;
                inputs[2].value = config.Markit.color.raidy;
                inputs[3].value = config.Markit.color.dont;
                inputs[4].addEventListener("click", function() {
                    if (confirm("Reset ?")) {
                        config.Markit.coord = {};
                        GM_setValue('markit_data_' + uni, JSON.stringify({}));
                        GM_setValue("config_scripts_uni_" + uni, JSON.stringify(config));
                    }
                }, false);
                //if (config.Markit.ranks) inputs[5].checked = true;
                //inputs[7].value = config.Markit.topX;
                //inputs[8].value = config.Markit.topColor;
                break;
            case "GalaxyRanks":
                inputs = options[5].getElementsByTagName('input');
                for (var j = 0; j < config.GalaxyRanks.ranks.length; j++) {
                    inputs[j * 2].value = config.GalaxyRanks.ranks[j];
                    inputs[j * 2 + 1].value = config.GalaxyRanks.values[j];
                }
                inputs[inputs.length - 3].value = config.GalaxyRanks.values[config.GalaxyRanks.values.length - 1];
                if (config.GalaxyRanks.inactives) inputs[inputs.length - 2].checked = true;
                break;
            case "BetterEmpire":
                inputs = options[6].getElementsByTagName('input');
                if (config.BetterEmpire.byMainSort) inputs[0].checked = true;
                if (config.BetterEmpire.moonsLast) inputs[1].checked = true;
                break;
            case "More":
                inputs = options[7].getElementsByTagName("input");
                if (config.More.moonsList) inputs[0].checked = true;
                if (config.More.convertDeut) inputs[2].checked = true;
                if (config.More.traductor) inputs[4].checked = true;
                if (config.More.resources) inputs[6].checked = true;
                if (config.More.redirectFleet) inputs[8].checked = true;
                if (config.More.arrows) inputs[10].checked = true;
                if (config.More.returns) inputs[12].checked = true;
                if (config.More.deutRow) inputs[14].checked = true;
                if (config.More.convertClick) inputs[16].checked = true;
                if (config.More.mcTransport) inputs[18].checked = true;
                break;
        }
    }
}

/**
 * Attach the script options to the top leve script
 *
 * @param header - The main option - "ScriptName      [x] Activate [] Deactivate"
 * @param options - The container that hold the script options
 * @param id - The id for the script
 * @returns {Element}
 */
function pack_script(header, options, id) {
    var div = document.createElement("div");
    div.className = "script_container";
    div.id = id;
    div.appendChild(header);
    if (options !== null)
        div.appendChild(options);
    return div;
}

/**
 * Create the options for RConverter
 * @returns {Array}
 */
function createRConvOptions() {
    var result = [];
    var text = ['Intro picture', "'BOOM' picture", "'Destroyed' picture", "'Result' picture", "Retentability picture"];
    for (var i = 0; i < 5; i++) {
        var option = create_script_option(['input', 'label'], [['type', 'style', 'id'], ['for']], [['text', 'width:30%', 'RConvOpt_' + i], ['RConvOpt_' + i]], ['', text[i]]);

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
        var option = create_script_option(['input', 'label', 'br', 'input', 'label'],
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
        var option = create_script_option(['input', 'label'], [['id', 'class', 'style'], ['for']], [['markit_' + i, 'jscolor', 'width:30%'], ['markit_' + i]], ['', text[i]]);
        for (j = 0; j < option.length; j++) {
            result.push(option[j]);
        }
        result.push(document.createElement('br'));
    }
    result.push(document.createElement('br'));
    option = create_script_option(['label', 'input'], [['for'], ['type', 'id', 'value', 'style']], [['markit_reset'], ['button', 'markit_reset', 'Reset', 'width:20%;min-width:40px;']], ['Markit coordinates : ', '']);
    for (j = 0; j < option.length; j++) {
        result.push(option[j]);
    }
    return result;
}


// When "Save" is clicked...
function saveSettings() {
    var saveButton = $("#save")[0];
    saveButton.value = "Saving";
    var inputs;
    var actives = get_dom_xpath("//div[@class='script_active']/input[1]", document, -1);
    var options = get_dom_xpath("//div[@class='script_options']", document, -1);
    for (var i = 0; i < nbScripts; i++) {
        script = /(.*)_activate/.exec(actives[i].id)[1];
        infos_scripts[script] = actives[i].checked;
        switch (script) {
            case "RConverter":
                inputs = options[0].getElementsByTagName("input");
                config.RConverter.header = inputs[0].value;
                config.RConverter.boom = inputs[1].value;
                config.RConverter.destroyed = inputs[2].value;
                config.RConverter.result = inputs[3].value;
                config.RConverter.renta = inputs[4].value;
                break;
            case "EasyFarm":
                inputs = options[1].getElementsByTagName("input");
                config.EasyFarm.minPillage = parseInt(inputs[0].value);
                config.EasyFarm.colorPill = inputs[1].value;
                config.EasyFarm.minCDR = parseInt(inputs[2].value);
                config.EasyFarm.colorCDR = inputs[3].value;
                break;
            case "NoAutoComplete":
                inputs = options[3].getElementsByTagName('input');
                config.NoAutoComplete.galaxy = inputs[0].checked;
                config.NoAutoComplete.fleet = inputs[1].checked;
                config.NoAutoComplete.floten1 = inputs[2].checked;
                config.NoAutoComplete.floten2 = inputs[3].checked;
                config.NoAutoComplete.build_fleet = inputs[4].checked;
                config.NoAutoComplete.build_def = inputs[5].checked;
                config.NoAutoComplete.sims = inputs[6].checked;
                config.NoAutoComplete.marchand = inputs[7].checked;
                config.NoAutoComplete.scrapdealer = inputs[8].checked;
                break;
            case "Markit":
                inputs = options[4].getElementsByTagName("input");
                config.Markit.color.fridge = inputs[0].value;
                config.Markit.color.bunker = inputs[1].value;
                config.Markit.color.raidy = inputs[2].value;
                config.Markit.color.dont = inputs[3].value;
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
                config.GalaxyRanks.ranks = rs;
                config.GalaxyRanks.values = vals;
                config.GalaxyRanks.inactives = inputs[inputs.length - 2].checked;
                break;
            case "BetterEmpire":
                inputs = options[6].getElementsByTagName('input');
                config.BetterEmpire.byMainSort = inputs[0].checked;
                config.BetterEmpire.moonsLast = inputs[1].checked;
                break;
            case "More":
                inputs = options[7].getElementsByTagName("input");
                config.More.moonsList = inputs[0].checked;
                config.More.convertDeut = inputs[2].checked;
                config.More.traductor = inputs[4].checked;
                config.More.resources = inputs[6].checked;
                config.More.redirectFleet = inputs[8].checked;
                config.More.arrows = inputs[10].checked;
                config.More.returns = inputs[12].checked;
                config.More.deutRow = inputs[14].checked;
                config.More.convertClick = inputs[16].checked;
                config.More.mcTransport = inputs[18].checked;
                break;
            default:
                break;
        }
    }
    GM_setValue("config_scripts_uni_" + uni, JSON.stringify(config));
    GM_setValue("infos_scripts", JSON.stringify(infos_scripts));
    saveButton.value = "Saved";
    setTimeout(function() {
        $("#save")[0].value = "Save";
    }, 2000);


}

if (can_load_in_page("ClicNGo")) { // doesn't count as a script (no option to deactivate it)
    loadClickNGo()
}

/**
 * Pretty sure this is broken. Used to be a universe manager of sorts
 * in the index page. Maybe I'll get around to fixing it, but I don't
 * really have any use for it.
 */
function loadClickNGo() {
    document.getElementsByTagName("body")[0].appendChild(build_node("script", [
        "type"
    ], ["text/javascript"], function putLogs(uni, pseudo, pass) {
        document.getElementById("login_univers").value = uni;
        document.getElementById("login_pseudo").value = pseudo;
        document.getElementById("login_password").value = pass;
        document.getElementById("login_submit").disabled = "";
        document.getElementById("form_login").submit();
    }));
    var clicngo = build_node("div", ["style", "id"], ["float:right;cursor:pointer;padding:4px 0 0 4px;", "clicngo"],
        "<img src='" + scripts_icons + "Clic&Go/connecting_people.png'/>");

    var script = build_node("script", ["type"], ["text/javascript"],
        "$('#clicngo').click(function(){$('#clicngo_contents').css('display','block');$('body').css('opacity', '0.2');});");

    var div = build_node("div", ["style", "id"], ["padding:5px;font:12px Times New Roman normal;width:40%;display:none;background-color:black" +
    "color:white;border-radius:5px 5px 5px 5px;border:1px solid white;position:absolute;top:10%;left:30%;",
        "clicngo_contents"
    ], "");

    document.body.parentNode.appendChild(div);

    clicngo.appendChild(script);
    get_dom_xpath("id('top_login_div')/div", document, 0).appendChild(clicngo);
    var clicngo_contents = document.getElementById("clicngo_contents");
    var html = "<div onclick='$(\"#clicngo_contents\").css(\"display\",\"none\");$(\"body\").css(\"opacity\", \"1\");'" +
        " style='padding-bottom:5px;cursor:pointer;text-align:center;color:#A6FF94;border-bottom:1px solid white;font-weight:bold;'>Clic & Go !</div>";
    html += "<div id='clicngo_id'></div>";
    html += "<div style='width:50%;border-bottom:1px solid white;margin:10px 0 10px 0;'></div>";
    html += "<div><input id='remove_nb' onclick='this.value=\"\";' value='#' style='width:20px;border:1px solid #545454;height:15px;padding:1px;" +
        "vertical-align:middle;background-color:black;border-radius:5px 5px 5px 5px;color:#CDD7F8;font:13px Times New Roman normal;margin:5px 5px 1px 2px;text-align:center;'/>";
    html += "<img id='remove_submit' style='cursor:pointer;position:relative;top:7px;' src='" + scripts_icons + "Clic&Go/remove.png' alt='remove'/></div>";
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
        scripts_icons + "Clic&Go/add.png' alt='add'/></div>";
    clicngo_contents.innerHTML += html;

    function insert_clicngo_contents() {
        for (i = 0; i < config.ClicNGo.universes.length; i++) {
            div = build_node("div", ["id", "name", "style"], ["clicngo_" + i, "clicngo_" + i, "margin:5px;"], "#" + (i + 1) + ": " + config.ClicNGo.usernames[i] +
                " (" + L_["ClicNGo_universe"] + " " + config.ClicNGo.universes[i] + ")");
            document.getElementById("clicngo_id").appendChild(div);
        }
        for (i = 0; i < config.ClicNGo.universes.length; i++) {
            var img = build_node("img", ["name", "src", "alt", "style"], ["clicngo_" + i, scripts_icons +
            "Clic&Go/login.png", "go", "margin-left:5px;cursor:pointer;position:absolute;"
            ], "");
            img.addEventListener("click", function() {
                var index = /clicngo_(\d*)/.exec(this.name)[1];
                document.getElementById("login_univers").value = config.ClicNGo.universes[index];
                document.getElementById("login_pseudo").value = config.ClicNGo.usernames[index];
                document.getElementById("login_password").value = config.ClicNGo.passwords[index];
                document.getElementById("login_submit").click();
            }, false);
            document.getElementById("clicngo_" + i).appendChild(img);
        }
    }
    insert_clicngo_contents();
    document.getElementById("add_submit").addEventListener("click", function() {
        var index = config.ClicNGo.universes.length;
        if (isNaN(parseInt(document.getElementById("add_universe").value)))
            return false;
        config.ClicNGo.universes[index] = parseInt(document.getElementById("add_universe").value);
        config.ClicNGo.usernames[index] = document.getElementById("add_username").value;
        config.ClicNGo.passwords[index] = document.getElementById("add_password").value;
        //localStorage["config_script_uni_0"] = JSON.stringify(config);
        GM_setValue("config_scripts_uni_0", JSON.stringify(config));
        document.getElementById("clicngo_id").innerHTML = "";
        insert_clicngo_contents();
    }, false);

    document.getElementById("remove_submit").addEventListener("click", function() {
        if (isNaN(parseInt(document.getElementById("add_universe").value)))
            return false;
        var nb = parseInt(document.getElementById("remove_nb").value);
        config.ClicNGo.universes.splice(nb - 1, 1);
        config.ClicNGo.usernames.splice(nb - 1, 1);
        config.ClicNGo.passwords.splice(nb - 1, 1);
        GM_setValue("config_scripts_uni_0", JSON.stringify(config));
        //localStorage["config_scripts+_uni_0"] = JSON.stringify(config);
        document.getElementById("clicngo_id").innerHTML = "";
        insert_clicngo_contents();
    }, false);

}

if (can_load_in_page("RConverter") && infos_scripts.RConverter) {
    loadRConverter();
}

/**
 * Creates nicely formatted battle reports. Not written by me, but has
 * been tweaked so as not to break anything
 */
function loadRConverter() {
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
        scripts_icons + 'RConverter/header.png' : config.RConverter.header) + "[/img]\n\n";
    rapport_converti += date_rc + "[/b]\n";
    rapport_converti += "_________________________________________________\n\n";
    for (i = 0; i < participants[0].length; i++) {
        rapport_converti += participants[0][i];
        if (participants[1][i].length === 0) {
            rapport_converti += "[img]" + ((config.RConverter.destroyed === '') ?
                scripts_icons + 'RConverter/destroyed.png' : config.RConverter.destroyed) + "[/img]\n";
        }
        for (j = 0; j < participants[1][i].length; j++) {
            rapport_converti += "[color=" + couleurs_rc[j] + "]" + participants[1][i][j][0] + " " + participants[1][i][j][1] + "[/color]\n";
        }
        rapport_converti += "\n\n";
    }

    if (nb_tours !== 1) {
        var difference;
        rapport_converti += "[img]" + ((config.RConverter.boom === '') ?
            scripts_icons + 'RConverter/boom.png' : config.RConverter.boom) +
            "[/img]";
        rapport_converti += "\n\n";

        for (i = 0; i < participants[0].length; i++) {
            rapport_converti += participants[0][i];
            if (participants[2][i].length === 0) {
                rapport_converti += "[img]" + ((config.RConverter.destroyed === '') ?
                        scripts_icons + 'RConverter/destroyed.png' : config.RConverter.destroyed
                ) + "[/img]\n";
            }
            for (j = 0; j < participants[2][i].length; j++) {
                for (var k = 0; k < participants[1][i].length; k++) {
                    if (participants[2][i][j][0] === participants[1][i][k][0]) {
                        difference = sw_to_number_rc(participants[1][i][k][1]) -
                            sw_to_number_rc(participants[2][i][j][1]);
                        break;
                    }
                }
                rapport_converti += "[color=" + couleurs_rc[j] + "]" + participants[2][i][j][0] +
                    " " + participants[2][i][j][1] + "[/color][color=#FF0040]         -" +
                    get_slashed_nb(difference) + "[/color]\n";
            }
            rapport_converti += "\n\n\n";
        }
    }
    rapport_converti += "[img]" + ((config.RConverter.result === '') ?
        scripts_icons + 'RConverter/result.png' : config.RConverter.result) + "[/img]\n";
    rapport_converti += resultat_combat + "\n\n";
    rapport_converti += resultat_CDR + "\n\n";
    rapport_converti += "[img]" + ((config.RConverter.renta === '') ?
        scripts_icons + 'RConverter/renta.png' : config.RConverter.renta) + "[/img]\n";
    rapport_converti += renta_attaquant + "\n\n";
    rapport_converti += renta_defenseur + "\n\n";
    rapport_converti += "[/center]";

    var html =
        "<textarea id='RConverter' cols=50 rows=9 onclick='this.select()'>" +
        rapport_converti + "</textarea><div>" + L_["RConverter_help"] + "</div>";
    html +=
        "<input type='radio' onclick='document.getElementById(\"RConverter\").value+=\"[spoiler=lien][url]\"+window.location.href+\"[/url][/spoiler]\";" +
        " document.getElementById(\"RConverter\").select();'/>" + L_["RConverter_HoF"];
    get_dom_xpath("//body", document, 0).appendChild(build_node("center", ["class", "style"], ["space1 curvedtot", "position:absolute; right:0; top:30px;"], html));
    document.getElementById("RConverter").select();
}

if (can_load_in_page("EasyFarm") && infos_scripts.EasyFarm) {
    loadEasyFarm();
}

/**
 * Highlights spy reports that have lots of resources/fleet,
 * among other things
 */
function loadEasyFarm() {
    if (parseInt(GM_getValue("redirToSpy")) === 1) {
        GM_deleteValue("redirToSpy");
        var aLinks = document.getElementsByTagName("a");
        for (i = 0; i < aLinks.length; i++) {
            if (aLinks[i].href.indexOf("messcat=0") !== -1) {
                aLinks[i].click();
            }
        }
    }
    var fleet_names = [L_["small_cargo"], L_["large_cargo"], L_["light_fighter"], L_["heavy_fighter"], L_["cruiser"], L_["battleship"], L_["colony_ship"], L_["recycler"], L_["espionage_probe"], L_["bomber"], L_["solar_satellite"], L_["destroyer"], L_["deathstar"], L_["battlecruiser"], L_["supernova"], L_["massive_cargo"], L_["collector"], L_["blast"], L_["extractor"]];
    var def_names = ["Rocket Launcher", "Light Laser", "Heavy Laser", "Gauss Cannon", "Ion Cannon", "Plasma Turret", "Small Shield Dome", "Large Shield Dome", "Ultimate guard"];
    var fleet_deut = [1500, 4500, 1250, 3500, 8500, 18750, 12500, 5500, 500, 25000, 1000, 40000, 3250000, 27500, 12500000, 3750000, 55000, 71500, 37500];
    var messages = get_dom_xpath("//div[@class='message_space0 curvedtot'][contains(.,\"" + L_["EasyFarm_spyReport"] + "\")][contains(.,\"" + L_["EasyFarm_metal"] + "\")]", document, -1);
    get_dom_xpath("//body", document, 0).appendChild(build_node("script", ["type"], ["text/javascript"], "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip({width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "));
    var attackIndex = -1;
    var aaIndex = parseInt(GM_getValue("AutoAttackIndex"));

    // Build up a list of planets we should avoid spying next time because
    // they have very little resources
    var doNotSpy;
    try {
        doNotSpy = JSON.parse(GM_getValue("DoNotSpy_uni" + uni));
    } catch (ex) {
        doNotSpy = new Array(8);
        for (i = 0; i < 8; i++) {
            doNotSpy[i] = new Array(500);
            for (j = 0; j < 500; j++) {
                doNotSpy[i][j] = new Array(16);
            }
        }
    }

    if (isNaN(aaIndex))
        aaIndex = -1;
    for (i = 0; i < messages.length; i++) {
        messages[i].getElementsByClassName("checkbox")[0].checked = "checked";
        var candidate = false;
        var regNb = /\s([0-9,.]+)/;
        // get metal crystal and deut
        var metal = get_nb_from_stringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[0].innerHTML)[1].split("."));
        var crystal = get_nb_from_stringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[1].innerHTML)[1].split("."));
        var deut = get_nb_from_stringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[2].innerHTML)[1].split("."));
        if ((metal / 4 + crystal / 2 + deut) / 2 >= config.EasyFarm.minPillage) {
            messages[i].setAttribute("style", "background-color:#" + config.EasyFarm.colorPill);
            messages[i].getElementsByClassName("checkbox")[0].checked = false;
            candidate = true;
        }
        var html = "<div><span style='color:#FFCC33'>" + L_["EasyFarm_looting"] + " :</span><ul style='margin-top:0'>";
        html += "<li>" + L_["massive_cargo"] + " : " + get_slashed_nb(Math.ceil(((metal + crystal + deut) / 2 / 10000000)));
        html += "<li>" + L_["supernova"] + " : " + get_slashed_nb(Math.ceil(((metal + crystal + deut) / 2 / 2000000)));
        html += "<li>" + L_["blast"] + " : " + get_slashed_nb(Math.ceil(((metal + crystal + deut) / 2 / 8000))) + "</ul>";
        var classRank = 4,
            total = 0;
        var hasShips = false;
        for (j = 0; j < fleet_names.length; j++)
            if (messages[i].innerHTML.indexOf(fleet_names[j] + " : ") !== -1) {
                // get deut value of ship j
                if (fleet_names[j] !== L_["solar_satellite"])
                    hasShips = true;
                total += get_nb_from_stringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[classRank].innerHTML)[1].split(",")) * fleet_deut[j];
                classRank++;
            }
        if (total * 0.6 >= config.EasyFarm.minCDR) {
            messages[i].setAttribute("style", "background-color:#" + config.EasyFarm.colorCDR);
            messages[i].getElementsByClassName("checkbox")[0].checked = false;
        }

        var shouldAttack = !hasShips && candidate;
        var totDef = 0;
        for (j = 0; j < def_names.length; j++) {
            if (messages[i].innerHTML.indexOf(def_names[j] + " : ") !== -1) {
                var n = get_nb_from_stringtab(regNb.exec(messages[i].getElementsByClassName("half_left")[classRank++].innerHTML)[1].split(","));
                if (i !== 8)
                    totDef += n;
                else
                    shouldAttack = shouldAttack && n <= 200;
            }
        }
        shouldAttack = shouldAttack && totDef < 500000;

        html += "<div><span style='color:#7BE654'>" + L_["EasyFarm_ruinsField"] + " :</span> " + get_slashed_nb(Math.floor(total * 0.6)) + " " + L_["EasyFarm_deuterium"] + "</div>";
        if (messages[i].innerHTML.indexOf(L_["EasyFarm_defenses"]) !== -1) {
            html += "<br/><div><span style='color:#55BBFF'>" + L_["EasyFarm_defenses"] + " :</span>";
            for (j = 0; j < messages[i].getElementsByClassName("message_space0")[2].getElementsByClassName("half_left").length; j++)
                html += "<br/>" + messages[i].getElementsByClassName("message_space0")[2].getElementsByClassName("half_left")[j].innerHTML;
            html += "</div>";
        }

        var text = messages[i].childNodes[1].childNodes[7].innerHTML;
        text = text.substr(5, text.indexOf("(") - 6);
        var galaxy = parseInt(text.substr(0, 1));
        text = text.substr(2);
        var system = parseInt(text.substr(0, text.indexOf(":")));
        var position = text.substr(text.indexOf(":") + 1);

        var res = Math.ceil((metal + crystal + deut) / 2 / 12500000);
        var allDeut = (metal / 4 + crystal / 2 + deut) / 2;
        if (allDeut < 4 * config.EasyFarm.minPillage && totDef > 500000 && !hasShips) {
            messages[i].getElementsByClassName("checkbox")[0].checked = true;
        }

        if (allDeut < config.EasyFarm.minPillage / 2) {
            doNotSpy[galaxy][system][position] = 1;
        } else {
            doNotSpy[galaxy][system][position] = 0;
        }

        var deutTotal = allDeut;
        var snb = get_slashed_nb;
        var content = L_["massive_cargo"] + " : " + snb(res) + "<br />Deut : " + snb(allDeut);
        allDeut /= 2;
        var count = 1;
        while (allDeut >= config.EasyFarm.minPillage && config.EasyFarm.minPillage > 0) {
            count++;
            deutTotal += allDeut;
            allDeut /= 2;
        }
        var waves = (count === 1) ? " wave : " : " waves : ";
        content += "<br />" + count + waves + snb(deutTotal) + " Deut";
        var div = build_node("div", [], [], content);
        messages[i].getElementsByClassName("message_space0")[0].parentNode.appendChild(div);
        div = build_node("div", ["style", "id"], ["display:none", "divToolTip"], "");
        document.getElementsByTagName("body")[0].appendChild(div);
        div = build_node("div", ["style", "id"], ["display:none", "data_tooltip_" +
        i
        ], html);
        document.getElementsByTagName("body")[0].appendChild(div);
        var xpath = document.evaluate("//a[text()='" + L_.EasyFarm_attack + "']",
            document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        xpath = xpath.snapshotItem(i);
        div = build_node("a", ["class", "id", "href", "style"], ["tooltip", "tooltip_" + i, xpath.href, "float:right; width:0;"],
            "<img src='http://i.imgur.com/OMvyXdo.gif' width='20px' alt='p'/>");
        messages[i].getElementsByClassName("donthide")[0].getElementsByTagName("div")[0].appendChild(div);

        // Definitely not a bot... I don't know what you're talking about
        if (autoAttack) {
            var href = messages[i].getElementsByTagName("a")[2].href;
            (function(count, res, href) {
                $(messages[i].getElementsByTagName("a")[2]).click(function() {
                    GM_setValue("AutoAttackWaves", count);
                    res = Math.round((res + 500000) / 1000000) * 1000000;
                    GM_setValue("AutoAttackMC", res);
                    window.location = href;
                });
            })(count, res, href);

            if (shouldAttack && advancedAutoAttack) {
                if (attackIndex === -1 || attackIndex === aaIndex)
                    attackIndex = i;
            }
        }
    }

    if (!autoAttack) {
        GM_deleteValue("AutoAttackWaves");
        GM_deleteValue("AutoAttackMC");
        GM_setValue("AutoAttackIndex", -1);
    }

    if (messages.length > 0 && aaIndex !== -1 && autoAttack && advancedAutoAttack) {
        GM_setValue("AutoAttackIndex", -1);
        messages[aaIndex].getElementsByClassName("checkbox")[0].checked = "checked";
        setTimeout(function() {
            document.getElementsByTagName("input")[5].click();
        }, Math.random() * 200 + 200);
    } else if (attackIndex !== -1 && autoAttack && advancedAutoAttack) {
        GM_setValue("AutoAttackIndex", attackIndex);
        setTimeout(function() {
            $(messages[attackIndex].getElementsByTagName("a")[2]).click();
        }, Math.random() * 200 + 200);
    }
    GM_setValue("DoNotSpy_uni" + uni, JSON.stringify(doNotSpy));
}

//////////////////////////
//                      //
// Start of new scripts //
//        (kinda)       //
//////////////////////////

// I wrote this, but I don't know where the magic number
// 22 is coming from. It replaces '?' in the simulator
// with whatever values are available though
if (page === 'simulator') {
    if ($('.simu_120').length === 22) {
        var a109 = $('#a109');
        var d109 = $('#d109');
        var a110 = $('#a110');
        var d110 = $('#d110');
        var a111 = $('#a111');
        var d111 = $('#d111');
        var aoff = $('#aoff');
        var doff = $('#doff');
        if (a109.val() === '?') a109.val(d109.val());
        if (d109.val() === '?') d109.val(a109.val());
        if (a110.val() === '?') a110.val(d110.val());
        if (d110.val() === '?') d110.val(a110.val());
        if (a111.val() === '?') a111.val(d111.val());
        if (d111.val() === '?') d111.val(a111.val());
        if (aoff.val() === '?') aoff.val(doff.val());
        if (doff.val() === '?') doff.val(aoff.val());
    }
}


// Definitely a bot, scans the entire galaxy autonomously to update
// the universe graph
var search_galaxy = false;
GM_deleteValue("spacesCount");
GM_deleteValue("spacesGalaxy");

if (can_load_in_page("EasyTarget") && search_galaxy) {
    setTimeout(goRight, Math.random() * 100);
}

function goRight() {
    var count, gal;
    try {
        count = parseInt(GM_getValue("spacesCount"));
    } catch (err) {
        count = 1;
    }
    try {
        gal = parseInt(GM_getValue("spacesGalaxy"));
        if (isNaN(gal))
            gal = 1;
    } catch (err) {
        gal = 1;
    }
    if (count < 500) {
        count++;
        GM_setValue("spacesCount", count);
        document.getElementsByName('systemRight')[0].click();
    } else {
        GM_setValue("spacesCount", 1);
        if (gal === 7) GM_setValue("spacesCount", 500);
        else {
            document.getElementById("galaxy").value = (gal + 1);
            document.getElementsByName("system")[0].value = 1;
            GM_setValue("spacesGalaxy", gal + 1);
            document.forms["galaxy_form"].submit()
        }
    }
}

// Shows who's inactive in the statistics page
if (can_load_in_page('InactiveStats') && (infos_scripts.InactiveStats || infos_scripts.FleetPoints)) {
    loadInactiveStatsAndFleetPoints(infos_scripts);
}

/**
 * Display who's inactive in the statistics page, as well
 * as build up a database of current points for given categories,
 * which allows us to determine their fleet points, which is
 * otherwise unavailable to us.
 *
 * This is only the beginning of my awfulness...
 *
 * @param infos_scripts - The current script settings
 *
 */
function loadInactiveStatsAndFleetPoints(infos_scripts) {
    var lst;
    var fp;
    var fp_redirect = false;
    var changed = false;
    var types, i, space;
    if (infos_scripts.FleetPoints) {
        try {
            fp = JSON.parse(GM_getValue("fleet_points_uni_" + uni));
            if (fp === undefined || fp === null) fp = {
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
        fp_redirect = !!(GM_getValue("fp_redirect"));
        GM_setValue('fp_redirect', 0);
        if (!fp['1']) fp['1'] = {};
        if (!fp['2']) fp['2'] = {};
        if (!fp['3']) fp['3'] = {};
    }
    try {
        lst = JSON.parse(GM_getValue('InactiveList_' + uni));
        if (lst === undefined || lst === null) lst = {};
    } catch (err) {
        lst = {};
    }

    var players = document.getElementsByClassName('space0')[2].childNodes;

    if (infos_scripts.FleetPoints) {
        var timeSelector = $('.divtop.curvedtot');
        var time = timeSelector[0].innerHTML;
        var months = ['Months:', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        if (lang === 'fr') types = ['Points de Flotte', 'Général', ' pas à jour!', 'Recherche', 'Bâtiment', 'Défense'];
        else types = ['Fleet Points', 'General', ' not up to date!', 'Research', 'Buildings', 'Defense'];
        if (lang === 'fr') {
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
        var who = parseInt($('select[name=who] :selected').val());
        if (who === 2) dte = new Date(fp[1][Object.keys(fp[1])[0]][1][1]);

        if (!fp_redirect) {
            var type = $('select[name=type] :selected').val();
            var ind = ((who === 2) ? 9 : 11);
            if (type !== '2') {
                for (i = 1; i < players.length - 1; i++) {
                    var player;
                    if (players[i].childNodes[5].childNodes.length === 2) player = players[i].childNodes[5].childNodes[1].childNodes[0];
                    else player = players[i].childNodes[5].childNodes[0];
                    player = player.innerHTML;
                    var score = parseInt(players[i].childNodes[ind].innerHTML.replace(/\./g, ''));
                    if (fp[who][player] === undefined) fp[who][player] = {
                        '1': [0, 0],
                        '3': [0, 0],
                        '4': [0, 0],
                        '5': [0, 0]
                    };
                    if (fp[who][player][type][1] !== dte.getTime()) {
                        fp[who][player][type] = [score, dte.getTime()];
                        changed = true;
                    }
                }
                if (changed) GM_setValue('fleet_points_uni_' + uni, JSON.stringify(fp));
            }
        } else {
            space = $('.space0')[1];
            space.removeChild(space.childNodes[5]);
            space.removeChild(space.childNodes[4]);
            var head = timeSelector[1];
            while (head.firstChild) head.removeChild(head.firstChild);
            head.appendChild(build_node('div', ['class'], ['stats_player_1'], "Place"));
            head.appendChild(build_node('div', ['class'], ['stats_player_2'], (lang === 'fr') ? 'Joueur' : 'Player'));
            head.appendChild(build_node('div', ['class'], ['stats_player_2'], "Points"));
            head.appendChild(build_node('div', ['class', 'style'], ['stats_player_3', 'width:150px'], "Info"));
            head.appendChild(build_node('a', ['href', 'class', 'style', 'id'], ['#', 'stats_player_2', 'width:100px', 'nameChange'], (lang === 'fr') ? 'Nouveau nom?' : 'Name change?'));
            players = document.getElementsByClassName('space0')[2];
            while (players.firstChild) players.removeChild(players.firstChild);
            var arr = [];
            for (var k in fp[who]) {
                if (fp[who].hasOwnProperty(k)) {
                    arr.push([k, fp[who][k]['1'][0] - fp[who][k]['3'][0] - fp[who][k]['4'][0] - fp[who][k]['5'][0]]);
                }
            }
            arr.sort(function(a, b) {
                return b[1] - a[1]
            });
            for (i = 0; i < arr.length; i++) {
                var container = build_node('div', ['class'], [((i % 2 === 0) ? 'space1' : 'space') + ' curvedtot'], '');
                var place = build_node('div', ['class'], ['stats_player_1'], i + 1);
                var playr = build_node('div', ['class', 'id'], ['stats_player_2', 'player_' + i], arr[i][0]);
                var point = build_node('div', ['class'], ['stats_player_2'], get_slashed_nb(arr[i][1]));
                var not_updated = '&nbsp;';
                for (var j = 1; j < 5; j++) {
                    if (j !== 2) {
                        if (fp[who][arr[i][0]][j][1] !== dte.getTime()) {
                            not_updated = types[j] + types[2];
                            break;
                        }
                    }
                }
                var info = build_node('div', ['class', 'style'], ['stats_player_3', 'width:150px'], not_updated);
                container.appendChild(place);
                container.appendChild(playr);
                container.appendChild(point);
                container.appendChild(info);
                players.appendChild(container);
            }
            $('#nameChange').click(function() {
                var en = "Make sure you have gone through all the stats in the General section, as this deletes any players where general is not up to date. It also deletes EasyTarget info, so be careful!";
                var fr = "Assurez-vous que vous avez passé par toutes les statistiques de la section générale, car cela supprime tous les joueurs où le général est pas à jour. Il supprime également des informations EasyTarget, donc soyez prudent!";
                var msg = (lang === 'en') ? en : fr;
                if (confirm(msg)) {
                    var storage;
                    try {
                        storage = JSON.parse(GM_getValue("galaxy_data_" + uni));
                        if (storage.universe === null || storage.universe === undefined) storage = {
                            'universe': {},
                            'players': {}
                        };
                    } catch (ex) {
                        storage = {
                            'universe': {},
                            'players': {}
                        };}

                    for (var i = 0; i < arr.length; i++) {
                        if (fp[who][arr[i][0]][1][1] !== dte.getTime()) {
                            delete fp[who][arr[i][0]];
                            var locations = storage.players[arr[i][0]][0];
                            for (var j = 0; j < locations.length; j++) {
                                delete storage.universe[locations[j]];
                            }
                            delete storage.players[arr[i][0]];
                        }
                    }
                    GM_setValue('fleet_points_uni_' + uni, JSON.stringify(fp));
                    GM_setValue('fp_redirect', 1);
                    window.location = 'stat.php';
                }
            });
        }
    }

    if (infos_scripts.InactiveStats) {
        for (i = 1; i < players.length - 1; i++) {
            var div;
            // Top 5 have avatar, have to assign div differently
            if (players[i].childNodes[5].childNodes.length === 2) div = players[i].childNodes[5].childNodes[1].childNodes[0];
            else div = players[i].childNodes[5].childNodes[0];
            var name = div.innerHTML;
            if (lst[name] === true) {
                div.style.color = '#CCC';
                div.innerHTML += ' (i)'
            } else if (lst[name] === false) {
                div.style.color = '#999';
                div.innerHTML += ' (i I)';
            }
        }
    }

    if (infos_scripts.FleetPoints) {
        space = $('.space0')[1];
        var del = space.removeChild(space.childNodes[3]);

        del.onchange = function() {
            if (this.value === "6") {
                GM_setValue('fp_redirect', 1);
                this.value = 2;
            }
            document.forms[1].submit();
        };
        del.appendChild(build_node('option', ['value'], ['6'], types[0]));
        space.insertBefore(del, space.childNodes[3]);

        del = space.removeChild(space.childNodes[1]);
        del.onchange = function() {
            var selector = $('select[name=type]');
            if (selector.val() === '6') {
                GM_setValue('fp_redirect', 1);
                selector.val(2);
            }
            document.forms[1].submit();
        };
        space.insertBefore(del, space.childNodes[1]);
        if (fp_redirect) {
            $('select[name=type] :selected').removeAttr('selected');
            $('select[name=type]').val(6);
        }
    }
}

if (can_load_in_page("More_deutRow") && infos_scripts.More && config.More.deutRow) {
    loadDeutRow();
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
    var header = $('.default_1c1b');
    var m = parseInt((header[0].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var c = parseInt((header[1].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var d = parseInt((header[2].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var aid = parseInt(m / 4 + c / 2 + d);
    var outer = build_node('div', ['class'], ['default_1c3'], "");
    var picHolder = build_node('div', ['class', 'style'], ['curvedtot', 'float:left;background-color:#333;width:40px;padding:1px'], "");
    var pic = build_node('div', ['class', 'style'], ['dhi1', 'float:left;background:url("http://i.imgur.com/PZnkeNS.png") no-repeat top left;width:40px;height:12px;'], "");
    var textHolder = build_node('div', ['class', 'style', 'id'], ['default_1c1b', 'overflow:auto;padding-left:7px', 'ov_allindeut'], "");
    var title = build_node('div', ['class', 'style'], ['decault_1c1b', 'float:left;width:60px'], "AllInDeut : ");
    var amountHolder = build_node('div', ['style'], ['float:right;width:auto'], "");
    var amount = build_node('a', ['href', 'class', 'title', 'style', 'id'], ['#', 'ov_align_r', aid, 'text-align:right;width:auto;float:right;color:#7BE654;', 'allin'], get_slashed_nb(aid));
    amountHolder.appendChild(amount);
    textHolder.appendChild(title);
    textHolder.appendChild(amountHolder);
    picHolder.appendChild(pic);
    outer.appendChild(pic);
    outer.appendChild(textHolder);
    var div = $('.default_1c')[0];
    div.insertBefore(outer, div.childNodes[div.childNodes.length - 2]);

    var aligner_ressources = function() {
        var array_r = ["metal", "cristal", "deuterium", "energy", "allindeut"];
        var max_number = 0;
        for (i = 0; i < array_r.length; i++) {
            var selector = $("#ov_" + array_r[i]);
            if (max_number < selector.width()) {
                max_number = selector.width();
            }
        }
        $(".default_1c1b").css('width', max_number);
        $(".ov_align_r").css({
            'text-align': 'right',
            'float': 'right'
        });
    };
    aligner_ressources();
}

if (can_load_in_page('More_deutRow') && infos_scripts.More && config.More.convertClick) {
    loadConvertClick();
}

/**
 * Convert all resources to the one clicked on in the header
 */
function loadConvertClick() {
    var header = $('.default_1c1b');
    header[0].childNodes[3].childNodes[0].childNodes[0].setAttribute('id', 'metalClick');
    header[1].childNodes[3].childNodes[0].childNodes[0].setAttribute('id', 'crystalClick');
    header[2].childNodes[3].childNodes[0].childNodes[0].setAttribute('id', 'deutClick');
    $('#metalClick').click(function() {
        GM_setValue('ResourceRedirect', window.location.href);
        GM_setValue('ResourceRedirectType', 0);
        //localStorage.spacesResourceRedirect = window.location.href;
        //localStorage.spacesResourceRedirectType = 0;
        window.location = "marchand.php";
    });
    $('#crystalClick').click(function() {
        GM_setValue('ResourceRedirect', window.location.href);
        GM_setValue('ResourceRedirectType', 1);
        window.location = "marchand.php";
    });
    $('#deutClick').click(function() {
        GM_setValue('ResourceRedirect', window.location.href);
        GM_setValue('ResourceRedirectType', 2);
        window.location = "marchand.php";
    });
    if (config.More.deutRow) {
        $('#allin').click(function() {
            GM_setValue('ResourceRedirect', window.location.href);
            GM_setValue('ResourceRedirectType', 3);
            window.location = "marchand.php";
        });
    }

    $('.defenses_1a, .flottes_1a, .buildings_1a, .research_1a').click(function(e) {
        var item = $(this).parents()[1].getElementsByTagName("a")[0].innerHTML;
        GM_setValue("MerchantItem", item);
        GM_setValue("ResourceRedirect", window.location.href);
        window.location = "marchand.php";
    });
}

if (page === 'fleet' && infos_scripts.More && config.More.mcTransport && uni === '17') {
    loadMcTransport();
}

/**
 * Estimate the number of Massive Cargos needed to transport the current resources
 * on the planet. Numbers are very specific to uni 17.
 */
function loadMcTransport() {
    var header = $('.default_1c1b');
    var m = parseInt((header[0].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var c = parseInt((header[1].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var d = parseInt((header[2].childNodes[3].childNodes[0].childNodes[0].innerHTML).replace(/\./g, ''));
    var mc = $('#ship217');
    if (mc.length) {
        var num = Math.ceil((m + c + d) / 125000000000) * 10000;
        var consumption = Math.ceil(num * 103659 * 10000) / 10000;
        //434 = duration
        // 71 = spd
        num += Math.ceil(consumption / 125000000000) * 10000 + 20000;
        mc[0].setAttribute('placeholder', get_slashed_nb(num));
        //mc[0].value = "";
        var div = build_node('div', ['class', 'style'], ['flotte_bas', '-moz-user-select: -moz-none;-khtml-user-select: none;-webkit-user-select: none;-ms-user-select: none;user-select: none;'], '');
        var text = build_node('a', ['class', 'id'], ['link_ship_selected', 'transport'], "MC Transport");
        //var less = build_node('a', ['class', 'id', 'style'], ['link_ship_selected', 'ten', 'font-size: 5pt'], "(-10) &nbsp;");
        //var more = build_node('a', ['class', 'id', 'style'], ['link_ship_selected', 'hundred', 'font-size: 5pt'], " &nbsp;(+10)");
        //div.appendChild(less);
        div.appendChild(text);
        //div.appendChild(more);
        var flotteBas = $('.flotte_bas');
        flotteBas[0].parentNode.insertBefore(div, flotteBas[1]);
        var w = parseInt(window.getComputedStyle(flotteBas[0], null).getPropertyValue('width'));
        flotteBas.css('width', (w * 2 / 3) + 'px');
        $('#transport').click(function() {
            $('#ship217')[0].value = get_slashed_nb(num);
            //document.forms[1].submit();
        });
//         $('#ten').click(function() {
//             $('#ship217')[0].value = get_slashed_nb(parseInt($('#ship217')[0].value.replace(/\./g, '')) - 10000);
//         });
//         $('#hundred').click(function() {
//             $('#ship217')[0].value = get_slashed_nb(parseInt($('#ship217')[0].value.replace(/\./g, '')) + 10000);
//         });
    }
}

if (can_load_in_page("empireTotal") && infos_scripts.BetterEmpire) {
    loadBetterEmpire(config);
}

/**
 * Organizes Empire view to optionally show totals first and moons last
 * @param config
 */
function loadBetterEmpire(config) {
    var space, i, j, row, planets;
    var spaceSelector = $('.space0');
    if (!config.BetterEmpire.byMainSort) {
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
        var moonsLast = config.BetterEmpire.moonsLast;
        space = spaceSelector[1];
        var array = [];
        for (i = 0; i < space.childNodes.length; i++) {
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
        if (lang === 'fr') order = ['NomCoordonnées', 'Total'];

        var items = $('#cp')[0].childNodes;

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

if (can_load_in_page("EasyTarget")) {
    loadEasyTargetAndMarkit(infos_scripts, config);
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
 */
function animateBackground(element, newColor, duration) {
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
        setTimeout(function(element, oldColor, newColor, i, steps) {
            element.style.backgroundColor = "rgba(" +
                Math.round(oldColor.r + (((newColor.r - oldColor.r) / steps) * i)) + "," +
                Math.round(oldColor.g + (((newColor.g - oldColor.g) / steps) * i)) + "," +
                Math.round(oldColor.b + (((newColor.b - oldColor.b) / steps) * i)) + "," +
                (oldColor.a + (((newColor.a - oldColor.a) / steps) * i)) + ")";
        }, (50/3) * i, element, oldColor, newColor, i, steps)
    }
}

/***
 * The main processor while in the galaxy view, including Markit and EasyTarget
 *
 * Looking back, I'm surprised I was able to make this when I did. Lots of little hitches,
 * but for the most part very robust and feature rich. (Minus the god-awful style/maintainability)
 * @param infos_scripts
 * @param config
 */
function loadEasyTargetAndMarkit(infos_scripts, config) {

    // grab the rows and splice out any we don't care about
    var rows = $('.curvedtot.space, .curvedtot.space1');
    rows.splice(0, 2);
    rows.splice(15);

    var gRanksRanks = config.GalaxyRanks.ranks;
    var gRanksColors = config.GalaxyRanks.values;

    var i, j;

    // attach the Markit popup window
    document.body.appendChild(build_node('div', ['id', 'style'], ['markit_current', 'display:none'], "0"));
    var markit;
    var choosebox;

    // Grab the Markit data and create the Markit window. Lots of fun when you only use JS
    // TODO: pull out into own method
    if (infos_scripts.Markit) {
        try {
            markit = JSON.parse(GM_getValue('markit_data_' + uni));
            if (markit === undefined || markit === null) markit = {};
        } catch (err) {
            markit = {};
        }

        choosebox = build_node(
            'div',
            ['class', 'id', 'style'],
            ['divtop', 'markit_choose', 'width:200px; margin:auto; height:auto; border-radius:15px; text-align:center; position:relative; bottom:400px; opacity:0.8;'],
            "<div class='space0'>" + L_.mTitle + "</div>"
        );

        var values = ["default", "fridge", "bunker", "raidy", "dont"];
        var descripts = [L_.mNone, L_.mFridge, L_.mBunker, L_.mAttack, L_.mDont];
        var text = "<div class='space0' style='margin-left: 60px;text-align:left'>";

        for (i = 0; i < 5; i++) {
            text +=
                "<input type='radio' name='markit_type' value='" + values[i] + "' id='" + values[i] + "' />" +
                "<label for='" + values[i] + "' style='" + ((i === 0) ? "" : "color: #" + config.Markit.color[values[i]] + "; ") + "margin: auto 20px auto 10px;vertical-align:text-top;line-height:6pt;'>" + descripts[i] + "</label><br />"
        }
        text += "</div><input type='submit' style='margin:5px;padding:5px;text-align:center' value='Submit' id='markit_submit' />";
        choosebox.innerHTML += text;
        document.body.appendChild(choosebox);

        $('#markit_choose').hide();
        $('#markit_submit').click(function() {
            var num = parseInt($('#markit_current')[0].innerHTML);
            var galaxy = $('#galaxy')[0].value;
            var sys = document.getElementsByName('system')[0].value;
            var markitTypeChecked = $('input[name="markit_type"]:checked');
            var type = markitTypeChecked.val();
            var loc = galaxy + ':' + sys + ':' + num;

            if (type === "default") {
                // Fade back to the default background, which depends on
                // which row it's in
                if (markit[loc] !== undefined) delete markit[loc];
                var defCol;
                if (num % 2 === 0) {
                    defCol = "#111111";
                } else {
                    defCol = "transparent";
                }
                animateBackground(rows[num - 1], defCol, 500);
            } else {
                // Fade to the corresponding color
                markit[galaxy + ':' + sys + ':' + num] = markitTypeChecked.val();
                var c = hexToRgb('#' + config.Markit.color[type]);
                c.a = .5;
                animateBackground(rows[num - 1], c, 500);
            }
            $('#markit_choose').fadeOut(500);
            GM_setValue('markit_data_' + uni, JSON.stringify(markit));
        });
    }

    var changed = false;
    var storage;
    var inactiveList;
    var gal = parseInt(document.getElementById('galaxy').value);
    var sys = parseInt(document.getElementsByName('system')[0].value);
    if (infos_scripts.EasyTarget) {
        // Grab the user data. If something goes wrong, reset it completely
        try {
            storage = JSON.parse(GM_getValue("galaxy_data_" + uni));
            if (storage === undefined) storage = {
                'universe': {},
                'players': {}
            };
            if (storage.universe === undefined || storage.universe === null || storage.players === undefined || storage.universe === null) storage = {
                'universe': {},
                'players': {}
            };
        } catch (err) {
            changed = true;
            storage = {
                'universe': {},
                'players': {}
            };
        }
    } else storage = {
        'universe': {},
        'players': {}
    };

    try {
        inactiveList = JSON.parse(GM_getValue("InactiveList_" + uni));
        if (inactiveList === undefined || inactiveList === null) inactiveList = {};
    } catch (err) {
        inactiveList = {};
    }

    // Nice hack to know if we want to highlight a planet. Before we redirected, we set some
    // local storage.
    var galaxySelector = $('#galaxy');

    var targetPlanet = -1;
    var redir;
    try {
        redir = JSON.parse(localStorage.EasyTargetRedirect);
    } catch (err) {
        redir = undefined;
    }
    if (redir !== undefined) {
        if (parseInt(redir.redirect) === 1) {
            // I don't think the code path ever gets executed,
            // since we would have already redirected if we're hitting
            // this now, and would probably put us in an infinite loop
            if (redir.g !== -1) {
                galaxySelector[0].value = redir.g;
                document.getElementsByName('system')[0].value = redir.s;
                document.forms['galaxy_form'].submit();
            } else {
                targetPlanet = parseInt(redir.planet);
            }
        }
        localStorage.EasyTargetRedirect = JSON.stringify({
            'planet': -1,
            'redirect': 0
        });
    }

    var changedPlayers = [];
    var changedMoons = [];

    // TODO: prevents default behavior from keys 0-9?? And why is
    // the logic so weird/complex compared to the other
    // seemingly obvious solution
    galaxySelector.keypress(function(e) {
        var a = [];
        var k = e.which;

        for (i = 48; i < 58; i++)
            a.push(i);

        if (!(a.indexOf(k) >= 0))
            e.preventDefault();
    });

    // Things get accidentally highlighted too often, disable selection
    rows.css({
        '-moz-user-select': '-moz-none',
        '-khtml-user-select': 'none',
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
    });

    $(window).on("keyup", function(e) {
        if (targetPlanet !== -1) {
            var key = e.keyCode ? e.keyCode : e.which;
            var KEY_N = 78;
            var KEY_P = 80;
            var KEY_S = 83;
            var KEY_L = 76;

            if (key === KEY_S) {
                e.preventDefault();
                var element = rows[targetPlanet - 1].childNodes[15].childNodes[1];
                if (element !== undefined) {
                    var title = element.getAttribute('title');
                    if (title === 'Spy') {
                        element.click();
                    }
                }
            } else if (key === KEY_L) {
                e.preventDefault();
                var row = rows[targetPlanet - 1];
                var name = row.childNodes[7].childNodes[1];
                var id = name.onclick.toString();
                id = id.substring(id.lastIndexOf("(") + 2, id.lastIndexOf(")") - 1);
                var moonDiv = document.getElementById(id);
                var node = moonDiv.childNodes[4];
                for (var i = 0; i < node.childNodes.length; i++) {
                    if (node.childNodes[i].childNodes[0].innerHTML === "Espionage") {
                        node.childNodes[i].childNodes[0].click();
                        break;
                    }
                }
            }

            if (key === KEY_N || key === KEY_P) {
                var coords = '';

                var gal = galaxySelector[0].value;
                var sys = document.getElementsByName('system')[0].value;
                var ploc = gal + ":" + sys + ":" + targetPlanet;
                // var ploc = sum.substring(0, sum.indexOf(':', sum.indexOf(':') + 1) + 1);
                // ploc += targetPlanet;
                var n = storage.universe[ploc];
                var player = storage.players[n][0];
                var index = player.indexOf(ploc);
                if (key === KEY_N) {
                    coords = player[(index + 1) % player.length];
                } else {
                    if (index === 0) index += player.length;
                    coords = player[(index - 1) % player.length];
                }
                targetPlanet = easyTargetRedirect(ploc, coords, rows, rows[targetPlanet - 1].childNodes[11].childNodes[1], infos_scripts, markit);
            }
        }
    });

    var spyNeeded = [];
    var doNotSpy = null;
    var sfmLen = parseInt(GM_getValue("autoSpyLength"));
    if (!isNaN(sfmLen) && sfmLen >= 0 && spyForMe) {
        try {
            doNotSpy = JSON.parse(GM_getValue("DoNotSpy_uni" + uni));
        } catch (ex) {
            doNotSpy = null;
        }
    }

    // THE loop. Iterates over each row and sets up everything related
    // to Markit and EasyFarm
    for (i = 0; i < 15; i++) {
        var row = rows[i];
        var name = row.childNodes[11].childNodes[1];
        var planet = i + 1;
        var position = gal + ":" + sys + ":" + planet;

        // This person is marked!
        if (infos_scripts.Markit && markit[position] !== undefined) {
            var c = hexToRgb('#' + config.Markit.color[markit[position]]);
            c.a = 0.5;
            if (name !== undefined && planet !== targetPlanet)
                animateBackground(row, c, 750);
            else if (name === undefined) delete markit[position];
        }

        //Name of the person previously stored at the given coord
        var storedName = storage.universe[position];

        if (name !== undefined) { // There's a player here
            // Create span that shows rank
            var span = document.createElement("span");
            var id = name.onclick.toString();
            id = id.substring(id.indexOf("('") + 2, id.indexOf("')"));

            var rank = document.getElementById(id).childNodes[1].innerHTML;
            rank = parseInt(rank.substring(rank.indexOf(":") + 2));
            span.innerHTML = '(' + rank + ')';

            var newName = name.childNodes[0].nodeValue;
            if (newName === null) newName = name.childNodes[0].innerHTML;
            else newName = newName.substring(0, newName.length - 1);

            if (infos_scripts.EasyTarget && storedName !== undefined && storedName !== null && storedName !== newName) {
                // There's a different person at this location than what we have stored
                changed = true;

                if (storage.players[newName] === undefined) {
                    // If the owner of a planet has changed, and the new owner is not in the list, assume that
                    // the user changed names and change things accordingly. I think
                    var locations = storage.players[storedName][0];
                    for (j = 0; j < locations.length; j++) {

                        storage.universe[locations[j]] = newName;
                    }
                    storage.players[newName] = storage.players[storedName];
                    delete storage.players[storedName];
                }

                storage.universe[position] = newName;
                if (storage.players[storedName] !== undefined) {
                    storage.players[storedName][0].splice(storage.players[storedName][0].indexOf(position), 1);
                    var moon = storage.players[storedName][1].indexOf(position);
                    if (moon !== -1) {
                        storage.players[storedName][1].splice(moon, 1);
                    }
                }
            }

            var lune = (row.childNodes[7].childNodes.length > 1);

            if (infos_scripts.EasyTarget && storage.universe[position] !== newName) {
                storage.universe[position] = newName;
                changed = true;
            }

            // Change the color of the rank according to the values set in GalaxyRanks
            if (name.className.indexOf('inactive') === -1 || config.GalaxyRanks.inactives) {
                // Remove them from the inactives list if they're active again
                if (inactiveList[newName] !== undefined && name.className.indexOf('inactive') === -1) delete inactiveList[newName];
                span.style.color = '#' + gRanksColors[gRanksColors.length - 1];
                for (j = 0; j < gRanksRanks.length; j++) {
                    if (rank <= parseInt(gRanksRanks[j])) {
                        span.style.color = '#' + gRanksColors[j];
                        break;
                    }
                }
            }

            if (name.className.indexOf('inactive') !== -1) {
                if (!config.GalaxyRanks.inactives) span.style.color = window.getComputedStyle(name).color;
                inactiveList[newName] = name.className.indexOf('longinactive') === -1;

                if (rank < 800 && (doNotSpy === null || !doNotSpy[gal][sys][planet])) {
                    spyNeeded.push(row);
                }
            }

            if (infos_scripts.GalaxyRanks) name.parentNode.appendChild(span);

            if (infos_scripts.EasyTarget) {
                if (storage.players[newName] === undefined) {
                    changed = true;
                    storage.players[newName] = [
                        [],
                        []
                    ];
                }
                if (storage.players[newName][0].indexOf(position) === -1) {
                    if (changedPlayers.indexOf(newName) === -1) changedPlayers.push(newName);
                    changed = true;
                    storage.players[newName][0].push(position);
                }
                if (lune && storage.players[newName][1].indexOf(position) === -1) {
                    if (changedMoons.indexOf(newName) === -1) changedMoons.push(newName);
                    changed = true;
                    storage.players[newName][1].push(position);
                }
                if (!lune && storage.players[newName][1].indexOf(position) !== -1) {
                    changed = true;
                    storage.players[newName][1].splice(storage.players[newName][1].indexOf(position), 1);
                }
            }
        } else {
            if (infos_scripts.EasyTarget && storage.universe[position] !== undefined) {
                changed = true;
                storage.players[storedName][0].splice(storage.players[storedName][0].indexOf(position), 1);
                if (storage.players[storedName][1].indexOf(position) !== -1)
                    storage.players[storedName][1].splice(storage.players[storedName][1].indexOf(position), 1);
                delete storage.universe[position];
            }
        }

        if ((infos_scripts.EasyTarget || infos_scripts.Markit) && name !== undefined) {
            var div = null;
            if (infos_scripts.EasyTarget) {
                get_dom_xpath("//body", document, 0).appendChild(build_node("script", ["type"], ["text/javascript"],
                    "$(document).ready(function(){\nsetTimeout(function(){\n$('.tooltip').tooltip(" +
                    "{width: 'auto', height: 'auto', fontcolor: '#FFF', bordercolor: '#666',padding: '5px', bgcolor: '#111', fontsize: '10px'});\n}, 10);\n}); "
                ));
                var html = "<div><span style='color:#FFCC33'>Locations :</span><br />";
                var loc = storage.players[newName][0];
                for (j = 0; j < loc.length; j++) {
                    var space = (j < 9) ? "&nbsp" : "";
                    html += (j + 1) + space + " : " + loc[j];
                    if (storage.players[newName][1].indexOf(loc[j]) !== -1) html += " (L)";
                    html += "<br />";
                }
                div = build_node("div", ["style", "id"], ["display:none;", "divToolTip"], "");
                document.getElementsByTagName("body")[0].appendChild(div);
                div = build_node("div", ['style', 'id'], ['display:none', 'data_tooltip_' + i], html);
                document.getElementsByTagName("body")[0].appendChild(div);
            }
            div = build_node('a', ['class', 'id', 'style'], ['tooltip', 'tooltip_' + i, 'float:left; width:15px;'], "");
            var img = build_node('img', ['src', 'id'], ['http://i.imgur.com/vCZBxno.png', 'img_' + (i + 1)], "");
            div.appendChild(img);
            if (infos_scripts.EasyTarget) {
                var insertee = name.parentNode.parentNode;
                var insert = document.createElement('div');
                for (j = 0; j < storage.players[newName][0].length; j++) {
                    var element = document.createElement('a');
                    element.innerHTML = storage.players[newName][0][j];
                    if (element.innerHTML === position) element.style.color = '#7595EB';
                    if (storage.players[newName][1].indexOf(storage.players[newName][0][j]) !== -1) element.innerHTML += " (L)";
                    element.id = 'target_' + (i + 1) + '_' + (j + 1);
                    element.style.margin = '10px 10px 0px 10px';
                    element.style.textAlign = 'left';
                    element.style.float = 'left';
                    insert.appendChild(element);
                }
                insert.style.clear = 'both';
                insert.style.display = 'none';
                insertee.appendChild(insert);

                // We found our target!
                if (targetPlanet === i + 1) {
                    name.parentNode.parentNode.style.backgroundColor = 'rgba(0, 100, 0, .8)';
                    if (infos_scripts.Markit && markit[position] !== undefined) {
                        // This person is also marked. Show the marking after a second.
                        (function (sum, name) {
                            setTimeout(function () {
                                var ploc = sum.substring(0, sum.indexOf(':', sum.indexOf(':') + 1) + 1);
                                ploc += targetPlanet;
                                var c = hexToRgb('#' + config.Markit.color[markit[ploc]]);
                                if (name !== undefined) {
                                    c.a = 0.5;
                                    animateBackground(rows[targetPlanet - 1], c, 600);
                                }
                            }, 1000);
                        })(position, name);
                    }
                }
            }

            row.childNodes[15].appendChild(div);

            // Add the target for Markit
            if (infos_scripts.Markit) {
                $('#img_' + (i + 1)).click(function() {
                    window.onkeyup = function(e) {
                        var key = e.keyCode ? e.keyCode : e.which;
                        if (key === 27) {
                            $('#markit_choose').fadeOut(750);
                        }
                    };
                    var gal = galaxySelector[0].value;
                    var sys = document.getElementsByName('system')[0].value;
                    var planet = this.id.substring(this.id.indexOf('_') + 1);
                    var loc = gal + ':' + sys + ':' + planet;
                    $('#markit_current').html(planet);
                    if (markit[loc] !== undefined) $('#' + markit[loc])[0].checked = 'checked';
                    else $('#default')[0].checked = 'checked';
                    $('#markit_choose').fadeIn(500);
                });
            }

            // If EasyTarget is enabled, show/hide locations when
            // clicking on the div
            if (infos_scripts.EasyTarget) {
                for (j = 1; j < 14; j += 2) {
                    $(row.childNodes[j]).click(function() {
                        var kid = this.parentNode.childNodes[this.parentNode.childNodes.length - 1];
                        if (kid.style.display === 'block') {
                            kid.style.display = 'none';
                        } else {
                            kid.style.display = 'block';
                        }
                    });
                }

                // Go to the correct system when clicking on a location
                for (j = 0; j < storage.players[newName][0].length; j++) {
                    (function(i, j, name) {
                        $('#target_' + (i + 1) + '_' + (j + 1)).click(function() {
                            var coords = this.innerHTML;
                            coords = coords.replace(" (L)", "");
                            var gal = galaxySelector[0].value;
                            var sys = document.getElementsByName('system')[0].value;
                            targetPlanet = easyTargetRedirect(gal + ":" + sys + ":" + targetPlanet, coords, rows, name, infos_scripts, markit);
                        });
                    })(i, j, name);
                }
            }
        }
    }

    if (!isNaN(sfmLen) && sfmLen >= 0)
    {
        if (spyNeeded.length === 0) {
            GM_setValue("autoSpyLength", sfmLen - 1);
            if (sfmLen > 0)
                setTimeout(function() {
                    document.getElementsByName('systemRight')[0].click();
                }, Math.random() * 200 + (spyForMe ? 300 : 400));
        }

        for (i = 0; i < spyNeeded.length; i++) {
            row = spyNeeded[i];
            var last = i === spyNeeded.length - 1;
            (function(row, last, i) {
                setTimeout(function () {
                    var element = row.childNodes[15].childNodes[1];
                    if (element !== undefined) {
                        var title = element.getAttribute('title');
                        if (title === 'Spy') {
                            element.click();
                        }
                    }
                    if (last) {
                        GM_setValue("autoSpyLength", sfmLen - 1);
                        if (sfmLen > 0)
                            setTimeout(function() {
                                document.getElementsByName('systemRight')[0].click();
                            }, Math.random() * 300);
                    }
                }, i * (spyForMe ? 300 : 300));
            }(row, last, i));
        }
    }

    var len = build_node("input", ["type", "id", "size",], ["text", "autoSpyLength", "5"]);
    var goBox = build_node("input", ["type"], ["submit"], "", "click", function() {
        var num = $("#autoSpyLength").val();
        GM_setValue("autoSpyLength", num);

    });
    var inputDiv = $(".galaxy_float100")[0];
    inputDiv.append(len);
    inputDiv.append(goBox);

    // If we've added entries for a player, sort
    // the coordinates before storing them
    for (i = 0; i < changedPlayers.length; i++) {
        storage.players[changedPlayers[i]][0].sort(galaxySort);
    }

    for (i = 0; i < changedMoons.length; i++) {
        storage.players[changedMoons[i]][1].sort(galaxySort);
    }

    // Only write the potentially massive text file if we need to
    // TODO: Separate into smaller chunks?
    if (infos_scripts.EasyTarget && changed) {
        GM_setValue("galaxy_data_" + uni, JSON.stringify(storage));
    }
    GM_setValue('InactiveList_' + uni, JSON.stringify(inactiveList));
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
    var a1 = parseInt(a.substring(0, 1)),
        b1 = parseInt(b.substring(0, 1));
    if (a1 !== b1) {
        return a1 - b1;
    } else {
        a = a.substring(2);
        b = b.substring(2);
        a1 = parseInt(a.substring(0, a.indexOf(":")));
        b1 = parseInt(b.substring(0, b.indexOf(":")));
        if (a1 !== b1) {
            return a1 - b1;
        } else {
            a = a.substring(a.indexOf(":") + 1);
            b = b.substring(b.indexOf(":") + 1);
            return (parseInt(a) - parseInt(b));
        }
    }
}

/**
 * Transitions us to the given new coordinates and highlights the
 * desired planet. Is now smart enough to know not to reload a page
 * if the planet is in the same system.
 *
 * @param oldCoords
 * @param newCoords
 * @param rows - Array of rows containing the planets in the current system
 * @param name - TODO
 * @param infos_scripts - The current script settings
 * @param markit - the script markit data
 * @returns {string}
 */
function easyTargetRedirect(oldCoords, newCoords, rows, name, infos_scripts, markit) {
    var oldTemp = oldCoords;
    var oldGal = oldCoords.substring(0, oldCoords.indexOf(":"));
    oldTemp = oldTemp.substring(oldCoords.indexOf(":") + 1);
    var oldSys = oldTemp.substring(0, oldTemp.indexOf(":"));
    var oldPlanet = oldTemp.substring(oldTemp.lastIndexOf(":") + 1);

    var newTemp = newCoords;
    var newGal = newCoords.substring(0, newCoords.indexOf(":"));
    newTemp = newTemp.substring(newCoords.indexOf(":") + 1);
    var newSys = newTemp.substring(0, newTemp.indexOf(":"));
    var newPlanet = newTemp.substring(newTemp.lastIndexOf(":") + 1);

    if (newGal === oldGal && newSys === oldSys) {
        if (infos_scripts.Markit && markit[newCoords] !== undefined) {
            setTimeout(function() {
                var c = hexToRgb('#' + config.Markit.color[markit[newCoords]]);
                c.a = 0.5;
                if (name !== undefined) {
                    animateBackground(rows[newPlanet - 1], c, 600);
                }
            }, 1000);
        }
        if (infos_scripts.Markit && markit[oldCoords] !== undefined) {
            // Check to see if we need to overwrite a markit color
            var c = hexToRgb('#' + config.Markit.color[markit[oldCoords]]);
            c.a = 0.5;
            if (name !== undefined) {
                animateBackground(rows[oldPlanet - 1], c, 600);
            }
        } else if (oldPlanet % 2 === 0) {
            // Otherwise fill it in with its default color
            animateBackground(rows[oldPlanet - 1], "#111111", 200);
        } else if (parseInt(oldPlanet) !== -1) {
            animateBackground(rows[oldPlanet - 1], { r: 17, g: 17, b: 17, a: 0.0 }, 200);
        }
        // Mark the next target green
        animateBackground(rows[parseInt(newPlanet) - 1], { r: 0, g: 100, b: 0, a: 0.8}, 200);

        return newPlanet;
    } else {
        // Redirect, save the magic values in storage so
        // we know our state after a refresh
        localStorage.EasyTargetRedirect = JSON.stringify({
            'g': -1,
            's': -1,
            'planet': newPlanet,
            'redirect': 1
        });
        $('#galaxy')[0].value = newGal;
        document.getElementsByName('system')[0].value = newSys;
        document.forms['galaxy_form'].submit();
    }
}

/**
 * Returns whether we should disable autocomplete for the given page
 * @param p - the page
 * @returns {boolean}
 */
function auto_complete_selected(p) {
    var pages = config.NoAutoComplete;
    if (pages[p]) return true;
    else if (pages.sims && p.indexOf('sim') !== -1) {
        return true
    }
    return false;
}

// Disable autocomplete on all qualifying input fields
if (infos_scripts.NoAutoComplete && auto_complete_selected(page)) {
    elements = document.getElementsByTagName('input');
    for (i = 0; i < elements.length; i++) {
        elements[i].setAttribute('autocomplete', 'off');
    }
}

if (can_load_in_page("AllinDeut") && infos_scripts.AllinDeut) {
    loadAllinDeut();
}

/**
 * Show how much research/buildings cost in al deut
 */
function loadAllinDeut() {
    var xpath_pages = {
        "buildings": "//div[@class='buildings_1b']/div[@class='buildings_1b1'][3]",
        "research": "//div[@class='research_1b']/div[@class='research_1b1'][3]"
    };
    var regMetal_pages = {
        "buildings": new RegExp(L_.AllinDeut_metal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>"),
        "research": new RegExp(L_.AllinDeut_metal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>")
    };
    var regCrystal_pages = {
        "buildings": new RegExp(L_.AllinDeut_crystal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>"),
        "research": new RegExp(L_.AllinDeut_crystal +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>")
    };
    var regDeut_pages = {
        "buildings": new RegExp(L_.AllinDeut_deuterium +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>"),
        "research": new RegExp(L_.AllinDeut_deuterium +
            "\\s:\\s<font\\s.{15}>([^<]*)</font>")
    };
    var separator_pages = {
        "buildings": ".",
        "research": "."
    };

    var doms = get_dom_xpath(xpath_pages[page], document, -1);
    var inDeut = 0;
    for (var i = 0; i < doms.length; i++) {
        inDeut = 0;
        if (regMetal_pages[page].test(doms[i].innerHTML)) inDeut +=
            get_nb_from_stringtab(regMetal_pages[page].exec(doms[i].innerHTML)[1].split(
                separator_pages[page])) / 4;
        if (regCrystal_pages[page].test(doms[i].innerHTML)) inDeut +=
            get_nb_from_stringtab(regCrystal_pages[page].exec(doms[i].innerHTML)[1].split(
                separator_pages[page])) / 2;
        if (regDeut_pages[page].test(doms[i].innerHTML)) inDeut +=
            get_nb_from_stringtab(regDeut_pages[page].exec(doms[i].innerHTML)[1].split(
                separator_pages[page]));
        doms[i].appendChild(build_node("div", [], [],
            "<font color='lime'>AllinDeut</font> : " + get_slashed_nb("" +
            parseFloat(inDeut))));
    }

}

if (can_load_in_page("iFly") && infos_scripts.iFly) {
    loadiFly();
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
    while (document.getElementById("data_tooltip_" + i) !== null) {
        ressources = document.getElementById("data_tooltip_" + i).getElementsByTagName(
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
        " : " + get_slashed_nb(equivalent_deut_total) + "</div>";
    document.getElementById("data_tooltip_10000").appendChild(build_node("div", [], [],
        html));
}

if (can_load_in_page("TChatty") && infos_scripts.TChatty) {
    loadTChatty()
}

/**
 * Improved chat
 */
function loadTChatty() {
    var color = config.TChatty.color;
    var toolbar = get_dom_xpath("//div[@class='toolbar']", document, 0);
    var send = document.getElementById("send");
    var message = document.getElementById("message");
    toolbar.removeChild(document.getElementById("chat_couleur"));
    document.getElementsByTagName("head")[0].appendChild(build_node("script", [
        "src", "type"
    ], [scripts_scripts + "jscolor/jscolor.js", "text/javascript"], ""));

    toolbar.innerHTML = '<input class="color" id="jscolorid" value="' + color +
        '">' + toolbar.innerHTML;
    message.cols = 90;
    message.id = "message2";
    toolbar.innerHTML +=
        ' <textarea  id="message" style="display:none" name="message"></textarea>';
    //Correction ToolBar
    toolbar.innerHTML = toolbar.innerHTML.replace(/'message'/g, "'message2'");
    //Correction Smileys
    var smileys = document.getElementById('smiley').getElementsByTagName('img');
    for (var i = 0; i < smileys.length; i++) {
        smileys[i].addEventListener('click', function(e) {
            document.getElementById("message2").value += this.alt;
            document.getElementById("message").value = "[color=#" + document.getElementById(
                'jscolorid').value + "]" + document.getElementById("message2").value +
                "[/color]";
        }, false);
    }
    var jscolorid = document.getElementById("jscolorid");
    jscolorid.addEventListener("click", function() {
        document.getElementById("jscolor_box").addEventListener("mouseout",
            function() {
                config.TChatty.color = document.getElementById("jscolorid").value;
                GM_setValue("config_scripts_uni_" + uni, JSON.stringify(config));
            }, false);
    }, false);

    var textarea = document.getElementById("message2");
    textarea.addEventListener('keyup', function(e) {
        reg = new RegExp("\[[0-9]+\:[0-9]+\:[0-9]+\]", "gi");
        this.value = this.value.replace(reg, "[x:xxx:x]");
        if (this.value.length > 232) this.value = this.value.substring(0, 232); //¨La limite de 255 - la place que les balises colors prennent
        if (this.value.charAt(0) !== "/" && this.value !== "") {
            document.getElementById("message").value = "[color=#" + document.getElementById(
                'jscolorid').value + "]" + this.value + "[/color]";
        } else {
            document.getElementById("message").value = this.value;
        }
        if (e.keyCode === 13) {
            this.value = "";
            if (navigator.userAgent.indexOf("Firefox") !== -1) {
                document.getElementById("send").click();
            }
        }
    }, false);
    send.addEventListener('click', function(e) {
        document.getElementById("message2").value = "";
    }, false);
}

if (infos_scripts.More) {
    loadMore();
}

if (page === "fleet") {
    saveFleetPage();
}

/**
 * Autoattack handler, as well as defining some
 * keyboard shortcuts
 */
function saveFleetPage() {
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 77) {
            $('#transport').click();
            $('input[type=submit]')[0].click();
        } else if (key == 78) {
            $('#nextplanet').click();
        } else if (key == 80) {
            $('#previousplanet').click();
        } else if (key == 68) {
            $('#allin').click();
        }
    }
    var locData = JSON.stringify(window.location);
    GM_setValue("savedFleet", locData);
    var mc = $('#ship217');
    if (mc[0])
        mc[0].focus();

    if (autoAttack) {
        var waves = 0;
        try {
            waves = parseInt(GM_getValue("AutoAttackWaves"));
        } catch (ex) {
            waves = 0;
        }

        if (waves !== 0 && !isNaN(waves))
        {
            var regx = /[a-z ]+([0-9]+)[on ]+([0-9]+)/;
            var x = regx.exec(document.getElementsByClassName("flotte_header_left")[0].innerHTML);
            var fleetOut = parseInt(x[1]);
            var fleetMax = parseInt(x[2]);
            if (fleetOut + waves > fleetMax) {
                //alert("Not enough waves free!");
                GM_deleteValue("AutoAttackMC");
                GM_deleteValue("AutoAttackWaves");
                GM_setValue("AutoAttackIndex", -1);
                var div = document.createElement("div");
                div.style.color = "Red";
                div.style.fontWeight = "bold";
                div.style.fontSize = "14pt";
                div.innerHTML = "Not enough fleets, retrying in 30 seconds";
                $("#main").prepend(div);
                // Wait 30 seconds and try again
                for (var i = 1; i <= 30; i++) {
                    setTimeout(function(i) {
                        $("#main").children()[0].innerHTML = "Not enough fleets, retrying in " + (30 - i) + " seconds";
                        if (i === 30) {
                            GM_setValue("redirToSpy", "1");
                            window.location.href = "messages.php?mode=show?messcat=0";
                        }
                    }, i * 1000, i);
                }
                return;
            }
            var ships = 0;
            try {
                ships = parseInt(GM_getValue("AutoAttackMC"));
            } catch (ex) {
                ships = 0;
            }

            var dotted = mc.parent().parent().children()[1].childNodes[0].innerHTML.replace(/\./g, "");
            var max = parseInt(dotted);
            if (max < ships) {
                alert("Not enough ships! \n" + max + " available, need " + ships);
                GM_deleteValue("AutoAttackMC");
                GM_deleteValue("AutoAttackWaves");
            } else {
                mc.val(ships);
                GM_setValue("AutoAttackWaves", waves - 1);
                GM_setValue("AutoAttackMC", Math.ceil((ships / 2) / 1000000) * 1000000);
                setTimeout(function() {
                    $('input[type=submit]')[0].click()
                }, Math.random() * 100);
            }
        } else {
            GM_deleteValue("AutoAttackMC");
            GM_deleteValue("AutoAttackWaves");
        }
    }
}

if (page === "floten1") {
    continueAttack();
}

/**
 * More autoattack and keyboard shortcuts
 */
function continueAttack() {
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 78) {
            $('.flotte_2_4 a')[0].click();
            $('input[type=submit]')[0].click();
        }
    }
    if (autoAttack && parseInt(GM_getValue("AutoAttackIndex")) >= 0) {
        setTimeout(function() {
            $('input[type=submit]')[0].click()
        }, Math.random() * 100);
    }
}

if (page === "floten2") {
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key === 65) {
            $('.flotte_bas .space a')[3].click();
        } else if (key === 68) {
            $('input[type=text]').val('');
            $('.flotte_bas .space a')[2].click();
        } else if (key === 83) {
            $('input[type=submit]')[0].click();
        }
    }
    sendAttack();
}

function sendAttack() {
    if (autoAttack && parseInt(GM_getValue("AutoAttackIndex")) >= 0) {
        setTimeout(function() {
            $('input[type=submit]')[0].click()
        }, Math.random() * 100);
    }
}

/**
 * Entry point for loading the scripts located under the "more" config category
 */
function loadMore() {
    if (can_load_in_page("More_moonsList") && config.More.moonsList) {
        var options = document.getElementById("changeplanet").getElementsByTagName("option");
        for (i = 0; i < options.length; i++)
            if (/(\(M\))|(\(L\))/.test(options[i].innerHTML)) options[i].style.color =
                "SteelBlue";
    }

    // More conversion options on the merchant page
    if (can_load_in_page("More_convertDeut") && config.More.convertDeut) {
        if (document.getElementById('marchand_suba') !== null) {

            var a = document.getElementById("marchand_suba").getElementsByTagName("a");
            var script = "";
            for (i = 0; i < a.length; i++)
                script += a[i].getAttribute("onclick");
            div = build_node("div", [], [], L_["More_convertInto"] +
                ' : <a style="color:#F2A10A" id="allMetal" href="javascript:" onclick="' + script +
                'document.getElementById(\'metal2\').checked=\'checked\'; calcul();">' +
                "metal" +
                '</a> | <a style="color:#55BBFF" id="allCryst" href="javascript:" onclick="' + script +
                'document.getElementById(\'cristal2\').checked=\'checked\'; calcul();">' +
                L_["More_crystal"] +
                '</a> | <a style="color:#7BE654" id="allDeut" href="javascript:" onclick="' + script +
                'document.getElementById(\'deut2\').checked=\'checked\'; calcul();">' +
                L_["More_deuterium"] + '</a>');
            document.getElementById("marchand_suba").parentNode.insertBefore(div, document.getElementById(
                "marchand_suba"));
            if (GM_getValue('ResourceRedirect') !== 0) {
                GM_setValue('ResourceRedirectRef', GM_getValue('ResourceRedirect'));
                GM_setValue('ResourceRedirect', 1);

                var merchantItem = GM_getValue("MerchantItem");
                console.log(merchantItem);
                GM_deleteValue("MerchantItem");
                if (merchantItem) {
                    GM_deleteValue("MerchantItem");
                    console.log(merchantItem);
                    $("input[value='" + MerchantMap[merchantItem] + "']").prop("checked", true);
                    $(":submit")[1].click();
                } else {
                    var type = parseInt(GM_getValue('ResourceRedirectType'));
                    if (type === 0) $('#allMetal').click();
                    else if (type === 1) $('#allCryst').click();
                    else $('#allDeut').click();
                    document.forms[1].submit();
                }
            }
        } else {
            if (GM_getValue('ResourceRedirect') === 1) {
                GM_setValue('ResourceRedirect', 0);
                window.location = GM_getValue('ResourceRedirectRef');
            }
        }
    }

    // Translator?
    if (can_load_in_page("More_traductor") && config.More.traductor) {
        function to_translate(word, lang1, lang2) {
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
                //text = text.replace(/<span class=b>(.*)<\/span>/g, "<b>$1</b>"); text = text.replace(/<span class=u>(.*)<\/span>/g, "<u>$1</u>"); text = text.replace(/<span class=i>(.*)<\/span>/g, "<em>$1</em>");
                html =
                    "<div style='background-color:black; opacity:0.8; border:1px solid white; color:white; padding:5px;'>" +
                    text + "</div>";
                document.getElementById("gm_traductionofword").innerHTML = html;
            }
        }
        html1 = "<option style='background:url(\"" + scripts_icons +
            "Traductor/FR.png\") no-repeat; text-align:right;' value='fr'>FR</option>";
        html2 = "<option style='background:url(\"" + scripts_icons +
            "Traductor/EN.png\") no-repeat; text-align:right;' value='en'>EN</option>";
        html = "<option style='background:url(\"" + scripts_icons +
            "Traductor/DE.png\") no-repeat; text-align:right;' value='de'>DE</option>";
        html += "<option style='background:url(\"" + scripts_icons +
            "Traductor/ES.png\") no-repeat; text-align:right;' value='es'>ES</option>";
        html += "<option style='background:url(\"" + scripts_icons +
            "Traductor/IT.png\") no-repeat; text-align:right;' value='it'>IT</option>";
        if (lang === "en") {
            select1 = build_node("select", ["id", "style"], ["gm_lang1",
                "height:18px;"
            ], html1 + html2);
            select2 = build_node("select", ["id", "style"], ["gm_lang2",
                "height:18px;"
            ], html2 + html1);
        } else {
            select1 = build_node("select", ["id", "style"], ["gm_lang1",
                "height:18px;"
            ], html2 + html1);
            select2 = build_node("select", ["id", "style"], ["gm_lang2",
                "height:18px;"
            ], html1 + html2);
        }
        input = build_node("img", ["type", "src", "style"], ["submit",
            scripts_icons + "Traductor/GO.png",
            "float:right;height:18px;cursor:pointer"
        ], "", "click", function() {
            to_translate(document.getElementById("gm_wordtotranslate").value,
                document.getElementById("gm_lang1").value, document.getElementById(
                    "gm_lang2").value);
        });
        div = build_node("div", ["id", "style"], ["gm_traduction",
                "background-color:black; padding:0 0 1px 2px; position:fixed; bottom:1px; right:1px; "
            ],
            "<input id='gm_wordtotranslate' type='text' style='width:80px;height:9px;'/>"
        );
        div.appendChild(select1);
        div.appendChild(select2);
        div2 = build_node("div", ["id"], ["gm_traductionofword"], "");
        div.appendChild(input);
        document.getElementsByTagName("body")[0].appendChild(div2);
        document.getElementsByTagName("body")[0].appendChild(div);
    }

    // Select production percentage for all resources
    if (can_load_in_page("More_resources") && config.More.resources) {
        html = "<div class='ressources_sub1a' style='float:left'>" + L_[
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
        var div = build_node("div", ["class"], [
            "space0 ressources_font_little ressources_bordert"
        ], html);
        document.getElementById("main").insertBefore(div, document.getElementsByClassName(
            "space0 ressources_font_little ressources_bordert")[0]);
    }

    // Quickly return to the main fleet page after sending an attack, and remember
    // the previous coordinates
    if (can_load_in_page("More_redirectFleet") && config.More.redirectFleet) {
        window.onload = function() {
            var fullLoc = false;
            var loc = null;
            try {
                loc = JSON.parse(GM_getValue("savedFleet"));
                if (loc !== null)
                    fullLoc = true;
            } catch (ex) {
                fullLoc = false;
            }

            if (autoAttack && parseInt(GM_getValue("AutoAttackWaves")) === 0) {
                GM_deleteValue("AutoAttackWaves");
                GM_deleteValue("AutoAttackMC");
                GM_setValue("redirToSpy", "1");
                window.location.href = "messages.php?mode=show?messcat=0";
            } else if (fullLoc)
                window.location.href = loc.href;
            else
                window.location.href = "fleet.php";
        };
    }

    // Make return fleets transparent in the overview
    if (can_load_in_page("More_returns") && config.More.returns) {
        var returns = document.getElementsByClassName('curvedtot return');
        for (i = 0; i < returns.length; i++)
            returns[i].style.opacity = "0.6";
    }

    // Make the arrows larger
    if (can_load_in_page("More_arrows") && config.More.arrows) {
        document.getElementById("previousplanet").value = "<<<<<<br><<<<<";
        document.getElementById("nextplanet").value = ">>>>>";
    }
}
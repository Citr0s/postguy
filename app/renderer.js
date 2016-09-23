/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*globals require, ace, Vue*/
	(function () {
	  "use strict";

	  __webpack_require__(10);
	  __webpack_require__(11);

	  var ipc = __webpack_require__(2).ipcRenderer;
	  var theme = 'github';
	  var ace = __webpack_require__(15);
	  var helpers = __webpack_require__(5);
	  var submitButton = document.getElementById('submit');
	  var submitLoader = document.getElementsByClassName('spacer')[0];
	  var requestEditor = ace.setupEditor('requestEditor');
	  var responseEditor = ace.setupEditor('responseEditor', true);

	  console.logJson = function (object) {
	    console.log(helpers.formatJson(object));
	  };

	  var vm = new Vue({
	    el: '#app',
	    data: {
	      submitting: false,
	      themes: __webpack_require__(16),
	      editorTheme: 'monokai',
	      logs: [],
	      message: 'NotPostman',
	      sidebarSelection: 'history',
	      collections: {},
	      currentTabIndex: 0,
	      statusDetails: '',
	      timeTaken: 0,
	      timeTakenTemp: 0,
	      tabs: [{
	        newHeader: {},
	        request: {
	          verb: 'get',
	          headers: [{
	            attribute: 'Content-Type',
	            value: 'application/json'
	          },
	            {
	              attribute: 'Authorization',
	              value: 'Basic QXV0b1RyYWRlcjp5UlZTbmQ0Tko5cEt2UHJn'
	            }],
	          url: 'http://services.localiis/api/helloworld',
	          body: '',
	          displayValue: ''
	        },
	        response: {
	          error: {},
	          response: {},
	          body: {},
	          displayValue: ''
	        }
	      }]
	    },
	    computed: {
	      headers: function () {
	        return this.currentTab.request.headers.reduce(function (result, item) {
	          result[item.attribute] = item.value;
	          return result;
	        }, {});
	      },
	      disableSubmit: function () {
	        return this.currentTab.request.url && !this.submitting;
	      },
	      currentTab: {
	        get: function () {
	          return this.tabs[this.currentTabIndex];
	        },
	        set: function (data) {
	          this.tabs[this.currentTabIndex] = data;
	        }
	      },
	      requestEditor: {
	        get: function () {
	          return requestEditor.getValue();
	        },
	        set: function (data) {
	          requestEditor.setValue(data);
	        }
	      },
	      responseEditor: {
	        get: function () {
	          return responseEditor.getValue();
	        },
	        set: function (data) {
	          responseEditor.setValue(data);
	        }
	      }
	    },
	    methods: {
	      themeEditor: function (theme) {
	        requestEditor.setTheme('ace/theme/' + theme);
	        responseEditor.setTheme('ace/theme/' + theme);
	      },
	      post: function () {
	        if (!this.currentTab.request.url) return;
	        this.submitting = true;
	        this.currentTab.request.displayValue = this.requestEditor;
	        this.currentTab.request.body = this.currentTab.request.displayValue;
	        this.requestEditor = helpers.formatJson(this.currentTab.request.displayValue);
	        this.responseEditor = '{}';
	        this.timeTakenTemp = new Date();
	        submitButton.setAttribute('disabled', 'disabled');

	        submitLoader.classList.add('spin');

	        ipc.send('post', {
	          call: this.currentTab.request.verb,
	          request: {
	            headers: this.headers,
	            url: this.currentTab.request.url,
	            body: this.currentTab.request.body
	          }
	        });
	      },
	      loadLoggedRequest: function (index) {
	        var data = helpers.deepClone(this.logs[index]);
	        this.loadTab(data);
	      },
	      loadTab: function (data) {
	        this.currentTab.request = data.request;
	        this.currentTab.request.headers = data.request.headers;
	        this.currentTab.response = data.response;

	        this.requestEditor = helpers.formatJson(this.currentTab.request.body);
	        this.responseEditor = helpers.formatJson(this.currentTab.response.body);
	      },
	      deleteLoggedRequest: function (index) {
	        this.logs.splice(index, 1);
	      },
	      addHeader: function () {
	        if (!this.newHeader.attribute || !this.newHeader.value) return;
	        this.currentTab.request.headers.push(this.newHeader);
	        this.newHeader = {};
	      },
	      removeHeader: function (index) {
	        this.currentTab.request.headers.splice(index, 1);
	      },
	      addTab: function () {
	        this.tabs.push({
	          newHeader: {},
	          request: {
	            verb: 'get',
	            headers: [],
	            url: '',
	            body: '',
	            displayValue: ''
	          },
	          response: {
	            error: {},
	            response: {},
	            body: {},
	            displayValue: ''
	          }
	        });
	        this.currentTabIndex = this.tabs.length - 1;
	      },
	      removeTab: function (index) {
	        this.tabs.splice(index, 1);
	        if (this.tabs.length === 0)
	          this.addTab();
	        this.changeTab(this.tabs.length - 1);
	      },
	      changeTab: function (index) {
	        this.currentTabIndex = index;
	        this.currentTab.request.body = this.requestEditor;
	        this.requestEditor = this.currentTab.request.body || '{}';
	        this.responseEditor = this.currentTab.response.body || '{}';
	      }
	    }
	  });

	  ipc.on('reply', function (event, arg) {
	    vm.timeTaken = new Date() - vm.timeTakenTemp;
	    vm.submitting = false;
	    vm.currentTab.response = arg;
	    vm.statusDetails = arg.response;
	    submitButton.removeAttribute('disabled');

	    submitLoader.classList.remove('spin');

	    vm.logs.push({
	      request: helpers.deepClone(vm.currentTab.request),
	      response: helpers.deepClone(vm.currentTab.response)
	    });

	    var responseMessage = "";
	    if (vm.currentTab.response.error) {
	      responseMessage = helpers.formatJson(vm.currentTab.response);
	    } else {
	        responseMessage = helpers.formatJson(vm.currentTab.response.body);
	    }

	    vm.responseEditor = responseMessage || '{}';
	  });

	  ipc.on('projectLoaded', function (event, arg) {
	    vm.collections = arg;
	    console.logJson(vm.collections);
	  });
	})();


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	var deepClone = (o) => {
	  return JSON.parse(JSON.stringify(o));
	};

	var formatJson = (o) => {
	  if ((typeof o === "object") && (o !== null)) {
	   return JSON.stringify(o, null, 2);
	  }
	  return JSON.stringify(JSON.parse(o), null, 2);
	};

	module.exports = {
	  deepClone: deepClone,
	  formatJson: formatJson
	};


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(12);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(13)();
	// imports


	// module
	exports.push([module.id, ".editor {\n  height: 30rem;\n  border: 1px solid rgba(0, 0, 0, 0.15); }\n\n.editors {\n  width: 100%;\n  display: inline-block; }\n  .editors .requestEditor {\n    width: 50%;\n    height: 70vh; }\n  .editors .responseEditor {\n    width: 50%;\n    height: 70vh; }\n\n#app {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background-color: #333;\n  color: black; }\n\n.sidebar {\n  position: fixed;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 15%;\n  background-color: #343434;\n  border-right: 1px solid #666;\n  color: #fff;\n  z-index: 999; }\n  .sidebar .heading {\n    text-transform: uppercase;\n    height: 5rem;\n    align-content: center;\n    text-align: center;\n    font-size: 1.5rem;\n    background-color: indianred;\n    line-height: 5rem;\n    font-weight: bold;\n    letter-spacing: 5px; }\n  .sidebar .title {\n    width: 100%;\n    text-align: center;\n    padding: 1rem 0;\n    background-color: #333;\n    color: #fff;\n    border: none;\n    padding: 15px;\n    height: 5rem;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.15); }\n\n.page {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 85%;\n  margin-top: 5rem;\n  overflow-x: hidden; }\n\n.topbar {\n  background-color: white;\n  color: #fff;\n  padding: 0.75rem;\n  position: fixed;\n  top: -20px;\n  left: 15%;\n  width: 85%;\n  z-index: 1;\n  font-size: 3rem; }\n\n@media (min-width: 970px) {\n  .topbar .form-group {\n    margin-bottom: 0; } }\n\n.request-properties .request-properties__type-wrapper {\n  width: auto !important; }\n  .request-properties .request-properties__type-wrapper .type-wrapper__field {\n    border: none;\n    box-shadow: none;\n    text-transform: uppercase;\n    font-weight: bold;\n    width: auto; }\n\n.request-properties .request-properties__url-wrapper .url-wrapper__field {\n  border: none;\n  box-shadow: none;\n  border-radius: 0;\n  border-bottom: 1px solid #ccc; }\n  .request-properties .request-properties__url-wrapper .url-wrapper__field:focus {\n    background-color: rgba(0, 0, 0, 0.03);\n    border-bottom: 1px solid indianred; }\n\n.request-properties .request-properties__button-wrapper .button-wrapper__field {\n  border: 1px solid #2472a4;\n  box-shadow: none;\n  background-color: #2980b9;\n  color: #fff;\n  padding: 5px 15px;\n  outline: none; }\n  .request-properties .request-properties__button-wrapper .button-wrapper__field:hover {\n    background-color: #2e8ece; }\n\n.request-properties .request-properties__button-wrapper .status-wrapper__field {\n  border: 1px solid #f1f1f1;\n  background-color: rgba(0, 0, 0, 0.03);\n  box-shadow: none;\n  color: #000;\n  padding: 5px 15px;\n  cursor: default;\n  outline: none; }\n\n.request-properties .request-properties__button-wrapper .time-wrapper__field {\n  border: 1px solid #f1f1f1;\n  background-color: rgba(0, 0, 0, 0.03);\n  box-shadow: none;\n  color: #000;\n  padding: 5px 15px;\n  cursor: default;\n  outline: none; }\n\nbutton[class^=\"_2\"] {\n  border: 1px solid #29b765 !important;\n  background-color: #2ecc71 !important; }\n\nbutton[class^=\"_4\"] {\n  border: 1px solid #dab10d !important;\n  background-color: #f1c40f !important; }\n\nbutton[class^=\"_5\"] {\n  border: 1px solid #e43725 !important;\n  background-color: #e74c3c !important; }\n\n#requestLog {\n  -webkit-padding-start: 0;\n  list-style-type: none;\n  overflow: hidden;\n  margin-top: -0.25rem; }\n\n.loggedRequest {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n  padding: 15px;\n  display: table;\n  width: 100%; }\n  .loggedRequest:hover {\n    background-color: #4d4d4d; }\n\n.loggedRequest #remove {\n  border: none;\n  background-color: transparent;\n  display: table-cell;\n  vertical-align: middle; }\n\n.loggedRequest div {\n  margin-right: 1rem; }\n\n.loggedRequest #url {\n  word-break: break-word;\n  font-size: 1.2rem;\n  display: table-cell;\n  vertical-align: middle;\n  position: relative;\n  left: -30px; }\n\n.loggedRequest #verb {\n  font-size: 1.1rem;\n  font-weight: bolder;\n  color: red;\n  text-transform: uppercase;\n  display: table-cell;\n  vertical-align: middle;\n  position: relative;\n  left: -25px;\n  width: 43px;\n  text-align: center;\n  transform: rotate(-90deg); }\n\n.loggedRequest #verb.get {\n  color: #2ecc71; }\n\n.loggedRequest #verb.post {\n  color: #3498db; }\n\n.loggedRequest #verb.put {\n  color: #9b59b6; }\n\n.loggedRequest #verb.patch {\n  color: #1abc9c; }\n\n.loggedRequest #verb.delete {\n  color: #e74c3c; }\n\n#tabBar {\n  color: #ccc;\n  margin-bottom: 15px; }\n  #tabBar input,\n  #tabBar button {\n    border: none;\n    background-color: transparent;\n    color: rgba(255, 255, 255, 0.3); }\n  #tabBar a {\n    background-color: rgba(0, 0, 0, 0.1); }\n  #tabBar a:hover {\n    background-color: rgba(0, 0, 0, 0.2);\n    border-color: transparent; }\n  #tabBar .active {\n    border-bottom: 1px solid #333; }\n  #tabBar li a {\n    border-left: none; }\n  #tabBar li.active a {\n    border-bottom: none; }\n    #tabBar li.active a:last-of-type {\n      margin-left: 2px; }\n  #tabBar li.active input,\n  #tabBar li.active button {\n    color: white; }\n\n#statusBar {\n  margin: 1rem 0; }\n\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:focus,\n.nav-tabs > li.active > a:hover {\n  border-color: rgba(255, 255, 255, 0.1);\n  background-color: #333 !important; }\n\n.nav-tabs > li > a {\n  border-radius: 0;\n  margin-right: -2px; }\n\n.page #mainPanel {\n  padding: 1rem; }\n\n.nav-tabs {\n  border-bottom-color: rgba(255, 255, 255, 0.1); }\n\n#mainPanel .btn,\n#mainPanel .form-control {\n  color: white;\n  background-color: #333;\n  border: 1px solid rgba(255, 255, 255, 0.2); }\n\n.spacer {\n  color: indianred;\n  font-weight: lighter;\n  font-size: 20px;\n  vertical-align: middle;\n  width: 27px;\n  height: 27px;\n  display: inline-block;\n  text-align: center; }\n  .spacer.spin {\n    animation-delay: 1s;\n    animation-name: spinLoad;\n    animation-duration: 1s;\n    animation-iteration-count: infinite; }\n\n@keyframes spinLoad {\n  from {\n    transform: rotate(0deg);\n    color: red; }\n  to {\n    transform: rotate(360deg); } }\n", ""]);

	// exports


/***/ },
/* 13 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {
	  setupEditor: function (editorName, readOnly) {
	    var editor = ace.edit(editorName);
	    editor.setTheme('ace/theme/monokai');
	    editor.setShowPrintMargin(false);
	    editor.setHighlightActiveLine(true);
	    editor.resize();
	    editor.setBehavioursEnabled(true);
	    var session = editor.getSession();
	    session.setUseWrapMode(true);
	    session.setMode("ace/mode/json");
	    return editor;
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	var themes = [
	  {
	    text: 'Ambiance',
	    value: 'ambiance'
	  }, {
	    text: 'Chrome',
	    value: 'chrome'
	  }, {
	    text: 'Clouds',
	    value: 'clouds'
	  }, {
	    text: 'Clouds Midnight',
	    value: 'clouds_midnight'
	  }, {
	    text: 'Cobalt',
	    value: 'cobalt'
	  }, {
	    text: 'Crimson',
	    value: 'crimson_editor'
	  }, {
	    text: 'Dawn',
	    value: 'dawn'
	  }, {
	    text: 'Dreamweaver',
	    value: 'dreamweaver'
	  }, {
	    text: 'Eclipse',
	    value: 'eclipse'
	  }, {
	    text: 'Github',
	    value: 'github'
	  }, {
	    text: 'Idle Fingers',
	    value: 'idle_fingers'
	  }, {
	    text: 'Kr Theme',
	    value: 'kr_theme'
	  }, {
	    text: 'Merbivore',
	    value: 'merbivore'
	  }, {
	    text: 'Merbivore Soft',
	    value: 'merbivore_soft'
	  }, {
	    text: 'Mono Industrial',
	    value: 'mono_industrial'
	  }, {
	    text: 'Monokai',
	    value: 'monokai'
	  }, {
	    text: 'Solarized Light',
	    value: 'solarized_light'
	  }, {
	    text: 'Solarized Dark',
	    value: 'solarized_dark'
	  }, {
	    text: 'Textmate',
	    value: 'textmate'
	  }, {
	    text: 'Tomorrow',
	    value: 'tomorrow'
	  }, {
	    text: 'Tomorow Night',
	    value: 'tomorrow_night'
	  }, {
	    text: 'Tomorrow Night Blue',
	    value: 'tomorrow_night_blue'
	  }, {
	    text: 'Tomorrow Night Bright',
	    value: 'tomorrow_night_bright'
	  }, {
	    text: 'Tomorrow Night Eighties',
	    value: 'tomorrow_night_eighties'
	  }, {
	    text: 'Twilight',
	    value: 'twilight'
	  }, {
	    text: 'Viberant Ink',
	    value: 'viberant_ink'
	  }, {
	    text: 'Xcode',
	    value: 'xcode'
	  }];

	module.exports = themes;


/***/ }
/******/ ]);
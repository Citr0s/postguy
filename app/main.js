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

	__webpack_require__(1).init();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const {app, BrowserWindow} = __webpack_require__(2);

	const fileStore = __webpack_require__(3);

	let mainWindow;
	let projectDirectory = '';
	let saveHistory = false;

	var loadProject = (root, callback, options) => {
	  if (!callback) {
	    callback = (items) => { return items; };
	  }
	  return fileStore.walk(root, callback, options);
	};

	var createWindow = () => {
	  mainWindow = new BrowserWindow({
	    width: 800,
	    height: 600
	  });
	  mainWindow.loadURL(`file://${__dirname}/index.html`);
	  mainWindow.webContents.executeJavaScript(`
	    var path = require('path');
	    module.paths.push(path.resolve('node_modules'));
	    module.paths.push(path.resolve('../node_modules'));
	    module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
	    module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
	    module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
	    module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
	    path = undefined;
	  `);
	  mainWindow.on('closed', () => {
	    mainWindow = null;
	  });
	  mainWindow.maximize();
	  __webpack_require__(7).init();
	  __webpack_require__(8).init();
	};

	var init = () => {
	  app.on('ready', () => {
	    createWindow();
	  });

	  app.on('window-all-closed', () => {
	    if (process.platform !== 'darwin') {
	      app.quit();
	    }
	  });

	  app.on('activate', () => {
	    if (mainWindow === null) {
	      createWindow();
	    }
	  });
	};

	module.exports = {
	  init: init,
	  mainWindow: mainWindow,
	  projectDirectory: projectDirectory,
	  saveHistory: saveHistory,
	  loadProject: loadProject
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var fs = __webpack_require__(4);
	var helper = __webpack_require__(5);
	var path = __webpack_require__(6);

	var save = (path, name, data) => {
	  var fullpath = `${path}/${name}.json`;
	  var content = helper.formatJson(data);
	  try {
	    fs.outputFileSync(fullpath, content);
	  } catch (err) {
	    return err;
	  }
	};

	var load = (path, name) => {
	  var fullpath = `${path}${name}`;
	  try {
	    return fs.readJsonSync(fullpath);
	  } catch (err) {
	    return err;
	  }
	};

	var remove =(path, name) => {
	  var fullpath = `${path}${name}`;
	  try {
	    fs.removeSync(fullpath);
	  } catch (err) {
	    return err;
	  }
	};

	var walk = (dir) => {
	  var root = {contents:{}};
	  function _walk(dir, parent) {
	      var files = fs.readdirSync(dir);
	      for (var file of files) {
	          var newpath = path.join(dir, file);
	          parent.contents[file] = {
	              name:file
	          };
	          if (fs.statSync(newpath).isDirectory()) {
	              parent.contents[file].contents = {};
	              _walk(newpath, parent.contents[file]);
	          }
	      }
	  }
	  _walk(dir, root);
	  return root;
	};

	module.exports = {
	  save: save,
	  load: load,
	  remove: remove,
	  walk: walk
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("fs-extra");

/***/ },
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
/* 6 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const {Menu, dialog} = __webpack_require__(2);
	var core = __webpack_require__(1);

	const template = [
	  {
	    label: 'File',
	    submenu: [
	      {
	        label: 'Open Project',
	        click(item, focusedWindow) {
	          core.projectDirectory = dialog.showOpenDialog({ properties: ['openDirectory'] });
	          loadProject(core.projectDirectory[0], (fileList) => {
	            mainWindow.webContents.send('projectLoaded', fileList);
	          }, { shortPath: true });
	        }
	      },
	      {
	        label: 'Save History',
	        type: 'checkbox',
	        clicked: true,
	        click(item, focusedWindow) {
	          core.saveHistory = !core.saveHistory;
	        }
	      }
	    ]
	  },
	  {
	    label: 'View',
	    submenu: [
	      {
	        label: 'Reload',
	        accelerator: 'CmdOrCtrl+R',
	        click(item, focusedWindow) {
	          if (focusedWindow) focusedWindow.reload();
	        }
	      },
	      {
	        label: 'Toggle Developer Tools',
	        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
	        click(item, focusedWindow) {
	          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
	        }
	      }]
	  }];

	  module.exports = {
	    init: () => {
	      var menu = Menu.buildFromTemplate(template);
	      Menu.setApplicationMenu(menu);
	    }
	  };


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const {ipcMain} = __webpack_require__(2);

	const request = __webpack_require__(9);
	const fileStore = __webpack_require__(3);
	const helper = __webpack_require__(5);

	var {projectDirectory, saveHistory} = __webpack_require__(1);

	var init = () => {

	  ipcMain.on('post', (event, arg) => {
	    request[arg.call](arg.request, (e, r, b) => {
	      var response = {
	        error: e,
	        response: r,
	        body: b
	      };
	      if (saveHistory) {
	        fileStore.save('history', helper.formatJson(Date.now()), { request: arg, response: response });
	      }
	      event.sender.send('reply', response);
	    });
	  });

	  ipcMain.on('save', (event, arg) => {
	    fileStore.save(projectDirectory, arg.name, arg.data);
	  });

	  ipcMain.on('load', (event, arg) => {
	    var response = fileStore.save(projectDirectory, arg);
	    event.sender.send('loadedFile', response);
	  });

	  ipcMain.on('delete', (event, arg) => {
	    fileStore.save(projectDirectory, arg);
	  });
	};

	module.exports = {
	  init: init
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ }
/******/ ]);
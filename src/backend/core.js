const {app, BrowserWindow} = require('electron');

const fileStore = require('./filestore');

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
  require('./menu').init();
  require('./communication').init();
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

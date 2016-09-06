var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = require('electron').ipcMain;
var request = require('request');
var mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', function () {
  createWindow();
  if (process.env.NODE_ENV !== 'production') {
    require('vue-devtools').install();
    mainWindow.webContents.openDevTools();
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('post', function (event, arg) {
  request[arg.call](arg.request, function (error, response, body) {
    event.sender.send('reply', {
      error: error,
      response:
      response,
      body: body
    });
  });
});
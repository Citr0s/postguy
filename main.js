const electron = require('electron');
const {Menu} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
const request = require('request');
const fileStore = require('./backend/filestore.js')
let mainWindow;

createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  mainWindow.loadURL(`file://${__dirname}/frontend/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.maximize();

  var template = require('./backend/menu.js')();
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  createWindow();
  if (process.env.NODE_ENV !== 'production') {
    // require('vue-devtools').install();
    // mainWindow.webContents.openDevTools();
  }
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

ipc.on('post', (event, arg) => {

  fileStore.save('test/test/test', 'test.json', arg);

  request[arg.call](arg.request, (error, response, body) => {
    event.sender.send('reply', {
      error: error,
      response:
      response,
      body: body
    });
  });
});
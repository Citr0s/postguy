const electron = require('electron');
const {Menu} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
const request = require('request');
const fileStore = require('./backend/filestore.js');
const helper = require('./helpers/helper.js');
const {dialog} = require('electron');
let mainWindow;
let projectDirectory = '';
let saveHistory = false;

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Project',
        click(item, focusedWindow) {
          projectDirectory = dialog.showOpenDialog({ properties: ['openDirectory'] });
          loadProject(projectDirectory[0], (fileList) => {
            mainWindow.webContents.send('projectLoaded', fileList);
          }, { shortPath: true });
        }
      },
      {
        label: 'Save History',
        type: 'checkbox',
        clicked: true,
        click(item, focusedWindow) {
          saveHistory = !saveHistory;
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
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        }
      }]
  }]

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

var loadProject = (root, callback, options) => {

  if (!callback) {
    callback = (items) => { return items; }
  }

  return fileStore.walk(root, callback, options);
}

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

  request[arg.call](arg.request, (error, response, body) => {

    var response = {
      error: error,
      response:
      response,
      body: body
    };

    if (saveHistory) {
      fileStore.save('history', helper.formatJson(Date.now()), { request: arg, response: response });
    }

    event.sender.send('reply', response);
  });
});

ipc.on('save', (event, arg) => {
  fileStore.save(projectDirectory, arg.name, arg.data);
});

ipc.on('load', (event, arg) => {
  var response = fileStore.save(projectDirectory, arg);
  event.sender.send('loadedFile', response);
});

ipc.on('delete', (event, arg) => {
  
  fileStore.save(projectDirectory, arg);

});
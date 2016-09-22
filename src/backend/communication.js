const {ipcMain} = require('electron');

const request = require('request');
const fileStore = require('./filestore');
const helper = require('../helpers/helper');

var {projectDirectory, saveHistory} = require('./core');

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

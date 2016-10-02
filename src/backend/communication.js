const {ipcMain} = require('electron');

const request = require('request');
const fileStore = require('./filestore');
const helper = require('../helpers/helper');

var {projectDirectory, saveHistory} = require('./core');

var init = () => {

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

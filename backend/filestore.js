var fs = require('fs-extra')
var helper = require('../helpers/helper.js');

module.exports = {
  save: (path, name, data) => {
    var fullpath = `${path}/${name}`;
    var content = helper.formatJson(data);
    fs.outputFile(fullpath, content,  (err) => {
      console.log(err);
    })
  },
  load: (path, name) => {
    var fullpath = `${path}${name}`;
    fs.readFile(fullpath, 'utf-8', (error, data) => {
      return {
        error: error,
        data: data
      }
    });
  }
}
var fs = require('fs-extra')
var helper = require('../helpers/helper.js');

module.exports = {
  save: (path, name, data) => {
    var fullpath = `${path}/${name}.json`;
    var content = helper.formatJson(data);

    try {
      fs.outputFileSync(fullpath, content)
    } catch (err) {
      return err;
    }
  },
  load: (path, name) => {
    var fullpath = `${path}${name}`;
    try {
      return fs.readJsonSync(fullpath);
    } catch (err) {
      return err;
    }
  },
  delete: (path, name) => {
    var fullpath = `${path}${name}`;
    try {
      fs.removeSync(fullpath);
    } catch (err) {
      return err;
    }
  },
  walk: (path, callback, options) => {
    var items = [] // files, directories, symlinks, etc
    var fs = require('fs-extra')
    fs.walk(path)
      .on('readable', function () {
        var item
        while ((item = this.read())) {
          if (options && options.shortPath) {
            item.path = item.path.replace(path, '');
          }
          if (item.path !== '')
            items.push(item.path)
        }
      })
      .on('end', function () {
        callback(items);
      })
  }
}
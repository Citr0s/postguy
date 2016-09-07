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
    var retval = {};
    fs.walk(path)
      .on('data', (item) => {

        var itemPath = item.path;
        if (options && options.shortPath) {
          itemPath = itemPath.replace(path, '');
        }

        var arrays = itemPath.split('\\');
        var name = arrays[arrays.length - 1];

        arrays.reduce((o, s) => {
          if (s === '')
            s = 'root';
          if (s !== name) {
            if (o[s]) {
              return o[s];
            }
            return o[s] = { name: name, children: [] };
          }
          return o.children.push({
            name: name
          });
        }, retval)
      })
      .on('end', () => {
        callback(retval);
      })
  }
}
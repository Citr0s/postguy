var fs = require('fs-extra')
var helper = require('../helpers/helper.js');
var path = require('path')

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
  walk: (dir) => {
    var root = {contents:{}}
    function _walk(dir, parent) {
        var files = fs.readdirSync(dir)
        for (file of files) {
            var newpath = path.join(dir, file)
            parent.contents[file] = {
                name:file
            }
            if (fs.statSync(newpath).isDirectory()) {
                parent.contents[file].contents = {}
                _walk(newpath, parent.contents[file])
            }
        }
    }
    _walk(dir, root)
    return root
  }
}
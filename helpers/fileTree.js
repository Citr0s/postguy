function createTree(nodes) {
  var tree = {};
  nodes.forEach(function (item, index) {
    var value = item.split('\\');
    tree[value] = value.reduce(function index(obj, i) {
      if (obj)
        return obj[i]
    })
  });
  return tree;
}

module.exports = {
  createTree: createTree
}
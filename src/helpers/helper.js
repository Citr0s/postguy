var deepClone = (o) => {
  return JSON.parse(JSON.stringify(o));
};

var formatJson = (o) => {
  if ((typeof o === "object") && (o !== null)) {
   return JSON.stringify(o, null, 2);
  }
  return JSON.stringify(JSON.parse(o), null, 2);
};

module.exports = {
  deepClone: deepClone,
  formatJson: formatJson
};

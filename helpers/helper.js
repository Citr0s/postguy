module.exports = {
  deepClone: (o) => {
    return JSON.parse(JSON.stringify(o));
  },
  formatJson: (o) => {
    if ((typeof o === "object") && (Object !== null)) {
     return JSON.stringify(o, null, 2);
    }
    return JSON.stringify(JSON.parse(o), null, 2);
  }
}
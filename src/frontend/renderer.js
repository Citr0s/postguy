/*globals require, ace, Vue*/

"use strict";

Vue.config.silent = false;
Vue.config.devtools = true;

require("./index.html");
require("./sass/main.scss");
// var theme = 'github';
// var preferences = localStorage.getItem("preferences");

const app = require('./App.vue')
const store = require('./Vuex/Store.js');

new Vue({
  el: "#app",
  store,
  ...app
})

// ipc.on('projectLoaded', function (event, arg) {
//   vm.collections = arg;
//   console.logJson(vm.collections);
// });

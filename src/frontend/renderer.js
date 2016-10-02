/*globals require, ace, Vue*/

"use strict";

Vue.config.silent = false;
Vue.config.devtools = true;

const store = require('./Vuex/Store.js');
require("./index.html");
require("./sass/main.scss");
var ipc = require('electron').ipcRenderer;
var theme = 'github';
var helpers = require('../helpers/helper.js');
var appDiv = document.getElementById('app');
var submitButton = document.getElementById('submit');
var submitLoader = document.getElementsByClassName('spacer')[0];
var preferences = localStorage.getItem("preferences");

console.logJson = function (object) {
  console.log(helpers.formatJson(object));
};

var vm = new Vue({
  el: '#app',
  store,
  computed: {
    disableSubmit () {
      return this.currentTab.request.url && !this.submitting;
    },
    ...Vuex.mapState({
      tabs: store => store.TabModule.tabs,
      currentTabIndex: store => store.TabModule.currentTabIndex,
      statusDetails: store => store.statusDetails,
      timeTaken: store => store.timeTaken,
      lightTheme: store => store.lightTheme,
      message: store => store.message,
      sidebarSelection: store => store.sidebarSelection,
      logs: store => store.logs,
      submitting: store => store.submitting
    }),
    ...Vuex.mapGetters(['currentTab'])
  },
  methods: {
    // themeEditor: function (theme) {
    //   requestEditor.setTheme('ace/theme/' + theme);
    //   responseEditor.setTheme('ace/theme/' + theme);
    // },
    post: function () {
      if (!this.currentTab.request.url) return;
      this.submitting = true;
      // this.currentTab.request.displayValue = this.requestEditor;
      this.currentTab.request.body = this.currentTab.request.displayValue;
      // this.requestEditor = helpers.formatJson(this.currentTab.request.displayValue);
      this.responseEditor = '{}';
      this.timeTakenTemp = new Date();
      submitButton.setAttribute('disabled', 'disabled');

      submitLoader.classList.add('spin');

      ipc.send('post', {
        call: this.currentTab.request.verb,
        request: {
          headers: this.headers,
          url: this.currentTab.request.url,
          body: this.currentTab.request.body
        }
      });
    },
    loadLoggedRequest: function (index) {
      var data = helpers.deepClone(this.logs[index]);
      this.loadTab(data);
    },
    loadTab: function (data) {
      this.currentTab.request = data.request;
      this.currentTab.request.headers = data.request.headers;
      this.currentTab.response = data.response;

      // this.requestEditor = helpers.formatJson(this.currentTab.request.body);
      this.responseEditor = helpers.formatJson(this.currentTab.response.body);
    },
    deleteLoggedRequest: function (index) {
      this.logs.splice(index, 1);
    },
    toggleLightMode: function() {
      vm.lightTheme = !vm.lightTheme;
    },
    updateURL (e) {
      this.$store.commit('UPDATE_URL', { tab: this.currentTab, newurl: e.target.value });
    }
  },
  components: {
    "MainPanelComponent": require('./MainPanelComponent.vue'),
    "TabBarComponent": require('./TabBarComponent.vue')
  }
});

ipc.on('reply', function (event, arg) {
  vm.timeTaken = new Date() - vm.timeTakenTemp;
  vm.submitting = false;
  vm.currentTab.response = arg;
  vm.statusDetails = arg.response;
  vm.statusDetails.responseSize = arg.response.headers['content-length'];

  submitButton.removeAttribute('disabled');

  submitLoader.classList.remove('spin');

  vm.logs.push({
    request: helpers.deepClone(vm.currentTab.request),
    response: helpers.deepClone(vm.currentTab.response)
  });

  var responseMessage = "";
  if (vm.currentTab.response.error) {
    responseMessage = helpers.formatJson(vm.currentTab.response);
  } else {
      responseMessage = helpers.formatJson(vm.currentTab.response.body);
  }

  vm.responseEditor = responseMessage || '{}';
});

ipc.on('projectLoaded', function (event, arg) {
  vm.collections = arg;
  console.logJson(vm.collections);
});

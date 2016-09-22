/*globals require, ace, Vue*/
(function () {
  "use strict";

  require("./index.html");
  require("./sass/main.scss");

  var ipc = require('electron').ipcRenderer;
  var theme = 'github';
  var ace = require('./ace.js');
  var helpers = require('../helpers/helper.js');
  var submitButton = document.getElementById('submit');
  var submitLoader = document.getElementsByClassName('spacer')[0];
  var requestEditor = ace.setupEditor('requestEditor');
  var responseEditor = ace.setupEditor('responseEditor', true);

  console.logJson = function (object) {
    console.log(helpers.formatJson(object));
  };

  var vm = new Vue({
    el: '#app',
    data: {
      submitting: false,
      themes: require('./themes.js'),
      editorTheme: 'monokai',
      logs: [],
      message: 'NotPostman',
      sidebarSelection: 'history',
      collections: {},
      currentTabIndex: 0,
      statusDetails: '',
      timeTaken: 0,
      timeTakenTemp: 0,
      tabs: [{
        newHeader: {},
        request: {
          verb: 'get',
          headers: [{
            attribute: 'Content-Type',
            value: 'application/json'
          },
            {
              attribute: 'Authorization',
              value: 'Basic QXV0b1RyYWRlcjp5UlZTbmQ0Tko5cEt2UHJn'
            }],
          url: 'http://services.localiis/api/helloworld',
          body: '',
          displayValue: ''
        },
        response: {
          error: {},
          response: {},
          body: {},
          displayValue: ''
        }
      }]
    },
    computed: {
      headers: function () {
        return this.currentTab.request.headers.reduce(function (result, item) {
          result[item.attribute] = item.value;
          return result;
        }, {});
      },
      disableSubmit: function () {
        return this.currentTab.request.url && !this.submitting;
      },
      currentTab: {
        get: function () {
          return this.tabs[this.currentTabIndex];
        },
        set: function (data) {
          this.tabs[this.currentTabIndex] = data;
        }
      },
      requestEditor: {
        get: function () {
          return requestEditor.getValue();
        },
        set: function (data) {
          requestEditor.setValue(data);
        }
      },
      responseEditor: {
        get: function () {
          return responseEditor.getValue();
        },
        set: function (data) {
          responseEditor.setValue(data);
        }
      }
    },
    methods: {
      themeEditor: function (theme) {
        requestEditor.setTheme('ace/theme/' + theme);
        responseEditor.setTheme('ace/theme/' + theme);
      },
      post: function () {
        if (!this.currentTab.request.url) return;
        this.submitting = true;
        this.currentTab.request.displayValue = this.requestEditor;
        this.currentTab.request.body = this.currentTab.request.displayValue;
        this.requestEditor = helpers.formatJson(this.currentTab.request.displayValue);
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

        this.requestEditor = helpers.formatJson(this.currentTab.request.body);
        this.responseEditor = helpers.formatJson(this.currentTab.response.body);
      },
      deleteLoggedRequest: function (index) {
        this.logs.splice(index, 1);
      },
      addHeader: function () {
        if (!this.newHeader.attribute || !this.newHeader.value) return;
        this.currentTab.request.headers.push(this.newHeader);
        this.newHeader = {};
      },
      removeHeader: function (index) {
        this.currentTab.request.headers.splice(index, 1);
      },
      addTab: function () {
        this.tabs.push({
          newHeader: {},
          request: {
            verb: 'get',
            headers: [],
            url: '',
            body: '',
            displayValue: ''
          },
          response: {
            error: {},
            response: {},
            body: {},
            displayValue: ''
          }
        });
        this.currentTabIndex = this.tabs.length - 1;
      },
      removeTab: function (index) {
        this.tabs.splice(index, 1);
        if (this.tabs.length === 0)
          this.addTab();
        this.changeTab(this.tabs.length - 1);
      },
      changeTab: function (index) {
        this.currentTabIndex = index;
        this.currentTab.request.body = this.requestEditor;
        this.requestEditor = this.currentTab.request.body || '{}';
        this.responseEditor = this.currentTab.response.body || '{}';
      }
    }
  });

  ipc.on('reply', function (event, arg) {
    vm.timeTaken = new Date() - vm.timeTakenTemp;
    vm.submitting = false;
    vm.currentTab.response = arg;
    vm.statusDetails = arg.response;
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
})();

/*globals require, ace, Vue*/
(function () {
  "use strict";

  var ipc = require('electron').ipcRenderer;
  var theme = 'github';
  var ace = require('./ace.js');
  var helpers = require('../helpers/helper.js');
  var fileTree = require('../helpers/fileTree.js');

  var requestEditor = ace.setupEditor('requestEditor');
  var responseEditor = ace.setupEditor('responseEditor', true);
  console.logJson = function (object) {
    console.log(helpers.formatJson(object));
  }

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
        this.currentTab.request.displayValue = requestEditor.getValue();
        this.currentTab.request.body = this.currentTab.request.displayValue;
        requestEditor.setValue(helpers.formatJson(this.currentTab.request.displayValue));
        responseEditor.setValue('{}');
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
        this.currentTab.request.headers = this.currentTab.request.headers;

        this.response = data.response;
        requestEditor.setValue(helpers.formatJson(this.currentTab.request.displayValue));
        responseEditor.setValue(helpers.formatJson(this.currentTab.response.displayValue));
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
      },
      removeTab: function (index) {
        this.tabs.splice(index, 1);
        if (this.tabs.length === 0)
          this.addTab();
      },
      changeTab: function (index) {
        this.currentTab.request.displayValue = requestEditor.getValue();
        this.currentTabIndex = index;
        requestEditor.setValue(this.currentTab.request.displayValue || '{}');
        responseEditor.setValue(this.currentTab.response.displayValue || '{}');
      }
    }
  });

  ipc.on('reply', function (event, arg) {
    vm.submitting = false;
    vm.currentTab.response = arg;

    vm.logs.push({
      request: helpers.deepClone(vm.currentTab.request),
      response: helpers.deepClone(vm.currentTab.response)
    });

    if (vm.currentTab.response.error) {
      responseEditor.setValue(helpers.formatJson(vm.currentTab.response) || '{}');
    } else {
      responseEditor.setValue(helpers.formatJson(vm.currentTab.response.body) || '{}');
    }

    vm.currentTab.response.displayValue = responseEditor.getValue();
  });

  ipc.on('projectLoaded', function (event, arg) {
    vm.collections = arg;
  });
})();
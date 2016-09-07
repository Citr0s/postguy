/*globals require, ace, Vue*/
(function () {
  "use strict";

  var ipc = require('electron').ipcRenderer;
  var theme = 'github';
  var ace = require('./ace.js'); 
  var helpers = require('../helpers/helper.js');

  var requestEditor = ace.setupEditor('requestEditor');
  var responseEditor = ace.setupEditor('responseEditor', true);

  var vm = new Vue({
    el: '#app',
    data: {
      submitting: false,
      themes: require('./themes.js'),
      editorTheme: 'monokai',
      logs: [],
      message: 'NotPostman',
      sidebarSelection: 'history',
      currentTabIndex: 0,
      tabs: [{
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
      }]
    },
    computed: {
      headers: function () {
        return this.tabs[this.currentTabIndex].request.headers.reduce(function (result, item) {
          result[item.attribute] = item.value;
          return result;
        }, {});
      },
      disableSubmit: function () {
        return this.tabs[this.currentTabIndex].request.url && !this.submitting;
      }
    },
    methods: {
      themeEditor: function (theme) {
        requestEditor.setTheme('ace/theme/' + theme);
        responseEditor.setTheme('ace/theme/' + theme);
      },
      post: function () {
        if (!this.tabs[this.currentTabIndex].request.url) return;
        this.submitting = true;
        this.tabs[this.currentTabIndex].request.displayValue = requestEditor.getValue();
        this.tabs[this.currentTabIndex].request.body = this.tabs[this.currentTabIndex].request.displayValue;
        requestEditor.setValue(helpers.formatJson(this.tabs[this.currentTabIndex].request.displayValue));
        responseEditor.setValue('{}');
        ipc.send('post', {
          call: this.tabs[this.currentTabIndex].request.verb,
          request: {
            headers: this.headers,
            url: this.tabs[this.currentTabIndex].request.url,
            body: this.tabs[this.currentTabIndex].request.body
          }
        });
      },
      loadLoggedRequest: function (index) {
        this.tabs[this.currentTabIndex].request = helpers.deepClone(this.logs[index]).request;
        this.tabs[this.currentTabIndex].request.headers = this.tabs[this.currentTabIndex].request.headers;
        this.response = helpers.deepClone(this.logs[index]).response;
        requestEditor.setValue(helpers.formatJson(this.tabs[this.currentTabIndex].request.displayValue));
        responseEditor.setValue(helpers.formatJson(this.tabs[this.currentTabIndex].response.displayValue));
      },
      deleteLoggedRequest: function (index) {
        this.logs.splice(index, 1);
      },
      addHeader: function () {
        if (!this.newHeader.attribute || !this.newHeader.value) return;
        this.tabs[this.currentTabIndex].request.headers.push(this.newHeader);
        this.newHeader = {};
      },
      removeHeader: function (index) {
        this.tabs[this.currentTabIndex].request.headers.splice(index, 1);
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
        this.tabs[this.currentTabIndex].request.displayValue = requestEditor.getValue();
        this.currentTabIndex = index;
        requestEditor.setValue(this.tabs[this.currentTabIndex].request.displayValue || '{}');
        responseEditor.setValue(this.tabs[this.currentTabIndex].response.displayValue || '{}');
      }      
    }
  });

  ipc.on('reply', function (event, arg) {
    vm.submitting = false;
    vm.tabs[vm.currentTabIndex].response = arg;

    vm.logs.push({
      request: helpers.deepClone(vm.tabs[vm.currentTabIndex].request),
      response: helpers.deepClone(vm.tabs[vm.currentTabIndex].response)
    });

    if (vm.tabs[vm.currentTabIndex].response.error) {
      responseEditor.setValue(helpers.formatJson(vm.tabs[vm.currentTabIndex].response) || '{}');
    } else {
      responseEditor.setValue(helpers.formatJson(vm.tabs[vm.currentTabIndex].response.body) || '{}');
    }

    vm.tabs[vm.currentTabIndex].response.displayValue = responseEditor.getValue();
  });
})();
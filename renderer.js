/*globals require, ace, Vue*/
(function () {
  "use strict";

  var ipc = require('electron').ipcRenderer;
  var theme = 'github';
  var requestEditor = ace.edit("requestEditor");
  var responseEditor = ace.edit("responseEditor");

  function setupEditors() {
    requestEditor.setTheme('ace/theme/' + vm.editorTheme);
    requestEditor.getSession().setMode("ace/mode/json");
    requestEditor.setShowPrintMargin(false);
    requestEditor.setHighlightActiveLine(true);
    requestEditor.resize();
    requestEditor.setBehavioursEnabled(true);
    requestEditor.getSession().setUseWrapMode(true);
    requestEditor.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false,
      onLoad: function (_editor) {
        _editor.$blockScrolling = 1;
      }
    });

    responseEditor.setTheme('ace/theme/' + vm.editorTheme);
    responseEditor.getSession().setMode("ace/mode/json");
    responseEditor.setShowPrintMargin(false);
    responseEditor.setHighlightActiveLine(true);
    responseEditor.resize();
    responseEditor.setBehavioursEnabled(true);
    responseEditor.getSession().setUseWrapMode(true);
    responseEditor.setOptions({
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false,
      onLoad: function (_editor) {
        _editor.$blockScrolling = 1;
      }
    });
  }

  var vm = new Vue({
    el: '#app',
    data: {
      submitting: false,
      themes: [
        {
          text: 'Ambiance',
          value: 'ambiance'
        }, {
          text: 'Chrome',
          value: 'chrome'
        }, {
          text: 'Clouds',
          value: 'clouds'
        }, {
          text: 'Clouds Midnight',
          value: 'clouds_midnight'
        }, {
          text: 'Cobalt',
          value: 'cobalt'
        }, {
          text: 'Crimson',
          value: 'crimson_editor'
        }, {
          text: 'Dawn',
          value: 'dawn'
        }, {
          text: 'Dreamweaver',
          value: 'dreamweaver'
        }, {
          text: 'Eclipse',
          value: 'eclipse'
        }, {
          text: 'Github',
          value: 'github'
        }, {
          text: 'Idle Fingers',
          value: 'idle_fingers'
        }, {
          text: 'Kr Theme',
          value: 'kr_theme'
        }, {
          text: 'Merbivore',
          value: 'merbivore'
        }, {
          text: 'Merbivore Soft',
          value: 'merbivore_soft'
        }, {
          text: 'Mono Industrial',
          value: 'mono_industrial'
        }, {
          text: 'Monokai',
          value: 'monokai'
        }, {
          text: 'Solarized Light',
          value: 'solarized_light'
        }, {
          text: 'Solarized Dark',
          value: 'solarized_dark'
        }, {
          text: 'Textmate',
          value: 'textmate'
        }, {
          text: 'Tomorrow',
          value: 'tomorrow'
        }, {
          text: 'Tomorow Night',
          value: 'tomorrow_night'
        }, {
          text: 'Tomorrow Night Blue',
          value: 'tomorrow_night_blue'
        }, {
          text: 'Tomorrow Night Bright',
          value: 'tomorrow_night_bright'
        }, {
          text: 'Tomorrow Night Eighties',
          value: 'tomorrow_night_eighties'
        }, {
          text: 'Twilight',
          value: 'twilight'
        }, {
          text: 'Viberant Ink',
          value: 'viberant_ink'
        }, {
          text: 'Xcode',
          value: 'xcode'
        }],
      editorTheme: 'monokai',
      logs: [],
      message: 'NotPostman',
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
        requestEditor.setValue(formatJson(this.tabs[this.currentTabIndex].request.displayValue));
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
        this.tabs[this.currentTabIndex].request = deepClone(this.logs[index]).request;
        this.tabs[this.currentTabIndex].request.headers = this.tabs[this.currentTabIndex].request.headers;
        this.response = deepClone(this.logs[index]).response;
        requestEditor.setValue(formatJson(this.tabs[this.currentTabIndex].request.displayValue));
        responseEditor.setValue(formatJson(this.tabs[this.currentTabIndex].response.displayValue));
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
      request: deepClone(vm.tabs[vm.currentTabIndex].request),
      response: deepClone(vm.tabs[vm.currentTabIndex].response)
    });

    if (vm.tabs[vm.currentTabIndex].response.error) {
      responseEditor.setValue(formatJson(vm.tabs[vm.currentTabIndex].response) || '{}');
    } else {
      responseEditor.setValue(formatJson(vm.tabs[vm.currentTabIndex].response.body) || '{}');
    }

    vm.tabs[vm.currentTabIndex].response.displayValue = responseEditor.getValue();
  });

  function deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function formatJson(o) {
    return JSON.stringify(JSON.parse(o), null, 2);
  }

  setupEditors();
})();
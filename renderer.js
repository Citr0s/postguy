// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';

const ipc = require('electron').ipcRenderer;
const theme = 'github';
const requestEditor = ace.edit("requestEditor");
const responseEditor = ace.edit("responseEditor");
var setupEditors = () => {
  requestEditor.setTheme('ace/theme/' + vm.editorTheme);
  requestEditor.getSession().setMode("ace/mode/json");
  requestEditor.setShowPrintMargin(false);
  requestEditor.setHighlightActiveLine(true);
  requestEditor.resize();
  requestEditor.setBehavioursEnabled(true);
  requestEditor.getSession().setUseWrapMode(true);
  responseEditor.setTheme('ace/theme/' + vm.editorTheme);
  responseEditor.getSession().setMode("ace/mode/json");
  responseEditor.setShowPrintMargin(false);
  responseEditor.setHighlightActiveLine(true);
  responseEditor.resize();
  requestEditor.setBehavioursEnabled(true);
  requestEditor.getSession().setUseWrapMode(true);
};
const vm = new Vue({
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
    message: 'Postguy',
    currentTabIndex: 0,
    tabs: []
  },
  computed: {
    headers: () => {
      return vm.tabs[vm.currentTabIndex].request.headers.reduce((result, item) => {
        result[item.attribute] = item.value;
        return result;
      }, {});
    },
    disableSubmit: () => {
      return vm.tabs[vm.currentTabIndex].request.url && !vm.submitting;
    },
    currentTab: {
      get: () => {
        console.log("getting currentTab")
        return vm.tabs[vm.currentTabIndex];
      },
      // setter
      set: (newValue) => {
        vm.tabs[vm.currentTabIndex] = newValue;
      }
    }
  },
  methods: {
    themeEditor: (theme) => {
      requestEditor.setTheme('ace/theme/' + theme);
      responseEditor.setTheme('ace/theme/' + theme);
    },
    post: () => {
      if (!vm.tabs[vm.currentTabIndex].request.url) return;
      vm.submitting = true;
      vm.tabs[vm.currentTabIndex].request.displayValue = requestEditor.getValue();
      vm.tabs[vm.currentTabIndex].request.body = vm.tabs[vm.currentTabIndex].request.displayValue;
      requestEditor.setValue(formatJson(vm.tabs[vm.currentTabIndex].request.displayValue));
      responseEditor.setValue('{}');
      ipc.send('post', {
        call: vm.tabs[vm.currentTabIndex].request.verb,
        request: {
          headers: vm.headers,
          url: vm.tabs[vm.currentTabIndex].request.url,
          body: vm.tabs[vm.currentTabIndex].request.body
        }
      });
    },
    loadLoggedRequest: (index) => {
      vm.tabs[vm.currentTabIndex].request = deepClone(vm.logs[index]).request;
      vm.tabs[vm.currentTabIndex].request.headers = vm.tabs[vm.currentTabIndex].request.headers;
      vm.response = deepClone(vm.logs[index]).response;
      requestEditor.setValue(formatJson(vm.tabs[vm.currentTabIndex].request.displayValue));
      responseEditor.setValue(formatJson(vm.tabs[vm.currentTabIndex].response.displayValue));
    },
    addHeader: () => {
      if (!vm.newHeader.attribute || !vm.newHeader.value) return;
      vm.tabs[vm.currentTabIndex].request.headers.push(vm.newHeader);
      vm.newHeader = {};
    },
    removeHeader: (index) => {
      vm.tabs[vm.currentTabIndex].request.headers.splice(index, 1);
    },
    addTab: () => {
      vm.tabs.push({
        newHeader: {},
        request: {
          verb: '',
          headers: [{
            attribute: 'content-type',
            value: 'application/json; charset=utf-8'
          }, {
              attribute: '',
              value: ''
            }],
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
    removeTab: (index) => {
      vm.tabs.splice(index, 1);
    },
    changeTab: (index) => {
      vm.tabs[vm.currentTabIndex].request.displayValue = requestEditor.getValue();
      vm.currentTabIndex = index;
      requestEditor.setValue(vm.tabs[vm.currentTabIndex].request.displayValue || `{}`);
      responseEditor.setValue(vm.tabs[vm.currentTabIndex].response.displayValue || `{}`);
    }
  }
});
ipc.on('reply', (event, arg) => {
  vm.submitting = false;
  vm.response = arg;
  vm.logs.push({
    request: deepClone(vm.tabs[vm.currentTabIndex].request),
    response: deepClone(vm.response)
  });
  if (vm.response.error) {
    responseEditor.setValue(formatJson(vm.response) || '{}');
  } else {
    responseEditor.setValue(formatJson(vm.response.body) || '{}');
  }
  vm.tabs[vm.currentTabIndex].response.displayValue = responseEditor.getValue();
});
var deepClone = (o) => {
  return JSON.parse(JSON.stringify(o));
};
var formatJson = (o) => {
  return JSON.stringify(JSON.parse(o), null, 2);
};
setupEditors();
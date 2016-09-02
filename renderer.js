// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer;
const theme = 'github';
const requestEditor = ace.edit("requestEditor");
const responseEditor = ace.edit("responseEditor");
var setupEditors = () => {
  requestEditor.setTheme(`ace/theme/${vm.editorTheme}`);
  requestEditor.getSession().setMode("ace/mode/json");
  requestEditor.setShowPrintMargin(false);
  requestEditor.setHighlightActiveLine(true);
  requestEditor.resize();
  requestEditor.setBehavioursEnabled(true);
  requestEditor.getSession().setUseWrapMode(true);
  responseEditor.setTheme(`ace/theme/${vm.editorTheme}`);
  responseEditor.getSession().setMode("ace/mode/json");
  responseEditor.setShowPrintMargin(false);
  responseEditor.setHighlightActiveLine(true);
  responseEditor.resize();
  requestEditor.setBehavioursEnabled(true);
  requestEditor.getSession().setUseWrapMode(true);
};
var vm = new Vue({
  el: '#app'
  , data: {
    submitting: false
    , themes: [
      {
        text: 'Ambiance'
        , value: 'ambiance'
      }
      , {
        text: 'Chrome'
        , value: 'chrome'
      }
      , {
        text: 'Clouds'
        , value: 'clouds'
      }
      , {
        text: 'Clouds Midnight'
        , value: 'clouds_midnight'
      }
      , {
        text: 'Cobalt'
        , value: 'cobalt'
      }
      , {
        text: 'Crimson'
        , value: 'crimson_editor'
      }
      , {
        text: 'Dawn'
        , value: 'dawn'
      }
      , {
        text: 'Dreamweaver'
        , value: 'dreamweaver'
      }
      , {
        text: 'Eclipse'
        , value: 'eclipse'
      }
      , {
        text: 'Github'
        , value: 'github'
      }
      , {
        text: 'Idle Fingers'
        , value: 'idle_fingers'
      }
      , {
        text: 'Kr Theme'
        , value: 'kr_theme'
      }
      , {
        text: 'Merbivore'
        , value: 'merbivore'
      }
      , {
        text: 'Merbivore Soft'
        , value: 'merbivore_soft'
      }
      , {
        text: 'Mono Industrial'
        , value: 'mono_industrial'
      }
      , {
        text: 'Monokai'
        , value: 'monokai'
      }
      , {
        text: 'Solarized Light'
        , value: 'solarized_light'
      }
      , {
        text: 'Solarized Dark'
        , value: 'solarized_dark'
      }
      , {
        text: 'Textmate'
        , value: 'textmate'
      }
      , {
        text: 'Tomorrow'
        , value: 'tomorrow'
      }
      , {
        text: 'Tomorow Night'
        , value: 'tomorrow_night'
      }
      , {
        text: 'Tomorrow Night Blue'
        , value: 'tomorrow_night_blue'
      }
      , {
        text: 'Tomorrow Night Bright'
        , value: 'tomorrow_night_bright'
      }
      , {
        text: 'Tomorrow Night Eighties'
        , value: 'tomorrow_night_eighties'
      }
      , {
        text: 'Twilight'
        , value: 'twilight'
      }
      , {
        text: 'Viberant Ink'
        , value: 'viberant_ink'
      }
      , {
        text: 'Xcode'
        , value: 'xcode'
      }
      ]
    , editorTheme: 'monokai'
    , message: 'Postguy'
    , newHeader: {}
    , logs: []
    , request: {
      verb: ''
      , headers: [
        {
          attribute: 'content-type'
          , value: 'application/json; charset=utf-8'
        }
        , {
          attribute: 'Authorization'
          , value: 'Basic QXV0b1RyYWRlcjp5UlZTbmQ0Tko5cEt2UHJn'
        }
      ]
      , url: ''
      , body: ''
    , }
    , response: {
      error: {}
      , response: {}
      , body: {}
    }
  }
  , computed: {
    headers: () => {
      return vm.request.headers.reduce((result, item) => {
        result[item.attribute] = item.value;
        return result;
      }, {});
    }
    , disableSubmit: () => {
      return vm.request.url && !vm.submitting;
    }
  }
  , methods: {
    themeEditor: (theme) => {
      requestEditor.setTheme(`ace/theme/${theme}`);
      responseEditor.setTheme(`ace/theme/${theme}`);
    }
    , post: () => {
      if (!vm.request.url) return;
      vm.submitting = true;
      vm.request.body = requestEditor.getValue();
      requestEditor.setValue(formatJson(vm.request.body));
      responseEditor.setValue(`{}`);
      ipc.send('post', {
        call: vm.request.verb
        , request: {
          headers: vm.headers
          , url: vm.request.url
          , body: vm.request.body
        }
      });
    }
    , loadLoggedRequest: (index) => {
      vm.request = deepClone(vm.logs[index]).request;
      vm.request.headers.$set(vm.request.headers);
      vm.response = deepClone(vm.logs[index]).response;
      requestEditor.setValue(formatJson(vm.request.body));
      responseEditor.setValue(formatJson(vm.response.body));
    }
    , addHeader: () => {
      if (!vm.newHeader.attribute || !vm.newHeader.value) return;
      vm.request.headers.push(vm.newHeader);
      vm.newHeader = {}
    }
    , removeHeader: (index) => {
      vm.request.headers.splice(index, 1);
    }
  }
});
ipc.on('reply', (event, arg) => {
  vm.submitting = false;
  vm.response = arg;
  vm.logs.push({
    request: deepClone(vm.request)
    , response: deepClone(vm.response)
  });
  if (vm.response.error) {
    responseEditor.setValue(formatJson(vm.response) || `{}`);
    return;
  }
  responseEditor.setValue(formatJson(vm.response.body) || `{}`);
});
var deepClone = (o) => {
  return JSON.parse(JSON.stringify(o));
}
var formatJson = (o) => {
  return JSON.stringify(JSON.parse(o), null, 2);
}
setupEditors();

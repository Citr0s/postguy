const rq = require('request-promise');
const _ = require('lodash');
const themes = require('./themes.js');
const TabModule = require('./TabModule.js');
const HistoryModule = require('./HistoryModule.js');

module.exports = new Vuex.Store({
  strict:true,
  state: {
    submitting: false,
    lightTheme: false,
    themes,
    editorTheme: 'monokai',
    message: 'NotPostman',
    sidebarSelection: 'history',
    collections: {}
  },
  actions: {
    requestWithRequest({ commit, getters }, request) {
      const timeBegin = new Date();
      const tab = getters.currentTab;
      rq({
        method: request.method,
        uri: request.url,
        body: request.body,
        resolveWithFullResponse: true
      })
      .then((res) => {
        const timeEnd = new Date();
        commit('UPDATE_RESPONSE', { tab, body: res.body, statusCode: res.statusCode, statusMessage: res.statusMessage, responseSize: res.body.length, timeTaken: timeEnd - timeBegin })
        commit('ADD_HISTORY', { response: _.cloneDeep(tab.response), request: _.cloneDeep(tab.request) });
      })
    }
  },
  modules: {
    TabModule,
    HistoryModule
  }
})

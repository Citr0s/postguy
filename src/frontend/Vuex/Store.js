module.exports = new Vuex.Store({
  state: {
    submitting: false,
    lightTheme: false,
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
      request: {
        verb: 'get',
        headers: [{
          attribute: 'Content-Type',
          value: 'application/json'
        },
        {
          attribute: 'Authorization',
          value: 'Basic QXV0b1RyYWRlcjp5UlZTbmQ0Tko5cEt2UHJn'
        },
        {
          attribute: '',
          value: ''
        }      ],
        url: 'http://google.com',
        body: '',
        displayValue: ''
      },
      response: {
        error: {},
        response: {},
        body: "",
        displayValue: ''
      }
    }]
  },
  mutations: {
    CHANGE_TAB (state, index) {
      state.currentTabIndex = index;
    },
    ADD_TAB (state) {
      state.tabs.push({
        request: {
          verb: 'get',
          headers: [
            {
              attribute: '',
              value: ''
            }
          ],
          url: '',
          body: '',
          displayValue: ''
        },
        response: {
          error: {},
          response: {},
          body: "",
          displayValue: ''
        }
      });
    },
    REMOVE_TAB (state, index) {
      state.tabs.splice(index, 1);
    }
  },
  actions: {
    changeTab ({ commit }, index) {
      commit('CHANGE_TAB', index);
    },
    addTab ({ commit, state }) {
      commit('ADD_TAB');
      commit('CHANGE_TAB', state.tabs.length - 1);
    },
    removeTab({ dispatch, commit, state }, index) {
      commit('REMOVE_TAB', index);
      if (state.tabs.length === 0) {
        dispatch('addTab');
      }
      else if (index === state.tabs.length) {
        dispatch('changeTab', state.tabs.length - 1);
      }
    }
  }
})

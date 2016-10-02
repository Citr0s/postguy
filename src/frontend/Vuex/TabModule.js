const TabModule = {
  state: {
    currentTabIndex: 0,
    tabs: [{
      request: {
        verb: 'post',
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
      },
      response: {
        statusCode: "",
        body: "",
        timeTaken: 0,
        responseSize: 0
      }
    }]
  },
  mutations: {
    LOAD_RESPONSE (state, { tab, response }) {
      tab.response = response;
    },
    LOAD_REQUEST ( state, { tab, request }) {
      tab.request = request;
    },
    UPDATE_RESPONSE (state, { tab, statusCode, body, timeTaken }) {
      tab.response.body = body;
      tab.response.statusCode = statusCode;
      tab.response.timeTaken = timeTaken;
    },
    UPDATE_VERB (state, { request, newverb }) {
      request.verb = newverb
    },
    UPDATE_URL (state, { tab, newurl }) {
      tab.request.url = newurl;
    },
    UPDATE_HEADER_VALUE (state, { header, value }) {
      header.value = value;
    },
    UPDATE_HEADER_ATTRIBUTE (state, { header, attribute }) {
      header.attribute = attribute;
    },
    ADD_HEADER (state, { tab }) {
      tab.request.headers.push({ attribute: '', value: '' });
    },
    REMOVE_HEADER (state, { tab, index }) {
      tab.request.headers.splice(index, 1);
    },
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
        },
        response: {
          statusCode: "",
          body: "",
          timeTaken: 0,
          responseSize: 0
        }
      });
    },
    REMOVE_TAB (state, index) {
      state.tabs.splice(index, 1);
    }
  },
  getters: {
    currentTab: state => state.tabs[state.currentTabIndex],
    noOfTabs: state => state.tabs.length
  },
  actions: {
    updateURL ({ commit, getters }, newurl) {
      commit('UPDATE_URL', { request: getters.currentTab.request, newurl })
    },
    changeTab ({ commit }, index) {
      commit('CHANGE_TAB', index);
    },
    addTab ({ commit, dispatch, state }) {
      commit('ADD_TAB');
      dispatch('changeTab', state.tabs.length - 1);
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
}

module.exports = TabModule;

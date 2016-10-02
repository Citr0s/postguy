module.exports = new Vuex.Store({
  strict:true,
  state: {
    submitting: false,
    lightTheme: false,
    themes: require('./themes.js'),
    editorTheme: 'monokai',
    logs: [],
    message: 'NotPostman',
    sidebarSelection: 'history',
    collections: {},
    statusDetails: '',
    timeTaken: 0,
    timeTakenTemp: 0,
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    'TabModule': require('./TabModule.js')
  }
})

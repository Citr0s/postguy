let store = {
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
}

module.exports = { store }
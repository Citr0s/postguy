var webpackConfig = require('./webpack.config.js')
delete webpackConfig.entry

// karma.conf.js
module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    reporters: ['mocha'],
    // this is the entry file for all our tests.
    files: [
      './node_modules/phantomjs-polyfill-includes/includes-polyfill.js',
      './node_modules/es6-promise/dist/es6-promise.auto.js',
      'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vue/2.0.1/vue.js',
      'https://cdnjs.cloudflare.com/ajax/libs/vuex/2.0.0/vuex.js',
      'src/tests.js'
      ],
    // we will pass the entry file to webpack for bundling.
    preprocessors: {
      'src/tests.js': ['webpack']
    },
    // use the webpack config
    webpack: webpackConfig,
    // avoid walls of useless text
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true
  })
}

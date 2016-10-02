var nodeExternals = require('webpack-node-externals');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    renderer: './src/frontend/renderer.js',
    main: './src/backend/main.js'
  },
  output: {
    path:'./app',
    filename: '[name].js',
    pathinfo: true
  },
  node: {
    __dirname: false,
    __filename: false
  },
  target: 'electron',
  module: { 
    loaders: [
      { test: /\.html/, loader: 'file?name=[name].[ext]' },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] },
      { test: /\.json$/, loaders: ["json"] },
      { test: /\.vue$/, loaders: ["vue"] },
      { test: /\.js$/, loaders: ["babel"] }
    ]
  },
  externals: [nodeExternals()],
  vue: {
    loaders: {
      scss: 'vue-style!css!sass',
      js: 'babel'
    }
  },
  plugins: [
    // new CleanWebpackPlugin(['app'], {}),
    new CopyWebpackPlugin([ { from: './src/live-package.json', to: './package.json' } ])
  ]
};

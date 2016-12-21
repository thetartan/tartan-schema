'use strict';

var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'tartanSchema',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: {
    // `require('lodash')` should use global var `_`
    lodash: '_',
    tartan: 'tartan'
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.json/, loader: 'json'},

      // Evaluate module.js and bundle pre-calculated exports as a value.
      // This allows to omit package.json from bundle.
      {test: /[\\\/]@package\.js$/, loaders: ['raw', 'val']}
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

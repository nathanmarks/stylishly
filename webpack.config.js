const webpack = require('webpack');
const path = require('path');

module.exports = function () {
  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      js: './index.js'
    },
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'stylishly.min.js',
      libraryTarget: 'umd'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel'
        }
      ]
    },
    resolve: {
      extensions: ['', '.js'],
      modules: [
        path.resolve(__dirname),
        'node_modules'
      ]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
        sourceMap: false
      })
    ]
  };
}

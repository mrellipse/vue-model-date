const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

var config = {
  entry: {
    'vue-model-date': './src/index.ts',
    'vue-model-date.min': './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, '../_bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'vue-model-date',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/,
    })
  ],
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};

module.exports = config;

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV === 'development';

let config = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      // inject: true,
      chunks: ['index'],
      filename: 'index.html',
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/profile.html'),
      // inject: 'body',
      chunks: ['index'],
      filename: 'profile.html',
      minify: false
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },{
      test: /\.(sa|sc|c)ss$/,
      use: [{
        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      },{
        loader: 'css-loader'
      },{
        loader: 'postcss-loader'
      },{
        loader: 'sass-loader',
        options: {
          includePaths: ['./node_modules']
        }
      }]
    },{
      test: /\.html$/,
      loaders: [
        'html-loader'
      ]
    },{
      test: /\.(jpg|png|gif|svg)$/i,
      loaders: [{
        loader: 'file-loader',
        options: {
          name: 'assets/images/[name].[ext]'
        }
      }]
    }]
  },
  devServer: {
    contentBase: './src',
    watchContentBase: true,
    open: true,
    historyApiFallback: true,
    disableHostCheck: true
  }
};
module.exports = config;

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new OptimizeCSSAssets() // call the css optimizer (minification)
  );
  module.exports.plugins.push(
    new CleanWebpackPlugin(['public'])
  );
}

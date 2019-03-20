import { scripts as config } from './tasks/config';

console.log(`======================== ${config.srcRoot}/index.js ========================`);
module.exports = {
  mode: process.env.NODE_ENV ? 'production' : 'development',
  entry: {
    'js/app': `${config.srcRoot}/index.js`,
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
  output: {
    filename: '[name].js',
  },
  devtool: 'source-map',
};

// const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// const NODE_ENV = process.env.NODE_ENV || 'production';

// module.exports = {
//   mode: NODE_ENV,
//   entry: {
//     'assets/js/bundle.js': ['@babel/polyfill', './src/index.tsx'],
//     'assets/js/login.js': ['@babel/polyfill', './src/login.tsx'],
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name]',
//     // chunkFilename: '[name]',
//     publicPath: '/',
//   },
//   optimization: {
//     splitChunks: {
//       cacheGroups: {
//         vendors: false,
//       },
//     },
//   },
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         exclude: /node_modules/,
//         use: ['babel-loader'],
//       },
//       {
//         test: /\.(css|scss)$/,
//         use: [
//           'style-loader',
//           {
//             loader: 'css-loader',
//             options: {
//               modules: true,
//             },
//           },
//           'sass-loader',
//         ],
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.js', '.ts', '.tsx'],
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//       react: path.resolve(__dirname, 'node_modules', 'react'),
//     },
//   },
//   devServer: {
//     historyApiFallback: true,
//     contentBase: path.resolve(__dirname, 'dist/'),
//     hot: true,
//     inline: true,
//     open: true,
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin(),
//     new CleanWebpackPlugin('./dist'),
//     new CopyWebpackPlugin([{ from: 'public', to: '', ignore: ['*.html'] }]),
//     new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ja/),
//     new HtmlWebpackPlugin({
//       template: './public/index.html',
//       filename: 'index.html',
//       chunks: ['assets/js/bundle.js'],
//     }),
//     new HtmlWebpackPlugin({
//       template: './public/login.html',
//       filename: 'login.html',
//       chunks: ['assets/js/login.js'],
//     }),
//     // new BundleAnalyzerPlugin()
//     new webpack.DefinePlugin({
//       'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
//     }),
//   ],
// };

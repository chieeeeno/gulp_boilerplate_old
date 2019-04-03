import { scripts as config } from './tasks/config';

module.exports = {
  mode: process.env.NODE_ENV ? 'production' : 'development',
  entry: {
    'js/app': `${config.srcRoot}/js/index.js`,
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
  output: {
    filename: '[name].js',
  },
  devtool: 'source-map',
};

import { scripts as config } from './tasks/config';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    'js/app': `${config.srcRoot}/ts/index.ts`,
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }, { test: /\.ts$/, use: 'ts-loader' }],
  },
  output: {
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  devtool: 'source-map',
};

// const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './playground/playground.ts',
  output: {
    // path: path.resolve(__dirname, '.playground'),
    filename: '[name].js',
  },
  target: ['node'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      'fs': false,
      'tls': false,
      'net': false,
      'path': require.resolve("path-browserify"),
      'zlib': false,
      'http': false,
      'https': false,
      'stream': false,
      'crypto': false,
    },
  },
  devServer: {
    liveReload: true,
    compress: true,
    port: 3000,
    host: '0.0.0.0',
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './playground/index.html',
      filename: 'index.html',
      // chunks: ['success'],
    }),
  ],
};

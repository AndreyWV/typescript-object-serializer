const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './playground/index.ts',
  output: {
    path: path.resolve(__dirname, '.dist-playground'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'playground.tsconfig.json',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './playground/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 3000,
  },
};

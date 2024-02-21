import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';

const config: Configuration & DevServerConfiguration = {
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

export default config;

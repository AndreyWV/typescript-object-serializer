import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    'main': './src/index.ts',
    'validators': './src/validators/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (module) => {
      if (module.chunk?.name === 'validators') {
        return 'validators/index.js';
      }
      return 'index.js';
    },
    clean: true,
    library: 'typescript-object-serializer',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: "prod.tsconfig.json",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './README.md',
        },
        {
          from: './package.json',
          transform: (input: string | Buffer): string | Buffer => {
            const packageJson = JSON.parse(input.toString());
            packageJson.main = 'index.js';
            packageJson.module = 'index.js';
            packageJson.types = 'index.d.ts';
            return JSON.stringify(packageJson, null, 4);
          },
        },
        {
          from: './validators-package.json',
          to: './validators/package.json',
        },
      ],
    }),
  ],
};

export default config;

import path from 'path';
import { fileURLToPath } from 'url';
import Dotenv from 'dotenv-webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    main: './src/script.js',
    account: './src/account.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/dist/',
  },
  mode: 'production',
  plugins: [
    new Dotenv({
      systemvars: true, // load all system variables as well
      safe: true, // load .env.example (if available) as the default values
      silent: false, // show any warnings
      defaults: false, // load .env.defaults (if available) as the default values
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
      },
    ],
  },
  devtool: 'source-map', // Add source maps for debugging
};

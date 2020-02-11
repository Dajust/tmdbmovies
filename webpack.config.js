const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  Dotenv = require('dotenv-webpack'),
  webpack = require('webpack');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/index.html'),
    inject: 'body'
  }),
  isProduction = process.env.NODE_ENV == 'production';

const config = {
  output: {
    publicPath: '/',
    path: isProduction
      ? path.resolve(__dirname, 'build')
      : path.resolve(__dirname, 'dist'),
    filename: 'scripts/main.js'
  },
  devtool: 'cheap-eval-source-map',

  devServer: {
    port: 3000,
    compress: true,
    historyApiFallback: true
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  plugins: [
    HTMLWebpackPluginConfig,
    new webpack.DefinePlugin({
      NOW_URL: JSON.stringify(process.env.NOW_URL),
      DEPLOY_ENV: JSON.stringify(process.env.DEPLOY_ENV)
    }),
    new Dotenv()
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx|test\.js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|jpeg|gif|png|svg|ttf|eot|woff|woff2|mp3)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: `${isProduction ? '' : './'}assets/[name].[ext]`
          }
        }
      }
    ]
  }
};

module.exports = config;

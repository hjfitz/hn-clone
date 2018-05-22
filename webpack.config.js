require('local-env-var');
const Notifier = require('webpack-build-notifier');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

const output = path.join(__dirname, 'public', 'assets');

const babelConfig = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      targets: {
        browsers: [
          'last 2 versions',
          'ie >= 11',
        ],
      },
    }],
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    ['transform-react-jsx', { pragma: 'h' }],

  ],
};

module.exports = {
  entry: { bundle: ['@babel/polyfill', './src/client/router.jsx'] },
  output: { filename: '[name].js', path: output },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: babelConfig,
      },
    ],
  },
  plugins: [
    new Notifier({ title: `${process.env.SITE_NAME || 'Webpack'}` }),
    // must stringify else the js bundle will evaluate
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        THEME_COLOR: JSON.stringify(process.env.THEME_COLOR),
        SITE_NAME: JSON.stringify(process.env.SITE_NAME),
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
};

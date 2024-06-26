const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const directory = fs.realpathSync(process.cwd())
const resolve = (relativePath) => path.resolve(directory, relativePath)

module.exports = {
  mode: 'development',
  entry: {
    'js': [
      resolve('src/index.tsx')
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  output: {
    pathinfo: true,
    filename: '[name]/bundle.js',
    path: resolve('build'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.[j|t]sx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          'import-glob'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolve('./src/index.html'),
      chunks: ['js']
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'build') }
      ]
    })
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false
      }
    },
    port: 8080,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true
  }
}

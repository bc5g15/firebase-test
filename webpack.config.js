const path = require('path');
const webpack = require('webpack');

const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));

module.exports = {
  entry: {
    index: ['./src/main.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
    libraryTarget: 'var',
    library: 'Battleships'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'index.html'
          }
        }
      },
      {
        test: /\.jpe?g$|\.svg$|\.png$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.(shader|vert|frag|geom)$/i,
        use: 'raw-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'static'),
    proxy: {
      '/static': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/static': '' }
      }
    },
    compress: true,
    port: 8080
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: ['node_modules', 'server', 'static']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isDevServer ? 'development' : 'production')
      }
    })
  ]
};

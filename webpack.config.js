var path = require('path');
var DEBUG = process.env.NODE_ENV !== 'production';

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
  devtool: 'source-map'
};

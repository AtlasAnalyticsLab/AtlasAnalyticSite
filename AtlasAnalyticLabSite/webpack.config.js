const path = require('path');

module.exports = {
  mode: 'development',
  entry: './themes/atlastheme/static/js/atlas.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      // ...
      {
        test: /\.glsl$/,
        use: {
          loader: 'shader-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
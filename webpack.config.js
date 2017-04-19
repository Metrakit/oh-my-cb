var webpack = require("webpack");
module.exports = {
  target: "electron",
  entry: __dirname + '/src/renderer/App',
  plugins: [
    new webpack.LoaderOptionsPlugin({
     options: {
       __vueOptions__: {
           loaders: {
             scss: 'style!css!sass'
           }
       }
     }
   })
  ],
  output: {
    path: __dirname + '/build/',
    filename: 'App.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map'
}

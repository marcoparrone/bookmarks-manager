 const path = require('path');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const { InjectManifest } = require('workbox-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index2.js',
   },
   plugins: [
     // new CleanWebpackPlugin(['build/*']) for < v2 versions of CleanWebpackPlugin
     new CleanWebpackPlugin(),
       /*     new HtmlWebpackPlugin({
       title: 'Production',
     }),*/
     new InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
      // Any other config if needed.
    }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'build'),
   },
 };

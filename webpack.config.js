const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

function optimization(){
   const config = {
      splitChunks: {
         chunks: 'all'
      }   
   }
   if(isProd) {
      config.minimizer = [
         new OptimizeCssAssetsWebpackPlugin(),
         new TerserWebpackPlugin()
      ]
   }
   return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = (extra) => {
   const loader = [
      {
         loader: MiniCssExtractPlugin.loader,
         options: {
            hmr: isDev,
            reloadAll: isDev
         },
      }, 
      'css-loader'
   ];
   if(extra){
      loader.push(extra);
   }

   return loader;
};

module.exports = {
   context: path.resolve(__dirname, 'src'),
   entry: {
      main: ['@babel/polyfill', './index.js']
   },
   output: {
      filename: filename('js'),
      path: path.resolve(__dirname, 'dist')
   },
   optimization : optimization(),
   devServer: {
      port: 4000,
      hot: isDev  
   },
   plugins:[
      new HTMLWebpackPlugin({
         template: './index.html',
         minify: {
            collapseWhitespace: false
         }
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, './src/img'),
               to: path.resolve(__dirname, 'dist/img')
            },
            // {
            //    from: path.resolve(__dirname, './src/fonts'),
            //    to: path.resolve(__dirname, 'dist/fonts')
            // }
         ]
      }),
      new MiniCssExtractPlugin({
         filename: filename('css')
      })
   ],
   module: {
      rules: [
         {
            test: /\.css$/,
            use: cssLoaders()
         },
         {
            test: /\.s[ac]ss$/,
            use: cssLoaders('sass-loader')
         },
         {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: ['file-loader']
         },
         {
            test: /\.(ttf|woff|woff2|eot)$/,
            use: [{
                  loader: "file-loader",
                  options: {
                  name: "[name].[ext]",
                  outputPath: "fonts",
                  }
               }]
         },
         { 
            test: /\.js$/, 
            exclude: /node_modules/, 
            loader: {
               loader: 'babel-loader',
               options: {
                  presets: [
                     '@babel/preset-env'
                  ],
                  plugins: [
                     '@babel/plugin-proposal-class-properties'
                  ]
               }
            } 
         }
      ]
   }

}
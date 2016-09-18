'use strict';
const path=require('path');
const webpack=require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports={
    devtool: 'source-map',
    entry: './dist-client/entry.js',
    output: {
        path: path.join(__dirname, 'dist-web'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('style.css', { allChunks: true }),
    ],
    
    devServer: {
        // contentBase: "./dist-client",
        port: 8888,
        proxy: {
            '/': {
                target: 'http://localhost:9999',
                secure: false,
            },
        },
    },
};


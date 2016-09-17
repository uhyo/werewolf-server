'use strict';
const path=require('path');
const webpack=require('webpack');

module.exports={
    devtool: 'source-map',
    entry: './dist/client/entry.js',
    output: {
        path: path.join(__dirname, 'dist-client'),
        filename: 'bundle.js',
    },
    plugins: [
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


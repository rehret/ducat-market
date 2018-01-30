const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/client/app.ts',

    output: {
        filename: 'ducat-market.bundle.js',
        path: path.resolve(__dirname, './dist/client')
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        silent: true,
                        configFileName: './src/client/tsconfig.json'
                    }
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        exportAsEs6Default: true
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, './src/client/index.html')
        })
    ],

    devtool: 'source-map',

    resolve: {
        extensions: [ '.js', '.ts' ]
    }
};

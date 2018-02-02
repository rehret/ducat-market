const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, './src/client/index.html')
        }),
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                mangle: false
            }
        })
    ],

    devtool: 'source-map',

    resolve: {
        extensions: [ '.js', '.ts' ]
    }
};

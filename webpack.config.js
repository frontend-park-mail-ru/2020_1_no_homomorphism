const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const curHash = '[hash]';

module.exports = {
    context: path.resolve(__dirname, 'static'),
    mode: 'development',
    entry: {
        app: './js/app.js',
    },
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        historyApiFallback: true,
        disableHostCheck: true,
    },
    output: {
        filename: `[name].${curHash}.js`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.scss', '.css'],
        alias: {
            '@': path.resolve(__dirname, 'static'),
            '@models': path.resolve(__dirname, 'static/js/models'),
            '@components': path.resolve(__dirname, 'static/js/components'),
            '@views': path.resolve(__dirname, 'static/js/views'),
            '@controllers': path.resolve(__dirname, 'static/js/controllers'),
            '@libs': path.resolve(__dirname, 'static/js/libs'),
            '@css': path.resolve(__dirname, 'static/css'),
        },
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: !isDev,
            },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
        }),
        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, 'static/sw.js'),
        }),
    ],
    module: {
        rules: [{
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: 'postcss.config.js',
                        },
                    },
                }],
        }, {
            test: /\.xml$/,
            use: [{
                loader: 'fest-webpack-loader',
            }],
        }, {
            test: /\.(png|svg|jpe?g|gif)$/,
            use: [{
                loader: 'file-loader',
            }],
        }, {
            test: /\.(j|t)s$/,
            exclude: /node_modules/,
            loader: ['babel-loader', 'ts-loader'],
        }],
    },
};

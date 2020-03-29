const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const filename = (ext) => {
    console.log('ISDEV' + isDev);
    !isDev ? `[name].[hash].${ext}` : `[name].${ext}`;
};

module.exports = {
    context: path.resolve(__dirname, 'static'),
    mode: 'development',
    entry: {
        app: './js/app.js',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'static'),
            '@views': path.resolve(__dirname, 'static/js/views'),
            '@components': path.resolve(__dirname, 'static/js/components'),
            '@libs': path.resolve(__dirname, 'static/js/libs'),
            '@controllers': path.resolve(__dirname, 'static/js/controllers'),
            '@css': path.resolve(__dirname, 'static/css'),
        },
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev,
            },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    isDev ?
                        'vue-style-loader' :
                        MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.xml$/,
                use: [
                    {
                        loader: 'fest-webpack-loader',
                    },
                ],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },


};

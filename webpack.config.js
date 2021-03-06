const HTMLWebpackPlugin = require('html-webpack-plugin');
const { join } = require('path');
const { HotModuleReplacementPlugin } = require('webpack');


module.exports = {
    mode: 'development',
    entry: join(__dirname, '/src/app.jsx'),
    devtool: 'source-map',
    output: {
        path: join(__dirname, 'build'),
        filename: 'app.bundled.js',
        devtoolLineToLine: true
    },
    devServer: {
        port: 5000,
        hot: true,
        open: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                resolve: { extensions: [".js", ".jsx"] },
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new HTMLWebpackPlugin({
            favicon: join(__dirname, 'BFM_favicon.png'),
            title: 'Band Income Worksheet',
            template: join(__dirname, 'index.html'),
            cache: true,
            showErrors: true
        })
    ]
}

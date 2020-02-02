const path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: ["babel-polyfill", "./src/main/js/index.js"],
    mode: "production",

    devtool: "eval-source-map",

    output: {
        path: path.resolve(__dirname, "src/main/resources/assets/journeymap/web/bundled"),
        filename: "bundle.js"
    },

    plugins: [
        new VueLoaderPlugin(),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],

    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },

    module: {
        rules: [
            {  // Use babel to transpile JS files to older versions
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|src\/main\/resources)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {  // Extract and bundle imported CSS files and minify them
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {  // Extract and bundle imported image files
                test: /\.(png|jpe?g|gif|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {  // Vue template files
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    }
};

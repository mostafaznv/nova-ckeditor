/**
 * @license Copyright (c) 2014-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 * Backup WebPack Config
 */

'use strict';

/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const {bundler, styles} = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    performance: {hints: false},
    entry: path.resolve(__dirname, 'ckeditor.js'),
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'editor.js',
        library: 'ClassicEditor',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                sourceMap: true,
                extractComments: false,
                terserOptions: {
                    output: {comments: /^!/}
                },
            })
        ]
    },
    plugins: [
        new CKEditorWebpackPlugin({
            language: 'en',
            additionalLanguages: []
        }),
        new webpack.BannerPlugin({
            banner: bundler.getLicenseBanner(),
            raw: true
        })
    ],

    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['raw-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig({
                            themeImporter: {
                                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                            },
                            minify: true
                        })
                    },
                ]
            }
        ]
    }
};

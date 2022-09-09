const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
const {styles} = require('@ckeditor/ckeditor5-dev-utils')
const mix = require('laravel-mix')

const CKERegex = {
    svg: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
    css: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
}


Mix.listen('configReady', webpackConfig => {
    const rules = webpackConfig.module.rules;

    const targetSVG = /(\.(png|jpe?g|gif|webp|avif)$|^((?!font).)*\.svg$)/;
    const targetFont = /(\.(woff2?|ttf|eot|otf)$|font.*\.svg$)/;
    const targetCSS = /\.p?css$/;

    for (let rule of rules) {
        if (rule.test.toString() === targetSVG.toString()) {
            rule.exclude = CKERegex.svg;
        }
        else if (rule.test.toString() === targetFont.toString()) {
            rule.exclude = CKERegex.svg;
        }
        else if (rule.test.toString() === targetCSS.toString()) {
            rule.exclude = CKERegex.css;
        }
    }
})

mix.setPublicPath('dist')
    .js('resources/js/field.js', 'js')
    .sass('resources/sass/field.sass', 'css')
    .vue({version: 3})
    .webpackConfig({
        externals: {
            vue: 'Vue',
            'laravel-nova': 'LaravelNova'
        },
        plugins: [
            new CKEditorWebpackPlugin({
                language: 'en',
                addMainLanguageTranslationsToAllAssets: true
            })
        ],
        module: {
            rules: [
                {
                    test: CKERegex.svg,
                    use: ['raw-loader']
                },
                {
                    test: CKERegex.css,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                injectType: 'singletonStyleTag',
                                attributes: {
                                    'data-cke': true
                                }
                            }
                        },
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: styles.getPostCssConfig({
                                    themeImporter: {
                                        themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                                    },
                                    minify: true
                                })
                            }
                        }
                    ]
                }
            ]
        }
    })

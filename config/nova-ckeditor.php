<?php
return [
    /*
     |--------------------------------------------------------------------------
     | Video Model
     |--------------------------------------------------------------------------
     |
     | Specifies the path of your video model
     |
     */

    'video-model' => 'App\Models\Video',


    /*
     |--------------------------------------------------------------------------
     | Max Memory
     |--------------------------------------------------------------------------
     |
     | Max Memory (php.ini override) for Intervention Image Resizing
     | @docs https://www.php.net/manual/en/ini.core.php#ini.memory-limit
     |
     */

    'memory' => '256M',

    /*
     |--------------------------------------------------------------------------
     | Image Quality
     |--------------------------------------------------------------------------
     |
     | Max Intervention Image Output Quality
     | before Image Optimizer is run.
     | @docs http://image.intervention.io/api/save
     |
     */

    'max-quality' => 75,

    /*
     |--------------------------------------------------------------------------
     | Image Dimensions
     |--------------------------------------------------------------------------
     |
     | Intervention Image Max Dimensions
     | @docs http://image.intervention.io/api/resize
     |
     */

    'max-width'  => 1024,
    'max-height' => 768,

    /*
     |--------------------------------------------------------------------------
     | Naming Method of Images
     |--------------------------------------------------------------------------
     |
     | Available methods: hash-file, real-file-name, unique-real-file-name
     |
     */

    'image-naming-method' => 'hash-file',

    /*
     |--------------------------------------------------------------------------
     | Toolbar
     |--------------------------------------------------------------------------
     |
     | Customize Settings
     |
     */

    'toolbars' => [
        'default' => 'toolbar-1',

        'toolbar-1' => [
            'height' => 400,

            'content-lang' => 'en',

            'ui-language' => [
                'name'   => 'en',

                /**
                 * Example 1: asset('js/ckeditor-fa.js')
                 * Example 2: 'https://cdn.ckeditor.com/ckeditor5/34.0.0/decoupled-document/translations/fa.js'
                 */
                'script' => null
            ],

            'text-part-language' => [
                ['title' => 'Farsi', 'languageCode' => 'fa'],
                ['title' => 'English', 'languageCode' => 'en']
            ],

            /*
             * General HTML Support
             *
             * @see https://ckeditor.com/docs/ckeditor5/latest/features/html/general-html-support.html#configuration
             */

            'html-support' => [
                'allow' => [
                    [
                        'name'    => 'div',
                        'classes' => true,
                    ],
                    [
                        'name' => '/^(div|section|article)$/'
                    ]
                ],

                'disallow' => []
            ],

            'should-not-group-when-full' => false,

            'browser' => [
                'image' => true,
                'video' => true
            ],

            'snippets' => [
                ['name' => 'Image', 'html' => 'ckeditor.image'],
                ['name' => 'Media', 'html' => 'ckeditor.media'],
                ['name' => 'Table', 'html' => 'ckeditor.table']
            ],

            'items' => [
                'textPartLanguage',
                'heading',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'insertTable',
                'imageBrowser',
                'videoBrowser',
                'mediaEmbed',
                'link',
                'resizeImage',
                '|',
                'bold',
                'italic',
                'alignment',
                'elementIdAttributes',
                'horizontalLine',
                'subscript',
                'superscript',
                'underline',
                'strikethrough',
                'code',
                'removeFormat',
                '|',
                'outdent',
                'indent',
                '|',
                'codeBlock',
                'blockQuote',
                'bulletedList',
                'numberedList',
                '|',
                'snippetBrowser',
                'htmlEmbed',
                '|',
                'undo',
                'redo',
                '|',
                'sourceEditing'
            ],

            'options' => [
                'headings' => [
                    [
                        'model' => 'paragraph',
                        'title' => 'Paragraph',
                        'class' => 'ck-heading_paragraph',
                    ],
                    [
                        'model' => 'heading1',
                        'view'  => 'h1',
                        'title' => 'Heading 1',
                        'class' => 'ck-heading_heading1',
                    ],
                    [
                        'model' => 'heading2',
                        'view'  => 'h2',
                        'title' => 'Heading 2',
                        'class' => 'ck-heading_heading2',
                    ],
                    [
                        'model' => 'heading3',
                        'view'  => 'h3',
                        'title' => 'Heading 3',
                        'class' => 'ck-heading_heading3',
                    ],
                    [
                        'model' => 'heading4',
                        'view'  => 'h4',
                        'title' => 'Heading 4',
                        'class' => 'ck-heading_heading4',
                    ],
                    [
                        'model' => 'heading5',
                        'view'  => 'h5',
                        'title' => 'Heading 5',
                        'class' => 'ck-heading_heading5',
                    ],
                    [
                        'model' => 'heading6',
                        'view'  => 'h6',
                        'title' => 'Heading 6',
                        'class' => 'ck-heading_heading6',
                    ]
                ],

                'fontFamily' => [
                    'supportAllValues' => false,
                    'options'          => [
                        'default',
                        'Arial, Helvetica, sans-serif',
                        'Courier New, Courier, monospace',
                        'Georgia, serif',
                        'Lucida Sans Unicode, Lucida Grande, sans-serif',
                        'Tahoma, Geneva, sans-serif',
                        'Times New Roman, Times, serif',
                        'Trebuchet MS, Helvetica, sans-serif',
                        'Verdana, Geneva, sans-serif'
                    ]
                ],

                'fontSize' => [
                    'options' => [
                        'tiny',
                        'small',
                        'default',
                        'big',
                        'huge'
                    ]
                ],

                'fontColor' => [
                    'columns' => 5,
                    'colors'  => [
                        [
                            'color' => 'hsl(0, 0%, 0%)',
                            'label' => 'Black'
                        ],
                        [
                            'color' => 'hsl(0, 0%, 30%)',
                            'label' => 'Dim grey'
                        ],
                        [
                            'color' => 'hsl(0, 0%, 60%)',
                            'label' => 'Grey'
                        ],
                        [
                            'color' => 'hsl(0, 0%, 90%)',
                            'label' => 'Light grey'
                        ],
                        [
                            'color'     => 'hsl(0, 0%, 100%)',
                            'label'     => 'White',
                            'hasBorder' => true
                        ],
                        [
                            'color' => 'hsl(0, 75%, 60%)',
                            'label' => 'Red'
                        ],
                        [
                            'color' => 'hsl(30, 75%, 60%)',
                            'label' => 'Orange'
                        ],
                        [
                            'color' => 'hsl(60, 75%, 60%)',
                            'label' => 'Yellow'
                        ],
                        [
                            'color' => 'hsl(90, 75%, 60%)',
                            'label' => 'Light green'
                        ],
                        [
                            'color' => 'hsl(120, 75%, 60%)',
                            'label' => 'Green'
                        ],
                        [
                            'color' => 'hsl(150, 75%, 60%)',
                            'label' => 'Aquamarine'
                        ],
                        [
                            'color' => 'hsl(180, 75%, 60%)',
                            'label' => 'Turquoise'
                        ],
                        [
                            'color' => 'hsl(210, 75%, 60%)',
                            'label' => 'Light blue'
                        ],
                        [
                            'color' => 'hsl(240, 75%, 60%)',
                            'label' => 'Blue'
                        ],
                        [
                            'color' => 'hsl(270, 75%, 60%)',
                            'label' => 'Purple'
                        ]
                    ]
                ],

                'fontBackgroundColor' => [
                    'columns' => 5,
                    'colors'  => [
                        [
                            'color' => 'hsl(0, 0%, 0%)',
                            'label' => 'Black'
                        ],
                        [
                            'color' => 'hsl(0, 0%, 30%)',
                            'label' => 'Dim grey'
                        ],
                        [
                            'color' => 'hsl(0, 0%, 60%)',
                            'label' => 'Grey'
                        ],
                        [
                            'color' => 'hsl(0, 0%, 90%)',
                            'label' => 'Light grey'
                        ],
                        [
                            'color'     => 'hsl(0, 0%, 100%)',
                            'label'     => 'White',
                            'hasBorder' => true
                        ],
                        [
                            'color' => 'hsl(0, 75%, 60%)',
                            'label' => 'Red'
                        ],
                        [
                            'color' => 'hsl(30, 75%, 60%)',
                            'label' => 'Orange'
                        ],
                        [
                            'color' => 'hsl(60, 75%, 60%)',
                            'label' => 'Yellow'
                        ],
                        [
                            'color' => 'hsl(90, 75%, 60%)',
                            'label' => 'Light green'
                        ],
                        [
                            'color' => 'hsl(120, 75%, 60%)',
                            'label' => 'Green'
                        ],
                        [
                            'color' => 'hsl(150, 75%, 60%)',
                            'label' => 'Aquamarine'
                        ],
                        [
                            'color' => 'hsl(180, 75%, 60%)',
                            'label' => 'Turquoise'
                        ],
                        [
                            'color' => 'hsl(210, 75%, 60%)',
                            'label' => 'Light blue'
                        ],
                        [
                            'color' => 'hsl(240, 75%, 60%)',
                            'label' => 'Blue'
                        ],
                        [
                            'color' => 'hsl(270, 75%, 60%)',
                            'label' => 'Purple'
                        ]
                    ]
                ],

                'image' => [
                    'upload' => [
                        'types' => ['gif', 'png', 'jpg', 'jpeg', 'webp']
                    ],

                    'resizeUnit' => '%',

                    'resizeOptions' => [
                        [
                            'name'  => 'resizeImage:original',
                            'value' => null,
                            'label' => 'Original',
                            'icon'  => 'original'
                        ],
                        [
                            'name'  => 'resizeImage:25',
                            'value' => '25',
                            'label' => 'Small (25%)',
                            'icon'  => 'small'
                        ],
                        [
                            'name'  => 'resizeImage:50',
                            'value' => '50',
                            'label' => 'Medium',
                            'icon'  => 'medium'
                        ],
                        [
                            'name'  => 'resizeImage:75',
                            'value' => '75',
                            'label' => 'Large (75%)',
                            'icon'  => 'large'
                        ]
                    ],

                    'toolbar' => [
                        'imageBrowser',
                        '|',
                        'imageStyle:full',
                        'imageStyle:alignLeft',
                        'imageStyle:alignCenter',
                        'imageStyle:alignRight',
                        '|',
                        'imageTextAlternative',
                        'toggleImageCaption',
                        '|',
                        'imageStyle:block',
                        'imageStyle:side',
                        '|',
                        'linkImage',
                        '|',
                        'resizeImage:25',
                        'resizeImage:50',
                        'resizeImage:75',
                        'resizeImage:original',
                    ],

                    'styles' => [
                        'full',
                        'alignLeft',
                        'alignCenter',
                        'alignRight',
                    ]
                ],

                'mediaEmbed' => []
            ],
        ]
    ],
];

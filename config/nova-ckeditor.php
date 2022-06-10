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
    | Toolbar
    |--------------------------------------------------------------------------
    |
    | Customize Settings
    |
    */

    'toolbar' => [
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
            ]
        ]
    ],
];

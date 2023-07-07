---
description: toolbars.toolbar-1.html-support
---

# General HTML Support

<table><thead><tr><th>Property Name</th><th width="168.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>toolbars.toolbar-1.html-support</td><td>array</td><td></td></tr></tbody></table>

This option enables the General HTML Support ("GHS") feature within the toolbar NovaCkeditor field. This feature allows you to enable HTML features that are not supported by any other dedicated CKEditor 5 plugins.

With the General HTML Support feature, you can add elements, attributes, classes, and styles to the editor's source and ensure that this markup remains preserved in both the editor window and the output. This provides greater flexibility for incorporating custom HTML elements and attributes within your content.

To configure the General HTML Support feature within Toolbar 1, update the value of `toolbars.toolbar-1.html-support` in the `config/nova-ckeditor.php` file with the desired array of HTML support settings.

\
Example:

```php
<?php

return [    
    'toolbars' => [
        'toolbar-1' => [
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
            ]
        ],
    ]
];
```

{% hint style="info" %}
For more detailed information on using the General HTML Support feature, refer to the [CKEditor 5 documentation on General HTML Support](https://ckeditor.com/docs/ckeditor5/latest/features/html/general-html-support.html).
{% endhint %}






---
description: toolbars.toolbar-1.styles
---

# Styles

<table><thead><tr><th width="345">Property Name</th><th width="147.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>toolbars.toolbar-1.styles</td><td>array</td><td></td></tr></tbody></table>

The style feature lets you apply pre-configured styles to elements in your content. It works by adding one or more CSS classes to an element to change its appearance or add semantic information.



To configure the <mark style="color:red;">`style`</mark> feature within Toolbar 1, update the value of <mark style="color:red;">`toolbars.toolbar-1.styles`</mark> in the <mark style="color:red;">`config/nova-ckeditor.php`</mark> file with the desired language codes.

Example:

```php
<?php

return [    
    'toolbars' => [
        'toolbar-1' => [
            'styles' => [
                [
                    'name'    => 'Article Category',
                    'element' => 'h3',
                    'classes' => ['article-category']
                ],
                [
                    'name'    => 'Info Box',
                    'element' => 'p',
                    'classes' => ['info-box']
                ],
            ],
        ],
    ]
];
```

---
description: toolbars.toolbar-1.snippets
---

# Snippets

<table><thead><tr><th>Property Name</th><th width="197.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>toolbars.toolbar-1.snippets</td><td>array</td><td></td></tr></tbody></table>

This option allows you to define and customize the snippets available within the toolbar. Snippets are pre-defined content blocks that can be easily inserted into the CKEditor field.

By default, there are some pre-defined snippets located in the `resources/views/ckeditor` directory. However, you can add more snippets as needed by specifying them in the `toolbars.toolbar-1.snippets` configuration option.



To add and customize snippets within Toolbar 1, update the value of `toolbars.toolbar-1.snippets` in the `config/nova-ckeditor.php` file with the desired array of snippet items.

\
Example:

```php
<?php

return [    
    'toolbars' => [
        'toolbar-1' => [
            'snippets' => [
                ['name' => 'Image', 'html' => 'ckeditor.image'],
                ['name' => 'Media', 'html' => 'ckeditor.media'],
                ['name' => 'Table', 'html' => 'ckeditor.table']
            ]
        ],
    ]
];
```

{% hint style="info" %}
It's important to note that snippets will only render CKEditor elements. Standard HTML or figures such as tables, images, and videos. For more information on using standard HTML or figures, refer to the [CKEditor documentation](https://ckeditor.com/docs).
{% endhint %}






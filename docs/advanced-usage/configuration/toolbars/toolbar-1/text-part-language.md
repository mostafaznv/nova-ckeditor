---
description: toolbars.toolbar-1.text-part-language
---

# Text Part Language

<table><thead><tr><th width="345">Property Name</th><th width="147.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>toolbars.toolbar-1.text-part-language</td><td>array</td><td>en, fa</td></tr></tbody></table>

This feature enables the ability to mark the language of selected text fragments, making it convenient to work with multilingual content.

By default, theis option is set to <mark style="color:red;">fa</mark> and <mark style="color:red;">en</mark>, indicating that Persian (Farsi) and English are the supported languages for the text part language feature within the toolbar. You can adjust this array to include additional language codes as needed.

To configure the supported languages for the text part language feature within Toolbar 1, update the value of `toolbars.toolbar-1.text-part-language` in the `config/nova-ckeditor.php` file with the desired language codes.

Example:

```php
<?php

return [    
    'toolbars' => [
        'toolbar-1' => [
            'text-part-language' => [
                ['title' => 'Farsi', 'languageCode' => 'fa'],
                ['title' => 'English', 'languageCode' => 'en']
            ],
        ],
    ]
];
```






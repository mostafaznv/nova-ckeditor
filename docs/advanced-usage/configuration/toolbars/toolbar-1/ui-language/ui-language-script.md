---
description: toolbars.toolbar-1.ui-language.script
---

# UI Language Script

<table><thead><tr><th width="342">Property Name</th><th width="173.33333333333331">Type</th><th>Default</th></tr></thead><tbody><tr><td>toolbars.toolbar-1.ui-language.script</td><td>string</td><td>null</td></tr></tbody></table>

This option allows you to specify the URL of the language file to be used for the CKEditor's user interface (UI) within Toolbar in the NovaCkeditor field. This option provides the ability to load a language-specific JavaScript file that contains translations for the UI elements.

By default, this option is set to `null`, indicating that no language file is specified for the CKEditor UI. However, you can adjust this value to specify the URL of a language file that contains the translations for the desired language.

To configure the language file for the CKEditor's UI within Toolbar 1, update the value of `toolbars.toolbar-1.ui-language.script` in the `config/nova-ckeditor.php` file with the URL of the language file.

\
Example:

```php
<?php

return [    
    'toolbars' => [
        'toolbar-1' => [
            'ui-language' => [
                'name' => 'fa',
                'script' => asset('js/ckeditor-fa.js'),
            ],
        ],
    ]
];
```

{% hint style="info" %}
You can also specify an external URL if the language file is hosted on a CDN or another remote location.
{% endhint %}






---
description: toolbar
---

# Toolbar

<table><thead><tr><th>Argument</th><th>Type</th><th data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>name</td><td>string</td><td>true</td><td></td></tr><tr><td>items</td><td>array</td><td>false</td><td>null</td></tr></tbody></table>

This method allows you to customize the toolbar configuration within the CKEditor field, providing flexibility in defining the available toolbar options and items and their arrangement.

It accepts two arguments to facilitate customization.

The first argument, `name`, is a string that allows you to reference a pre-configured toolbar key from the `config/nova-ckeditor.php` file. This feature enables you to quickly apply a predefined toolbar configuration to the CKEditor field.

Additionally, the second argument, `items`, is an optional array that empowers you to define custom toolbar items for the current field. By providing an array of toolbar items, you can specify a personalized set of buttons, dropdown menus, and other editing tools to include in the toolbar. This functionality enables you to precisely tailor the toolbar to match your specific needs.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->toolbar('toolbar-2', [
                    'textPartLanguage', 'heading', '|', 'fontSize'
                    ]
                )
        ];
    }
}
```


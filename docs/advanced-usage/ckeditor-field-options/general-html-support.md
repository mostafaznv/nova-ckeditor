---
description: htmlSupport
---

# General HTML Support

<table><thead><tr><th>Argument</th><th width="160">Type</th><th width="161" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>htmlSupport</td><td>array</td><td>true</td><td></td></tr></tbody></table>

This method allows you to enable <mark style="color:red;">General HTML Support</mark> (GHS) within the editor, providing flexibility to include HTML elements, attributes, classes, and styles that are not supported by other dedicated CKEditor 5 plugins. This ensures that your desired markup, including custom elements, attributes, classes, and styles, remains preserved within the editor window and in the final output.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->htmlSupport([
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
            )
        ];
    }
}
```

{% hint style="info" %}
For more detailed information on using the General HTML Support feature, refer to the [CKEditor 5 documentation on General HTML Support](https://ckeditor.com/docs/ckeditor5/latest/features/html/general-html-support.html).
{% endhint %}


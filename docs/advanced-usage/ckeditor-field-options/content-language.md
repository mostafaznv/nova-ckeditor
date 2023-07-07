---
description: contentLanguage
---

# Content Language

<table><thead><tr><th>Argument</th><th width="141">Type</th><th width="149" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>lang</td><td>string</td><td>true</td><td></td></tr></tbody></table>

This method allows you to define the language of the editor's content, enabling you to set the text direction (RTL or LTR) based on your requirements.

By utilizing the `contentLanguage` method, you can specify the language for the content within the CKEditor field. The method accepts an argument called `lang`, which allows you to set the desired language code.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->contentLanguage('fa')
        ];
    }
}
```

{% hint style="info" %}
In this example, the `contentLanguage` method is used to set the content language of the CKEditor field to Farsi (<mark style="color:red;">`fa`</mark>). This ensures that the text direction is appropriate for Farsi content, which typically follows a right-to-left (RTL) orientation.
{% endhint %}




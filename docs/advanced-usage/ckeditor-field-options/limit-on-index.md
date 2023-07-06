---
description: limitOnIndex
---

# Limit On Index

<table><thead><tr><th>Argument</th><th>Type</th><th data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>limit</td><td>int</td><td>true</td><td>85</td></tr></tbody></table>

By utilizing the `limitOnIndex` method, you can define a maximum character limit that will be enforced when displaying the CKEditor field in the index view of your Laravel Nova resource. This is useful for providing a concise preview or summary of the content without overwhelming the view with excessive text.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->limitOnIndex(150)
        ];
    }
}
```

{% hint style="info" %}
In this example, the <mark style="color:red;">`limitOnIndex`</mark> method is used to restrict the displayed text to a maximum of 150 characters in the index view. Any content exceeding this limit will be truncated, providing a concise preview of the CKEditor field's content.
{% endhint %}




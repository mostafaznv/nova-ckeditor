---
description: forcePasteAsPlainText
---

# Force Paste as Plain Text

<table><thead><tr><th>Argument</th><th width="141">Type</th><th width="149" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>status</td><td>bool</td><td>false</td><td>true</td></tr></tbody></table>

In some cases, you might want to paste content from your clipboard as plain text, removing any HTML tags.

By default, CKEditor preserves the structure of the original content and ensures HTML is safely maintained. However, if you’d prefer to paste content without any formatting, as plain text, you can use the `forcePasteAsPlainText` function.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->forcePasteAsPlainText()
        ];
    }
}
```

{% hint style="info" %}
This feature has been available since <mark style="color:red;">v7.5.0</mark>
{% endhint %}




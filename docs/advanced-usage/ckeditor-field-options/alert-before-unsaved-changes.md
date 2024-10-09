---
description: alertBeforeUnsavedChanges
---

# Alert Before Unsaved Changes

<table><thead><tr><th>Argument</th><th width="141">Type</th><th width="149" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>status</td><td>bool</td><td>false</td><td>true</td></tr></tbody></table>

This feature is enabled by default and triggers an alert if a user attempts to navigate away or refresh the page without saving CKEditor content, just like other form fields in Nova.





```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->alertBeforeUnsavedChanges()
        ];
    }
}
```

{% hint style="info" %}
This feature has been available since <mark style="color:red;">v7.6.0</mark>
{% endhint %}




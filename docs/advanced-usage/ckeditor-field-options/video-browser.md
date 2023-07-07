---
description: videoBrowser
---

# Video Browser

<table><thead><tr><th>Argument</th><th width="144">Type</th><th width="155" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>enabled</td><td>bool</td><td>false</td><td>true</td></tr></tbody></table>

This method allows you to enable or disable the video picker functionality within the CKEditor field.

By utilizing the `videoBrowser` method, you have control over whether the video picker is enabled or disabled for the CKEditor field. The method accepts a boolean value as the `enabled` argument, where `true` enables the video picker, and `false` disables it.

Enabling the video picker provides a convenient way for users to select and insert videos directly into the CKEditor field. This feature streamlines the video insertion process, enhancing the content creation experience. On the other hand, disabling the video picker removes the option for users to select videos through the CKEditor field, limiting the content to text-only input.

To utilize the `videoBrowser` method, simply pass `true` or `false` as the `status` argument based on whether you want to enable or disable the video picker, respectively.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->videoBrowser()
        ];
    }
}
```




---
description: audioBrowser
---

# Audio Browser

<table><thead><tr><th>Argument</th><th width="140">Type</th><th width="155" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>enabled</td><td>bool</td><td>false</td><td>true</td></tr></tbody></table>

This method allows you to enable or disable the audio picker functionality within the CKEditor field.

By utilizing the `audioBrowser` method, you have control over whether the audio picker is enabled or disabled for the CKEditor field. The method accepts a boolean value as the `enabled` argument, where `true` enables the audio picker, and `false` disables it.

Enabling the audio picker provides a convenient way for users to select and insert audio files directly into the CKEditor field. This feature streamlines the audio insertion process, enhancing the content creation experience. On the other hand, disabling the audio picker removes the option for users to select audio files through the CKEditor field, limiting the content to text-only input.

To utilize the `audioBrowser` method, simply pass `true` or `false` as the `status` argument based on whether you want to enable or disable the audio picker, respectively.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->audioBrowser()
        ];
    }
}
```




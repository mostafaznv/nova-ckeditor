---
description: imageBrowser
---

# Image Browser

<table><thead><tr><th>Argument</th><th width="140">Type</th><th width="155" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>enabled</td><td>bool</td><td>false</td><td>true</td></tr></tbody></table>

This method allows you to enable or disable the image picker functionality within the CKEditor field.

By utilizing the `imageBrowser` method, you have control over whether the image picker is enabled or disabled for the CKEditor field. The method accepts a boolean value as the `enabled` argument, where `true` enables the image picker, and `false` disables it.

Enabling the image picker provides a convenient way for users to select and insert images directly into the CKEditor field. This feature streamlines the image insertion process, enhancing the content creation experience. On the other hand, disabling the image picker removes the option for users to select images through the CKEditor field, limiting the content to text-only input.

To utilize the `imageBrowser` method, simply pass `true` or `false` as the `status` argument based on whether you want to enable or disable the image picker, respectively.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->imageBrowser()
        ];
    }
}
```




---
description: height
---

# Height



<table><thead><tr><th>Argument</th><th>Type</th><th data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>pixels</td><td>int</td><td>true</td><td></td></tr></tbody></table>

This method allows you to specify the desired height of the editor, providing control over the visual display of the CKEditor field. The method accepts a single argument, `pixels`, which allows you to set the height of the editor in pixels.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->height(500)
        ];
    }
}
```


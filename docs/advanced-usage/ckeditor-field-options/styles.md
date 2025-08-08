---
description: styles
---

# Styles

<table><thead><tr><th>Argument</th><th width="141">Type</th><th width="149" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>styles</td><td>array</td><td>true</td><td></td></tr></tbody></table>

The style feature lets you apply pre-configured styles to elements in your content. It works by adding one or more CSS classes to an element to change its appearance or add semantic information.



By utilizing the `styles` method, you can specify styles for the toolbar of the CKEditor field. The method accepts an argument called `styles`, which allows you to set the styles configuration.

```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->styles([
                    [
                        'name'    => 'Info Box',
                        'element' => 'p',
                        'classes' => ['info-box']
                    ],
                ])
        ];
    }
}
```


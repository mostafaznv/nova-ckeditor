---
description: snippets
---

# Snippets

<table><thead><tr><th>Argument</th><th width="153">Type</th><th width="149" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>snippets</td><td>array</td><td>true</td><td></td></tr></tbody></table>

This method allows you to set snippet items within the CKEditor field, providing a convenient way to insert predefined content or code snippets into the editor.

By utilizing the `snippets` method, you can define an array of snippet items to be available in the CKEditor field. Each snippet item represents a specific HTML view (blade template) that should be located in the `resources/views/ckeditor` directory of your Laravel application.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->snippets([
                    ['name' => 'Image', 'html' => 'ckeditor.image'],
                    ['name' => 'Media', 'html' => 'ckeditor.media'],
                    ['name' => 'Table', 'html' => 'ckeditor.table']
                ])
        ];
    }
}
```




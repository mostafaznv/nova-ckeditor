# Customize Toolbar Items

In addition to customizing toolbar items using the `config/nova-ckeditor.php` file, you can pass custom toolbar items directly to the `toolbar()` method as the second argument. This method allows you to customize toolbar items on-the-fly for the CkEditor fields where it is applied.

While the configuration file provides a generic way to customize toolbar items for all instances in the Nova panel, using the `toolbar()` method with custom items allows you to have more granular control over the toolbar items, tailoring them to your specific needs in different areas of your Nova resources.

By leveraging these two approaches, you have the flexibility to customize toolbar items globally or on a per-field basis, depending on the level of customization required in your application.

```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            ID::make()->sortable(),

            CkEditor::make(trans('Content'), 'content')
                ->toolbar('toolbar-2', [
                    'textPartLanguage', 'heading', '|', 'fontSize'
                ])
                ->stacked()
        ];
    }
}
```




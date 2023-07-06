# Multiple Toolbars

To utilize multiple toolbars in your Nova resources, you can easily duplicate the configuration of <mark style="color:red;">`toolbars.toolbar-1`</mark> in the <mark style="color:red;">`config/nova-ckeditor.php`</mark> file. Then, you can reference the cloned toolbar configuration in the options of your CkEditor fields.

1. Add a new array item to the `toolbars` array, defining your new toolbar. For example:

{% code title="config/nova-ckeditor.php" %}
```php
return [
    'toolbars' => [
        'toolbar-1' => [
            ...
        ],
        'toolbar-2' => [
            ...
        ],   
    ]
];
```
{% endcode %}



2. Use it in your CkEditor field:

```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            ID::make()->sortable(),

            // this field uses the default toolbar (toolbar-1)
            CkEditor::make(trans('Content'), 'content')
                ->stacked(),

            CkEditor::make(trans('Description'), 'description')
                ->toolbar('toolbar-2')
                ->stacked()
        ];
    }
}
```

# Usage

Add the <mark style="color:red;">CkEditor</mark> field to your resource by using the `CkEditor::make()` method within the `fields()` method. This enables a rich content editing experience for your users.



```php
<?php

namespace App\Nova\Resources;

use App\Models\Article as ArticleModel;
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public static string $model = ArticleModel::class;
    

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),
            Text::make(trans('Title'), 'title')->rules('required', 'max:255'),
            
            CkEditor::make(trans('Content'), 'content')->stacked(),
        ];
    }
}
```

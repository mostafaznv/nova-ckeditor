---
description: textPartLanguage
---

# Text Part Language

<table><thead><tr><th>Argument</th><th>Type</th><th data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>languages</td><td>array</td><td>true</td><td></td></tr></tbody></table>

This method enables you to mark the language of selected text fragments, making it convenient to work with multilingual content. It ensures that user agents, such as graphical browsers and screen readers, correctly present and interpret the content written in multiple languages.

By utilizing the `textPartLanguage` method, you can specify the language for selected text fragments within the CKEditor field. The method accepts an argument called `languages`, which is an array allowing you to provide multiple language codes.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->textPartLanguage([
                    ['title' => 'Farsi', 'languageCode' => 'fa'],
                    ['title' => 'English', 'languageCode' => 'en']
                ])
        ];
    }
}
```




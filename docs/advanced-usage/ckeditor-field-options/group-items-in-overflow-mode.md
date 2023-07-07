---
description: shouldNotGroupWhenFull
---

# Group Items In Overflow Mode

<table><thead><tr><th>Argument</th><th width="143">Type</th><th width="154" data-type="checkbox">Required</th><th>Default</th></tr></thead><tbody><tr><td>status</td><td>bool</td><td>false</td><td>true</td></tr></tbody></table>

This method allows you to control the behavior of the editor when it reaches the maximum width and enters overflow mode.

By utilizing the `shouldNotGroupWhenFull` method, you can indicate whether the editor should display three dots (<mark style="color:red;">"..."</mark>) in overflow mode or group the toolbar items together. This feature provides control over the appearance and functionality of the toolbar when the editor's width is constrained.

To use this method, pass a boolean value as the `status` argument. Setting `status` to `true` indicates that the toolbar items should not be grouped and the three dots ("...") should not be displayed in overflow mode.



```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            CkEditor::make(trans('Content'), 'content')
                ->shouldNotGroupWhenFull()
        ];
    }
}
```




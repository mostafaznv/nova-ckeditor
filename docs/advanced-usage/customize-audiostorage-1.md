# Customize FileStorage

You have the option to override the `FileStorage` service by binding your own extended version using the following code snippet:

```php
use Illuminate\Http\Request;
use Mostafaznv\NovaCkEditor\FileStorage;


class MyFileStorage extends FileStorage
{
    public function __invoke(Request $request)
    {
        // TODO: Change the default implementation.
    }
}

$this->app->bind('ckeditor-file-storage', MyFileStorage::class);
```

By creating a custom `MyFileStorage` class that extends `FileStorage`, you can define your own logic for handling file storage within the `__invoke()` method. Afterward, binding the custom class to the `'ckeditor-file-storage'` key allows Laravel Nova to use your extended implementation instead of the default one.

Within the `__invoke()` method of `MyFileStorage`, you can implement your desired functionality to handle file storage according to your specific requirements.



{% hint style="info" %}
This feature was introduced in version <mark style="color:red;">7.3.0</mark> of the NovaCKEditor
{% endhint %}




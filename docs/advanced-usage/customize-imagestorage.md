# Customize ImageStorage

You have the option to override the `ImageStorage` service by binding your own extended version using the following code snippet:

```php
use Illuminate\Http\Request;
use Mostafaznv\NovaCkEditor\ImageStorage;

class MyImageStorage extends ImageStorage
{
    public function __invoke(Request $request)
    {
        // TODO: Change the default implementation.
    }
}

$this->app->bind('ckeditor-image-storage', MyImageStorage::class);
```

By creating a custom `MyImageStorage` class that extends `ImageStorage`, you can define your own logic for handling image storage within the `__invoke()` method. Afterward, binding the custom class to the `'ckeditor-image-storage'` key allows Laravel Nova to use your extended implementation instead of the default one.

Within the `__invoke()` method of `MyImageStorage`, you can implement your desired functionality to handle image storage according to your specific requirements.


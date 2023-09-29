# Customize AudioStorage

You have the option to override the `AudioStorage` service by binding your own extended version using the following code snippet:

```php
use Illuminate\Http\Request;
use Mostafaznv\NovaCkEditor\AudioStorage;

class MyAudioStorage extends AudioStorage
{
    public function __invoke(Request $request)
    {
        // TODO: Change the default implementation.
    }
}

$this->app->bind('ckeditor-audio-storage', MyAudioStorage::class);
```

By creating a custom `MyAudioStorage` class that extends `AudioStorage`, you can define your own logic for handling audio storage within the `__invoke()` method. Afterward, binding the custom class to the `'ckeditor-audio-storage'` key allows Laravel Nova to use your extended implementation instead of the default one.

Within the `__invoke()` method of `MyAudioStorage`, you can implement your desired functionality to handle audio storage according to your specific requirements.


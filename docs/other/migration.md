# Migration

### **From 6.2.1 to 7.0.0**

We have undertaken significant refactoring efforts to release version <mark style="color:red;">7.0.0</mark>. Despite our best efforts to avoid introducing any breaking changes, it became necessary due to the merging of all types of media pickers (<mark style="color:blue;">audio</mark>, <mark style="color:blue;">video</mark>, and <mark style="color:blue;">image</mark>).



If you are migrating from version <mark style="color:red;">6.\*</mark> to <mark style="color:red;">7.\*</mark>, please be aware that you need to replace `imageBrowser`, `videoBrowser`, and `audioBrowser` with <mark style="color:red;">`mediaBrowser`</mark> in the nova-ckeditor's configuration file, locate it in <mark style="color:red;">`toolbars.toolbar-1.items`</mark>.

Additionally, update `imageBrowser` to <mark style="color:red;">`mediaBrowser`</mark> in <mark style="color:red;">`toolbars.toolbar-1.options.image.toolbar`</mark>.



We have discontinued support for both `"intervention/image": "^2.5"` as well `"mostafaznv/nova-video": "^4.0|^5.0"`. If you are using these packages in your projects, please be aware that you need to upgrade them to `"intervention/image": "^3.1.0"` and `"mostafaznv/nova-video": "^6.1.0"` before proceeding.





### **From 5.3.0 to 5.4.0**

The `AudioPicker` feature has been introduced to the ckeditor field.

To activate this functionality, you need to republish the migrations, models and resources.

Execute the following command:

```sh
php artisan vendor:publish --provider="Mostafaznv\NovaCkEditor\FieldServiceProvider"
```

This command will generate two classes for Audio in `Models` and `App\Nova\Resources` directories, along with a migration file for the audio table.



After running the `php artisan migrate` command to create the audio table, follow these additional steps:

1. Add the following properties to `config/nova-ckeditor.php` file (Check [the latest](https://github.com/mostafaznv/nova-ckeditor/blob/master/config/nova-ckeditor.php) version of the config for reference):
   * audio-naming-method
   * toolbars.toolbar-1.browser.audio
   * toolbars.toolbar-1.items.audioBrowser
2. Create a disk drive in your `filesystems.php`

{% code title="config/filesystems.php" %}
```php
'disks' => [
    'audio' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/audio'),
        'url'        => env('APP_URL') . '/uploads/audio',
    ]
]
```
{% endcode %}



That's it. You're done.



### **From 5.1.0 to 5.1.1**

* `html-support` has been added to the toolbar properties in `config/nova-ckeditor.php`.

### **From 4.1.2 to 5.0.0**

There were some backward incompatible changes made to the configuration file. Please review the updated config file for changes and make corresponding updates to ensure compatibility.

* `headings` removed from config file and moved to `toolbars.toolbar-1.options`.
* `headings` method removed from `CkEditor` field.
* `toolbar` property of config file moved to `toolbars.toolbar-1`.
* the arguments of `toolbar` method have changed. now you can pass toolbar name as first argument and toolbar items as second argument.

### **From 3.1.1 to 3.2.0**

* Please add `removeFormat` to `toolbar.items` in config file ([config/nova-ckeditor.php](https://github.com/mostafaznv/nova-ckeditor/blob/master/config/nova-ckeditor.php)).




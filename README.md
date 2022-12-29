# CkEditor 5 Field for Laravel Nova

[![GitHub license](https://img.shields.io/github/license/mostafaznv/nova-ckeditor?style=flat-square)](https://github.com/mostafaznv/nova-ckeditor/blob/master/LICENSE)
[![Packagist Downloads](https://img.shields.io/packagist/dt/mostafaznv/nova-ckeditor?style=flat-square)](https://packagist.org/packages/mostafaznv/nova-ckeditor)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/mostafaznv/nova-ckeditor.svg?style=flat-square)](https://packagist.org/packages/mostafaznv/nova-ckeditor)

CkEditor 5 for Laravel Nova.

Includes custom written plugins for media (video and image), snippet and publishable stubs for out-of-the-box usage.

----
🚀 If you find this project interesting, please consider supporting me on the open source journey

[![Donate](https://mostafaznv.github.io/donate/donate.svg)](https://mostafaznv.github.io/donate)

----

## Features
- CkEditor v5
- Image Picker
- Video Picker
- Drag & Drop Uploading in Media Picker
- Optimize Images
- Generate Cover for Videos
- Localization
- Configurable


## Requirements
- PHP 8.0.2 or higher
- Laravel 8.40.* or higher
- Nova 4
- FFMPEG (required for larupload usage)

<br><br>

> **Note**: Part of this package's functionality depends on [Larapload](https://github.com/mostafaznv/larupload), which is a super easy package to manage media and uploads. you are recommended to read the docs first to take full advantage of available abilities.

<br>

------

## Installation

### 1. Install package using composer
```shell
composer require mostafaznv/nova-ckeditor
```

### 2. Publish config, migrations, models, resources and snippets
```shell
php artisan vendor:publish --provider="Mostafaznv\NovaCkEditor\FieldServiceProvider"
```

### 3. Prepare migration and models
After publishing stubs, there will be Image and Video classes in `app/Models` and `app/Nova/Resources` directories. these classes are essential for `media-picker` used in ckeditor field.

#### Image
You should create a disk in `config/filesystems.php`:

```
'disks' => [
    'image' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/image'),
        'url'        => env('APP_URL') . 'uploads/image',
    ]
]
```
> **Note**: If you want to change the disk name, you should rename it in `App\Nova\Resources\Image` class too. second argument of make function in `ImageUpload` field is the disk name

#### Video
This package uses [nova-video](https://github.com/mostafaznv/nova-video) to handle videos, so you can choose between [larupload](https://github.com/mostafaznv/larupload) and laravel's built-in  file-system to handle upload process.

1. Create a disk in `config/filesystems.php`:
```
'disks' => [
    'video' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/video'),
        'url'        => env('APP_URL') . 'uploads/video',
    ]
]
```

> **Note**: If you want to change the disk name, you should rename it in these places: <br>
> **- With Larupload**: In `App\Models\Video` (disk function of `Attachment` class) <br>
> **- Without Larupload**: In `App\Nova\Resources\Model` (third argument of make function in `VideoUpload` field) 


>**Note**: Larupload uses **FFMPEG** to generate cover from original video file, and it will try to find the FFMPEG binary path from your system's environment. but you can define it by yourself by publishing larupload config file. <br> `php artisan vendor:publish --provider="Mostafaznv\Larupload\LaruploadServiceProvider"`

2. Prepare migration and model:
   1. In the case you chose larupload, there is nothing to do with migration and model. you can find more configuration options in [nova-video](https://github.com/mostafaznv/nova-video) and [larupload](https://github.com/mostafaznv/larupload) documentations.
   2. But if you chose laravel's file-system, you must make some changes in migration and model. You should remove larupload **trait** and **attachments function** from model and use **string column** instead of **upload column** in migration file.
      
Migration
```
class CreateVideosTable extends Migration
{
    public function up()
    {
        Schema::create('videos', function(Blueprint $table) {
        $table->id();
        $table->string('name')->index();
        $table->string('file')->index(); // in case that you don't want Larupload
        $table->timestamps();
    });
}
```
Model
```
class Video extends Model
{
    protected $fillable = ['name', 'file', 'disk'];

    protected static function boot()
    {
        parent::boot();

        self::saving(function($model) {
            $hasLaruploadTrait = method_exists(self::class, 'bootLarupload');

            if (!$model->name) {
                $name = $hasLaruploadTrait ? $model->file->meta('name') : $model->file;

                $model->name = pathinfo($name, PATHINFO_FILENAME);
            }
        });
    }
}
```


### 4. Migrate
```shell
php artisan migrate
```


------

## Usage
Now you can add `CkEditor` field into your resource fields:

```php
use Mostafaznv\NovaCkEditor\CkEditor;

class Article extends Resource
{
    public function fields(Request $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make(trans('Title'), 'title')->rules('required', 'max:255'),

            CkEditor::make(trans('Content'), 'content')->stacked()
        ];
    }
}
```

------

## Some Notes 

> Video and Image file fields are **not updatable** by default. replacing media may result in broken links. so delete and re-upload is the intended methodology.

> You can override the `ImageStorage` service by binding your own extended version:

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

------

## CkEditor Field Options

| method                 | Type    | default          | description                                                                                  |
|------------------------|---------|------------------|----------------------------------------------------------------------------------------------|
| toolbar                | Array   | from config file | Set toolbar items                                                                            |
| height                 | Integer | from config file | Set editor's height                                                                          |
| limitOnIndex           | Integer | 85               | Set character limit on index                                                                 |
| contentLanguage        | String  | from config file | Language of editor's content. if you want to change text-direction (RTL, LTR), you need this |
| shouldNotGroupWhenFull | Boolean | from config file | Indicates whether the editor shows 3 dots in overflow mode                                   |
| imageBrowser           | Boolean | from config file | Enable/Disable image picker                                                                  |
| videoBrowser           | Boolean | from config file | Enable/Disable video picker                                                                  |
| snippets               | Array   | from config file | Set Snippet items                                                                            |



------

## Configuration
You can change configuration options in `config/nova-ckeditor.php`


| key                                     | type                       | default          | description                                                                                                                                                                                                                                                                                                                                   |
|-----------------------------------------|----------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| video-model                             | String                     | App\Models\Video | Path of your video model                                                                                                                                                                                                                                                                                                                      |
| memory                                  | String                     | 256M             | Max memory (php.ini override) for image resizing                                                                                                                                                                                                                                                                                              |
| max-quality                             | Integer                    | 75               | Max image output quality                                                                                                                                                                                                                                                                                                                      |
| max-width                               | Integer                    | 1024             | Image max width                                                                                                                                                                                                                                                                                                                               |
| max-height                              | Integer                    | 768              | Image max height                                                                                                                                                                                                                                                                                                                              |
| image-naming-method                     | String                     | hash-file        | Naming Method of Images. <br>Available methods: `hash-file`, `real-file-name`, `unique-real-file-name`                                                                                                                                                                                                                                        |
| toolbar.height                          | Integer                    | 400              | Editor's height.                                                                                                                                                                                                                                                                                                                              |
| toolbar.content-lang                    | String `format: ISO 639-1` | en               | Language of editor's content. if you want to change text-direction (RTL, LTR), you need this                                                                                                                                                                                                                                                  |
| toolbar.ui-language.name                | String `format: ISO 639-1` | en               | Language of editor's ui.                                                                                                                                                                                                                                                                                                                      |
| toolbar.ui-language.script              | String                     | null             | URL of language file to use in editor's ui.<br>example 1: `asset('js/ckeditor-fa.js')`<br>example 2: `https://cdn.ckeditor.com/ckeditor5/34.0.0/decoupled-document/translations/fa.js`                                                                                                                                                        |
| toolbar.should-not-group-when-full      | Boolean                    | false            | Indicates whether the editor shows 3 dots in overflow mode                                                                                                                                                                                                                                                                                    |
| toolbar.browser.image                   | Boolean                    | true             | You can disable image picker by changing this flag                                                                                                                                                                                                                                                                                            |
| toolbar.browser.video                   | Boolean                    | true             | You can disable video picker by changing this flag                                                                                                                                                                                                                                                                                            |
| toolbar.snippets                        | Array                      |                  | There are some pre-defined snippets in `resources/views/ckeditor`. you can add more snippets if you want. <br> > **Note**: Snippets will only render CkEditor Elements. Standard HTML or Figures (table, image, video), see included views. https://ckeditor.com/docs                                                                         |
| toolbar.items                           | Array                      |                  | These are toolbar buttons. you can remove or rearrange them                                                                                                                                                                                                                                                                                   |
| toolbar.options                         | Array                      |                  | Options of toolbar items. to see more information, please check the CkEditor's documentation.                                                                                                                                                                                                                                                 |


------

## Migration

#### From 3.1.1 to 3.2.0
- Please add `removeFormat` to `toolbar.items` in config file ([config/nova-ckeditor.php](https://github.com/mostafaznv/nova-ckeditor/blob/master/config/nova-ckeditor.php)).


------
🚀 If you find this project interesting, please consider supporting me on the open source journey

[![Donate](https://mostafaznv.github.io/donate/donate.svg)](https://mostafaznv.github.io/donate)

------

#### Credit and Thanks
this package is based on [bayareawebpro's nova-field-ckeditor](https://github.com/bayareawebpro/nova-field-ckeditor).

## Changelog
Refer to the [Changelog](CHANGELOG.md) for a full history of the project.

## License
This software is released under [The MIT License (MIT)](LICENSE).

(C) 2021 Mostafaznv, All rights reserved.

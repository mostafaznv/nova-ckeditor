# CkEditor 5 Field for Laravel Nova

[![GitHub license](https://img.shields.io/github/license/mostafaznv/nova-ckeditor?style=flat-square)](https://github.com/mostafaznv/nova-ckeditor/blob/master/LICENSE)
[![Packagist Downloads](https://img.shields.io/packagist/dt/mostafaznv/nova-ckeditor?style=flat-square)](https://packagist.org/packages/mostafaznv/nova-ckeditor)
[![Latest Version on Packagist](https://img.shields.io/packagist/v/mostafaznv/nova-ckeditor.svg?style=flat-square)](https://packagist.org/packages/mostafaznv/nova-ckeditor)

CkEditor 5 for Laravel Nova.

Includes custom written plugins for media (video and image), snippet and publishable stubs for out-of-the-box usage.

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
- PHP 7.4 or higher
- Laravel 8.* or higher
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

>**Note**: Nova-CkEditor uses `App\Models\Video` to discover if your model uses `Larupload` trait or not. if your model is in another path, you can define it through 4th parameter of construct method in `VideoUpload` class

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

| method           | Type    | default          | description                                                                                   |
|------------------|---------|------------------|-----------------------------------------------------------------------------------------------|
| toolbar          | Array   | from config file | Set toolbar items                                                                             |
| height           | Integer | from config file | Set editor's height                                                                           |
| contentLanguage  | Integer | from config file | Language of editor's content. if you want to change text-direction (RTL, LTR), you need this  |
| imageBrowser     | Boolean | from config file | Enable/Disable image picker                                                                   |
| videoBrowser     | Boolean | from config file | Enable/Disable video picker                                                                   |
| snippets         | Array   | from config file | Set Snippet items                                                                             |



------

## Configuration
You can change configuration options in `app/config/nova-ckeditor.php` 

### Memory
`string` `default: 256M`

Max memory (php.ini override) for image resizing

### Max Quality
`integert` `default: 75`

Max image output quality

### Max Width and Height
`integer` `default width: 1024` `default height: 768`

Image max dimensions

### Toolbar
#### height
`integer` `default: 400`

Editor's height.

#### Content Lang
`string` `default: en` `format: ISO 639-1`

Language of editor's content. if you want to change text-direction (RTL, LTR), you need this

#### Browser
`boolean` `default: true`

You can disable video and image picker by changing these options

#### Snippets
`array`

There are some pre-defined snippets in `resources/views/ckeditor`. you can add more snippets if you want.

> **Note**: Snippets will only render CkEditor Elements. Standard HTML or Figures (table, image, video), see included views. https://ckeditor.com/docs

#### Items
`array`

These are toolbar buttons. you can remove or rearrange them

#### Options
`array`
Options of toolbar items. to see more information, please check the CkEditor's documentation.

------

#### Credit and Thanks
this package is based on [bayareawebpro's nova-field-ckeditor](https://github.com/bayareawebpro/nova-field-ckeditor).

## Changelog
Refer to the [Changelog](CHANGELOG.md) for a full history of the project.

## License
This software is released under [The MIT License (MIT)](LICENSE).

(C) 2021 Mostafaznv, All rights reserved.

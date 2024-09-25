# Installation

### Requirements

* PHP 8.1 or higher
* Laravel 9.\* or higher
* Nova 4
* GD or Imagick
* FFMPEG (required for larupload usage)

\


{% hint style="info" %}
Part of the functionality provided by the NovaCkeditor package relies on <mark style="color:red;">Larapload</mark>, a user-friendly package for managing media and uploads. To fully leverage the capabilities offered by NovaCkeditor, we recommend reading the Larapload [documentation](https://github.com/mostafaznv/larupload) first. This will ensure that you can take full advantage of the available abilities and seamlessly integrate media management and uploads into your Laravel Nova application.
{% endhint %}

***



### Installation

#### 1. Install the package using composer

```bash
composer require mostafaznv/nova-ckeditor
```

#### 2. Publish the configuration, migrations, models, resources, and snippets

```bash
php artisan vendor:publish --provider="Mostafaznv\NovaCkEditor\FieldServiceProvider"
```

#### 3. Prepare the migration, configurations and models

After publishing stubs, essential `Image`, `Video`, `Audio` and `File` classes will be created in the `app/Models` and `app/Nova/Resources` directories respectively. These classes are used for the `media-picker` in the CKEditor field.

{% tabs %}
{% tab title="Image" %}
You should create a disk in `config/filesystems.php`:

```php
'disks' => [
    'image' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/image'),
        'url'        => env('APP_URL') . '/uploads/image',
    ]
]
```

{% hint style="info" %}
If you wish to modify the disk name, remember to update it in the `App\Nova\Resources\Image` class as well. The third argument of the make function in the ImageUpload field corresponds to the disk name.
{% endhint %}
{% endtab %}

{% tab title="Video" %}
This package utilizes [nova-video](https://github.com/mostafaznv/nova-video) for video handling, allowing you to choose between [larupload](https://github.com/mostafaznv/larupload) and Laravel's built-in file system for managing the upload process.



Create a disk in `config/filesystems.php`:

```php
'disks' => [
    'video' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/video'),
        'url'        => env('APP_URL') . '/uploads/video',
    ]
]
```

{% hint style="info" %}
If you wish to change the disk name, ensure you rename it in the following places:

**With Larupload**: In the <mark style="color:red;">`disk`</mark> function of the <mark style="color:red;">`Attachment`</mark> class located in <mark style="color:red;">`App\Models\Video`</mark>

**Without Larupload**: In the third argument of the <mark style="color:red;">`make`</mark> function in the <mark style="color:red;">`VideoUpload`</mark> field located in <mark style="color:red;">`App\Nova\Resources\Video`</mark>
{% endhint %}

{% hint style="info" %}
Larupload utilizes <mark style="color:red;">`FFMPEG`</mark> to generate covers from the original video files. By default, Larupload attempts to find the FFMPEG binary path from your system's environment. However, you have the option to define it yourself by publishing the Larupload configuration file. You can use the following command to publish the Larupload configuration file:\


```bash
php artisan vendor:publish --provider="Mostafaznv\Larupload\LaruploadServiceProvider
```
{% endhint %}
{% endtab %}

{% tab title="Audio" %}
You should create a disk in `config/filesystems.php`:

```php
'disks' => [
    'audio' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/audio'),
        'url'        => env('APP_URL') . '/uploads/audio',
    ]
]
```

{% hint style="info" %}
If you wish to modify the disk name, remember to update it in the `App\Nova\Resources\Audio` class as well. The third argument of the make function in the AudioUpload field corresponds to the disk name.
{% endhint %}
{% endtab %}

{% tab title="File" %}
You should create a disk in `config/filesystems.php`:

```php
'disks' => [
    'file' => [
        'driver'     => 'local',
        'root'       => public_path('uploads/file'),
        'url'        => env('APP_URL') . '/uploads/file',
    ]
]
```

{% hint style="info" %}
If you wish to modify the disk name, remember to update it in the `App\Nova\Resources\File` class as well. The third argument of the make function in the FileUpload field corresponds to the disk name.
{% endhint %}

{% hint style="info" %}
This feature was introduced in version <mark style="color:red;">7.3.0</mark> of the NovaCKEditor
{% endhint %}
{% endtab %}

{% tab title="Migration" %}
**If you have chosen Larupload**, there is no need to make any changes to the videos migration file. You can refer to the [nova-video](https://github.com/mostafaznv/nova-video) and [larupload](https://github.com/mostafaznv/larupload) documentations for additional configuration options.

**If you have chosen Laravel's file system**, you must make some changes to the migration file. In the migration file, replace the <mark style="color:red;">upload column</mark> with a <mark style="color:red;">string column</mark>.



```php
class CreateVideosTable extends Migration
{
    public function up()
    {
        Schema::create('videos', function(Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            // $table->upload('file');
            $table->string('file')->index(); // if you prefer not to use Larupload            
            $table->timestamps();
        });
    }
}
```
{% endtab %}

{% tab title="Model" %}
**If you have chosen Larupload**, there is no need to make any changes to the `Video` model. You can refer to the [nova-video](https://github.com/mostafaznv/nova-video) and [larupload](https://github.com/mostafaznv/larupload) documentations for additional configuration options.

**If you have chosen Laravel's file system**, you must make some changes to the model. Remove the Larupload <mark style="color:red;">trait</mark> and the <mark style="color:red;">attachments function</mark> from the model.



```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['name', 'file', 'disk'];

    protected static function booted(): void
    {
        parent::booted();

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
{% endtab %}
{% endtabs %}





#### 4. Migrate

```shell
php artisan migrate
```






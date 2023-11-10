---
description: Since v6.1.0
---

# Integrating NovaFileArtisan (Larupload) with Image Resource

To enhance your Nova application's image handling capabilities, you can seamlessly integrate [NovaFileArtisan](https://github.com/mostafaznv/nova-file-artisan), a feature-rich file uploader package that serves as a wrapper for [Larupload](https://github.com/mostafaznv/larupload). Follow these steps to incorporate <mark style="color:red;">NovaFileArtisan</mark> into your Image Resource:



1. Install <mark style="color:red;">NovaFileArtisan</mark> and Larupload packages:

```sh
composer require mostafaznv/nova-file-artisan
```

2. Modify your <mark style="color:red;">images</mark> table schema:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->upload('file');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::drop('images');
    }
};
```

3. Apply the <mark style="color:red;">Larupload</mark> trait to your Image model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Mostafaznv\Larupload\Enums\LaruploadMediaStyle;
use Mostafaznv\Larupload\Enums\LaruploadNamingMethod;
use Mostafaznv\Larupload\Storage\Attachment;
use Mostafaznv\Larupload\Traits\Larupload;


class Image extends Model
{
    use Larupload;

    protected $fillable = [
        'name', 'file'
    ];

    protected static function booted(): void
    {
        parent::booted();

        self::saving(function ($model) {
            if (!$model->name) {
                $name = $model->file->meta('name');

                $model->name = pathinfo($name, PATHINFO_FILENAME);
            }
        });
    }

    public function attachments(): array
    {
        return [
            Attachment::make('file')
                ->disk('image')
                ->namingMethod(LaruploadNamingMethod::HASH_FILE)
                ->coverStyle('cover', 500, 500, LaruploadMediaStyle::CROP),
        ];
    }
}
```

4. Replace <mark style="color:red;">ImageUpload</mark> with <mark style="color:red;">NovaFileArtisan</mark> field in your Nova resource:

```php
<?php

namespace App\Nova\Resources;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Text;
use App\Models\Image as ImageModel;
use Mostafaznv\NovaFileArtisan\Fields\NovaFileArtisan;
use Mostafaznv\NovaFileArtisan\Fields\NovaFileArtisanMeta;


class Image extends Resource
{
    public static string $model = ImageModel::class;
    
    
    public function fields(Request $request): array
    {
        return [
            Text::make(trans('Name'), 'name')
                ->showOnPreview()
                ->help(trans('The file name that should be searched'))
                ->sortable(),

            NovaFileArtisan::make('File', 'file')
                ->showOnPreview()
                ->rules('required', 'mimes:jpg,jpeg,png,gif,webp', 'max:5000')
                ->help(trans(':size Megabyte Max FileSize.', ['size' => 5])),

            ...NovaFileArtisanMeta::make('file')->all(),
        ];
    }
}
```

5. You're Done!



These steps empower your Nova application with advanced file handling capabilities using NovaFileArtisan. Feel free to explore additional features and customization options offered by Larupload and NovaFileArtisan.

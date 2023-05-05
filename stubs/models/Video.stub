<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Mostafaznv\Larupload\Enums\LaruploadMediaStyle;
use Mostafaznv\Larupload\Enums\LaruploadNamingMethod;
use Mostafaznv\Larupload\Storage\Attachment;
use Mostafaznv\Larupload\Traits\Larupload;

class Video extends Model
{
    use Larupload;

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

    public function attachments(): array
    {
        return [
            Attachment::make('file')
                ->disk('video')
                ->namingMethod(LaruploadNamingMethod::HASH_FILE)
                ->coverStyle('cover', 852, 480, LaruploadMediaStyle::CROP),
        ];
    }
}

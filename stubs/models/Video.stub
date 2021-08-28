<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Mostafaznv\Larupload\LaruploadEnum;
use Mostafaznv\Larupload\Storage\Attachment;
use Mostafaznv\Larupload\Traits\Larupload;
use Exception;

class Video extends Model
{
    use Larupload;

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

    /**
     * @throws Exception
     */
    public function attachments(): array
    {
        return [
            Attachment::make('file')
                ->disk('video')
                ->namingMethod(LaruploadEnum::HASH_FILE_NAMING_METHOD)
                ->coverStyle(852, 480, LaruploadEnum::AUTO_STYLE_MODE),
        ];
    }
}

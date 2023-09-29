<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Mostafaznv\NovaCkEditor\AudioStorage;


class Audio extends Model
{
    protected $fillable = [
        'name', 'file', 'disk', 'mime', 'size'
    ];

    protected static function booted(): void
    {
        parent::booted();

        self::saving(function($model) {
            if (!$model->name) {
                if ($file = request()->file('file')) {
                    $name = $file->getClientOriginalName();
                }
                else {
                    $name = $model->file;
                }

                $model->name = pathinfo($name, PATHINFO_FILENAME);
            }
        });
    }

    public function getUrlAttribute(): string
    {
        return AudioStorage::make($this->attributes['disk'])->url($this->attributes['file']);
    }

    public function getSizeAttribute(): string
    {
        return AudioStorage::bytesForHumans($this->attributes['size']);
    }
}

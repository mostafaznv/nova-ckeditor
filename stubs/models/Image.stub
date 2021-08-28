<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Mostafaznv\NovaCkEditor\ImageStorage;

class Image extends Model
{
    protected $fillable = [
        'name', 'file', 'disk', 'mime', 'width', 'height', 'size'
    ];

    public function setNameAttribute($value)
    {
        if ($value) {
            $this->attributes['name'] = trim($value);
        }
        else if ($file = request()->file('file')) {
            $this->attributes['name'] = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        }
    }

    public function getUrlAttribute(): string
    {
        return ImageStorage::make($this->attributes['disk'])->url($this->attributes['file']);
    }

    public function getSizeAttribute(): string
    {
        return ImageStorage::bytesForHumans($this->attributes['size']);
    }
}

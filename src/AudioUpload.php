<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Support\Facades\Storage;
use Laravel\Nova\Fields\Audio;
use Laravel\Nova\Http\Requests\NovaRequest;


class AudioUpload extends Audio
{
    public $component   = 'audio-field';
    public $showOnIndex = true;

    /**
     * Create AudioUpload Field
     *
     * @param string $name
     * @param string|null $attribute
     * @param string $disk
     */
    public function __construct(string $name, ?string $attribute = null, string $disk = 'audio')
    {
        parent::__construct($name, $attribute, $disk, app('ckeditor-audio-storage', compact('disk')));

        $this->thumbnail(function ($value) {
            return $value ? Storage::disk($this->getStorageDisk())->url($value) : null;
        });

        $this->deletable(NovaRequest::capture()->isCreateOrAttachRequest());
        $this->prunable();
        $this->readonly(function() {
            return !!$this->resource->id;
        });
    }
}

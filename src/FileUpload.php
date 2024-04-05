<?php

namespace Mostafaznv\NovaCkEditor;

use Laravel\Nova\Fields\File;
use Laravel\Nova\Http\Requests\NovaRequest;
use Illuminate\Support\Facades\Storage;


class FileUpload extends File
{
    public $showOnIndex = true;

    /**
     * Create FileUpload Field
     *
     * @param string $name
     * @param string|null $attribute
     * @param string $disk
     */
    public function __construct(string $name, ?string $attribute = null, string $disk = 'file')
    {
        parent::__construct($name, $attribute ?? 'file', $disk, app('ckeditor-file-storage', compact('disk')));



        $this->preview(function ($value, $disk, $model) {
            if ($value) {
                if (request()->query('ckeditor') == 'media' or str_contains($this->resource->mime, 'image')) {
                    return Storage::disk($this->getStorageDisk())->url($value);
                }
            }

            return null;
        });

        $this->deletable(NovaRequest::capture()->isCreateOrAttachRequest());
        $this->prunable();
        $this->readonly(function () {
            return !!$this->resource->id;
        });
    }
}

<?php

namespace Mostafaznv\NovaCkEditor;

use Laravel\Nova\Fields\Image;
use Laravel\Nova\Http\Requests\NovaRequest;

class ImageUpload extends Image
{
    /**
     * Create ImageUpload Field
     *
     * @param string $name
     * @param string $disk
     * @return void
     */
    public function __construct(string $name, string $disk = 'image')
    {
        parent::__construct($name, 'file', $disk, app('ckeditor-image-storage', compact('disk')));

        $this->deletable(NovaRequest::capture()->isCreateOrAttachRequest());
        $this->prunable();
        $this->readonly(function() {
            return !!$this->resource->id;
        });
    }
}

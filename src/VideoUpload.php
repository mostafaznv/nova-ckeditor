<?php

namespace Mostafaznv\NovaCkEditor;

use Laravel\Nova\Http\Requests\NovaRequest;
use Mostafaznv\Larupload\Traits\Larupload;
use Mostafaznv\NovaVideo\Video;
use App\Models\Video as VideoModel;
use Exception;

class VideoUpload extends Video
{
    /**
     * Create VideoUpload Field
     *
     * @param string $label
     * @param string $fieldName
     * @param string $disk
     * @throws Exception
     */
    public function __construct(string $label, string $fieldName, string $disk = 'video')
    {
        if ($this->hasLaruploadTrait()) {
            parent::__construct($label, $fieldName . '_field', $disk);

            $this->storeWithLarupload($fieldName);
        }
        else {
            parent::__construct($label, $fieldName, $disk);
        }


        $this->deletable(NovaRequest::capture()->isCreateOrAttachRequest());
        $this->prunable();
        $this->readonly(function() {
            return !!$this->resource->id;
        });
    }

    /**
     * Check if Video Model has Larupload Trait
     *
     * @return bool
     */
    protected function hasLaruploadTrait(): bool
    {
        return !!in_array(Larupload::class, class_uses(VideoModel::class));
    }
}

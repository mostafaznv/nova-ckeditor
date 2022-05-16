<?php

namespace Mostafaznv\NovaCkEditor;

use Laravel\Nova\Http\Requests\NovaRequest;
use Mostafaznv\Larupload\Traits\Larupload;
use Mostafaznv\NovaVideo\Video;
use Exception;

class VideoUpload extends Video
{
    protected string $videoModel = 'App\Models\Video';

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

    public function withVideoModel(string $videoModel): self
    {
        $this->videoModel = $videoModel;
    }

    /**
     * Check if Video Model has Larupload Trait
     *
     * @return bool
     */
    protected function hasLaruploadTrait(): bool
    {
        return !!in_array(Larupload::class, class_uses(new $this->videoModel));
    }
}

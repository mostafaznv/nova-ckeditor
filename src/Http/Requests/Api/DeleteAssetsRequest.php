<?php

namespace Mostafaznv\NovaCkEditor\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


final class DeleteAssetsRequest extends FormRequest
{
    protected string $image;
    protected string $video;
    protected string $audio;


    public function rules(): array
    {
        return [
            'id' => [
                'required', 'array'
            ],

            'id.*' => [
                'int'
            ],

            'type' => [
                'required', 'string', 'in:image,audio,video'
            ],

            'resource' => [
                'required', 'string',
                Rule::in([
                    $this->image,
                    $this->video,
                    $this->audio
                ])
            ]
        ];
    }

    protected function prepareForValidation(): void
    {
        $resource = null;

        $this->image = 'App\Nova\Resources\Image';
        $this->video = 'App\Nova\Resources\Video';
        $this->audio = 'App\Nova\Resources\Audio';

        switch ($this->input('type')) {
            case 'image':
                $resource = $this->image;
                break;

            case 'video':
                $resource = $this->video;
                break;

            case 'audio':
                $resource = $this->audio;
                break;
        }

        $this->merge([
            'resource' => $resource
        ]);
    }
}

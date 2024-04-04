<?php

namespace Mostafaznv\NovaCkEditor\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


final class UpdateNameRequest extends FormRequest
{
    protected string $image;
    protected string $video;
    protected string $audio;
    protected string $file;


    public function rules(): array
    {
        return [
            'id' => [
                'required', 'int'
            ],

            'type' => [
                'required', 'string', 'in:image,audio,video,file'
            ],

            'resource' => [
                'required', 'string',
                Rule::in([
                    $this->image,
                    $this->video,
                    $this->audio,
                    $this->file,
                ])
            ],

            'name' => [
                'required', 'string', 'min:3', 'max:255',
            ]
        ];
    }

    protected function prepareForValidation(): void
    {
        $resource = null;

        $this->image = 'App\Nova\Resources\Image';
        $this->video = 'App\Nova\Resources\Video';
        $this->audio = 'App\Nova\Resources\Audio';
        $this->file = 'App\Nova\Resources\File';

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

            case 'file':
                $resource = $this->file;
                break;
        }

        $this->merge([
            'resource' => $resource
        ]);
    }
}

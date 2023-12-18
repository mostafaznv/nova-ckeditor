<?php

namespace App\Nova\Resources;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Mostafaznv\NovaCkEditor\AudioUpload;
use App\Models\Audio as AudioModel;


class Audio extends Resource
{
    public static string $model = AudioModel::class;

    public static $search = ['name'];
    public static $title  = 'name';


    public function fields(Request $request): array
    {
        return [
            ID::make(trans('ID'), 'id'),

            Text::make(trans('Name'), 'name')
                ->help(trans('The file name that should be searched'))
                ->sortable(),

            AudioUpload::make(trans('File'), 'file', 'audio')
                ->rules('file', 'max:1500000', 'mimes:mp3')
                ->creationRules('required')
                ->updateRules('nullable'),

            Text::make(trans('Mime'), 'mime')
                ->onlyOnDetail()
                ->sortable(),

            Text::make(trans('Size'), 'size')
                ->exceptOnForms()
                ->sortable(),

            DateTime::make(trans('Created At'), 'created_at')
                ->readonly(),

            DateTime::make(trans('Updated At'), 'updated_at')
                ->readonly()
        ];
    }

    public function subtitle(): ?string
    {
        return $this->resource->mime ?? '-';
    }

    public static function singularLabel(): string
    {
        return trans('Audio');
    }

    public static function label(): string
    {
        return trans('Audio');
    }

    public static function group(): string
    {
        return trans('Media');
    }
}

<?php

namespace App\Nova\Resources;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use App\Models\File as FileModel;
use Mostafaznv\NovaCkEditor\FileUpload;


class File extends Resource
{
    public static string $model = FileModel::class;

    public static $search = ['name'];
    public static $title  = 'name';


    public function fields(Request $request): array
    {
        return [
            ID::make(trans('ID'), 'id'),

            Text::make(trans('Name'), 'name')
                ->help(trans('The file name that should be searched'))
                ->sortable(),

            FileUpload::make(trans('File'), 'file', 'file')
                ->rules('file', 'max:1500000')
                ->creationRules('required')
                ->updateRules('nullable'),

            Text::make(trans('Mime'), 'mime')
                ->readonly()
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
        return trans('File');
    }

    public static function label(): string
    {
        return trans('Files');
    }

    public static function group(): string
    {
        return trans('Media');
    }
}

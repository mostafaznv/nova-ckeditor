<?php

namespace App\Nova\Resources;

use App\Nova\Resource;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Text;
use Mostafaznv\NovaCkEditor\VideoUpload;
use App\Models\Video as VideoModel;
use Mostafaznv\NovaVideo\VideoMeta;

class Video extends Resource
{
    public static string $model = VideoModel::class;

    public static $search = ['name'];
    public static $title  = 'name';

    public const ATTACHMENT_NAME = 'file';

    public function fields(Request $request): array
    {
        return [
            Text::make(trans('Name'), 'name')
                ->help(trans('The file name that should be searched'))
                ->sortable(),

            VideoUpload::make(trans('Video'), self::ATTACHMENT_NAME, 'video')
                ->rules('file', 'max:150000', 'mimes:mp4', 'mimetypes:video/mp4')
                ->creationRules('required')
                ->updateRules('nullable'),

            VideoMeta::make(self::ATTACHMENT_NAME)->size(),
            VideoMeta::make(self::ATTACHMENT_NAME)->mimeType(),
            VideoMeta::make(self::ATTACHMENT_NAME)->format(),
            VideoMeta::make(self::ATTACHMENT_NAME)->width(),
            VideoMeta::make(self::ATTACHMENT_NAME)->height(),
            VideoMeta::make(self::ATTACHMENT_NAME)->duration(),
        ];
    }

    public function subtitle(): ?string
    {
        return $this->resource->mime ?? '-';
    }

    public static function singularLabel(): string
    {
        return trans('Video');
    }

    public static function label(): string
    {
        return trans('Videos');
    }

    public static function group(): string
    {
        return trans('Media');
    }
}

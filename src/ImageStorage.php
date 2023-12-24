<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image;
use Intervention\Image\Image as InterventionImage;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class ImageStorage extends Storage
{
    public function __construct(string $disk = 'image')
    {
        parent::__construct($disk);

        $this->namingMethod = config('nova-ckeditor.image-naming-method');
    }

    public static function make(string $disk = 'image'): self
    {
        return app('ckeditor-image-storage', compact('disk'));
    }


    public function handleUpload(UploadedFile $file): array
    {
        $attributes = $this->resize($file);

        $file = new UploadedFile(
            path: $attributes['path'],
            originalName: $attributes['file'],
            mimeType: $attributes['mime']
        );

        $file->storePubliclyAs('', $attributes['file'], [
            'disk' => $this->disk
        ]);

        unset($attributes['path']);

        return $attributes;
    }

    protected function resize(UploadedFile $file): array
    {
        $config = config('nova-ckeditor');
        ini_set('memory_limit', $config['memory']);

        $maxWidth = $config['max-width'];
        $maxHeight = $config['max-height'];

        $name = $this->fileName($file);
        $fileName = $this->makeTargetFilename($file, $name);
        $filePath = $this->makeTargetFilePath($fileName);

        $image = $this->resizeImage($file, $maxWidth, $maxHeight)->save($filePath, $config['max-quality']);

        return [
            'file'   => $fileName,
            'path'   => $filePath,
            //'name'   => '$hash',
            'disk'   => $this->disk,
            'mime'   => $image->mime(),
            'width'  => $image->width(),
            'height' => $image->height(),
            'size'   => $this->optimize($filePath),
        ];
    }

    protected function resizeImage(UploadedFile $file, int $maxWidth, int $maxHeight): InterventionImage
    {
        $image = Image::make($file->getRealPath());

        if ($image->width() > $maxWidth || $image->height() > $maxHeight) {
            $image->resize($maxWidth, $maxHeight, function(Constraint $constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }

        return $image;
    }

    public function optimize(string $tempPath): int
    {
        ImageOptimizer::optimize($tempPath);

        return filesize($tempPath);
    }
}

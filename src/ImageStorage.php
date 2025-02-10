<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;
use Mostafaznv\NovaCkEditor\Enums\ImageLibrary;
use Spatie\ImageOptimizer\OptimizerChainFactory;


class ImageStorage extends Storage
{
    protected ImageLibrary $library;


    public function __construct(string $disk = 'image')
    {
        parent::__construct($disk);

        $this->namingMethod = config('nova-ckeditor.image-naming-method');
        $this->library = config('nova-ckeditor.image-processing-library', ImageLibrary::GD);
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
        $quality = $config['max-quality'];

        $name = $this->fileName($file);
        $fileName = $this->makeTargetFilename($file, $name);
        $filePath = $this->makeTargetFilePath($fileName);

        $image = $this->resizeImage($file, $maxWidth, $maxHeight);
        $this->save($image, $quality, $filePath);

        return [
            'file'   => $fileName,
            'path'   => $filePath,
            //'name'   => '$hash',
            'disk'   => $this->disk,
            'mime'   => $image->origin()->mimetype(),
            'width'  => $image->width(),
            'height' => $image->height(),
            'size'   => $this->optimize($filePath),
        ];
    }

    protected function resizeImage(UploadedFile $file, int $maxWidth, int $maxHeight): ImageInterface
    {
        $manager = $this->library == ImageLibrary::GD
            ? ImageManager::gd()
            : ImageManager::imagick();

        $image = $manager->read($file->getRealPath());

        return $image->scaleDown($maxWidth, $maxHeight);
    }

    protected function save(ImageInterface $image, int $quality, string $path): void
    {
        $image = match ($image->origin()->mimetype()) {
            'image/webp' => $image->toWebp($quality),
            'image/avif' => $image->toAvif($quality),
            'image/jpeg' => $image->toJpeg($quality),
            default      => $image->encode(),
        };

        $image->save($path);
    }

    public function optimize(string $tempPath): int
    {
        OptimizerChainFactory::create()->optimize($tempPath);

        return filesize($tempPath);
    }
}

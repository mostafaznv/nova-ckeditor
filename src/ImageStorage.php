<?php
declare(strict_types=1);

namespace Mostafaznv\NovaCkEditor;

use Throwable;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Constraint;
use Intervention\Image\Facades\Image;
use Intervention\Image\Image as InterventionImage;
use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;

class ImageStorage
{
    /**
     * Storage Disk
     *
     * @var string
     */
    private string $disk;


    /**
     * ImageStorage constructor
     *
     * @param string $disk
     */
    public function __construct(string $disk = 'image')
    {
        $this->disk = $disk;
    }

    /**
     * Make Instance
     *
     * @param string $disk
     * @return static
     */
    public static function make(string $disk = 'image'): self
    {
        return app('ckeditor-image-storage', compact('disk'));
    }

    /**
     * Save a new image file from the Nova request
     *
     * @param Request $request
     * @return array
     * @throws Throwable
     */
    public function __invoke(Request $request): array
    {
        return $this->handleUpload($request->file('file'));
    }

    /**
     * Handle the File Upload
     *
     * @param UploadedFile $file
     * @return array
     * @throws Throwable
     */
    public function handleUpload(UploadedFile $file): array
    {
        $attributes = $this->resize($file);

        $file->storePubliclyAs('', $attributes['file'], [
            'disk' => $this->disk
        ]);

        return $attributes;
    }

    /**
     * Perform Resize & Conversion Operations
     *
     * @param UploadedFile $file
     * @return array
     * @throws Throwable
     */
    protected function resize(UploadedFile $file): array
    {
        $config = config('nova-ckeditor');
        ini_set('memory_limit', $config['memory']);

        $maxWidth = $config['max-width'];
        $maxHeight = $config['max-height'];

        $hash = $this->hashFileContents($file);
        $fileName = $this->makeTargetFilename($file, $hash);
        $filePath = $this->makeTargetFilePath($fileName);

        $image = $this->resizeImage($file, $maxWidth, $maxHeight)->save($filePath, $config['max-quality']);

        return [
            'file'   => $fileName,
            //'name'   => '$hash',
            'disk'   => $this->disk,
            'mime'   => $image->mime(),
            'width'  => $image->width(),
            'height' => $image->height(),
            'size'   => $this->optimize($filePath),
        ];
    }

    /**
     * Generate hash from file content
     *
     * @param UploadedFile $file
     * @return string
     */
    protected function hashFileContents(UploadedFile $file): string
    {
        return md5_file($file->getRealPath());
    }

    /**
     * Create file name with extension
     *
     * @param UploadedFile $file
     * @param string $name
     * @return string
     */
    protected function makeTargetFilename(UploadedFile $file, string $name): string
    {
        return sprintf("%s.%s", $name, $file->guessExtension());
    }

    /**
     * Make target file path
     *
     * @param string $name
     * @return string
     */
    protected function makeTargetFilePath(string $name): string
    {
        return sys_get_temp_dir() . DIRECTORY_SEPARATOR . $name;
    }

    /**
     * Resize Image
     *
     * @param UploadedFile $file
     * @param int $maxWidth
     * @param int $maxHeight
     * @return InterventionImage
     */
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

    /**
     * Perform Optimization Operations
     *
     * @param string $tempPath
     * @return int
     * @throws Throwable
     */
    public function optimize(string $tempPath): int
    {
        ImageOptimizer::optimize($tempPath);

        return filesize($tempPath);
    }

    /**
     * Get formatted bytes
     *
     * @param int $bytes
     * @return string
     */
    public static function bytesForHumans(int $bytes): string
    {
        $units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get the URL for the media file
     *
     * @param string $file
     * @return string
     */
    public function url(string $file): string
    {
        return Storage::disk($this->disk)->url($file);
    }
}

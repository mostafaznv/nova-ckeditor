<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage as StorageFacade;


abstract class Storage
{
    protected string $disk;
    protected string $namingMethod;


    public function __construct(string $disk = 'audio')
    {
        $this->disk = $disk;
    }

    public function __invoke(Request $request): array
    {
        return $this->handleUpload($request->file('file'));
    }


    public abstract function handleUpload(UploadedFile $file): array;

    protected function fileName(UploadedFile $file): string
    {
        if ($this->namingMethod == 'real-file-name') {
            return $this->getRealFileName($file);
        }
        else if ($this->namingMethod == 'unique-real-file-name') {
            return $this->getRealFileName($file) . '-' . uniqid();
        }

        return md5_file($file->getRealPath());
    }

    protected function getRealFileName(UploadedFile $file): string
    {
        return Str::kebab(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
    }

    protected function makeTargetFilename(UploadedFile $file, string $name): string
    {
        return sprintf("%s.%s", $name, $file->guessExtension());
    }

    protected function makeTargetFilePath(string $name): string
    {
        return sys_get_temp_dir() . DIRECTORY_SEPARATOR . $name;
    }

    public static function bytesForHumans(int $bytes): string
    {
        $units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function url(string $file): string
    {
        return StorageFacade::disk($this->disk)->url($file);
    }
}

<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Http\UploadedFile;


class FileStorage extends Storage
{
    public function __construct(string $disk = 'file')
    {
        parent::__construct($disk);

        $this->namingMethod = config('nova-ckeditor.file-naming-method') ?? 'hash-file';
    }

    public static function make(string $disk = 'file'): self
    {
        return app('ckeditor-file-storage', compact('disk'));
    }


    public function handleUpload(UploadedFile $file): array
    {
        $name = $this->fileName($file);
        $fileName = $this->makeTargetFilename($file, $name);

        $file->storePubliclyAs('', $fileName, [
            'disk' => $this->disk
        ]);


        return [
            //'name' => $this->getRealFileName($file),
            'file' => $fileName,
            'disk' => $this->disk,
            'size' => $file->getSize(),
            'mime' => $file->getClientMimeType(),
        ];
    }
}

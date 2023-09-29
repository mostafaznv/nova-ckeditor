<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Http\UploadedFile;


class AudioStorage extends Storage
{
    public function __construct(string $disk = 'audio')
    {
        parent::__construct($disk);

        $this->namingMethod = config('nova-ckeditor.audio-naming-method');
    }

    public static function make(string $disk = 'audio'): self
    {
        return app('ckeditor-audio-storage', compact('disk'));
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
        ];
    }
}

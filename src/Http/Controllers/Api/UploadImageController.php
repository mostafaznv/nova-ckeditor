<?php

namespace Mostafaznv\NovaCkEditor\Http\Controllers\Api;


use App\Nova\Resources\Image;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Mostafaznv\Larupload\Traits\Larupload;
use Mostafaznv\NovaCkEditor\ImageUpload;


class UploadImageController extends ApiController
{
    private string $model;
    private string $toolbar;


    public function __construct()
    {
        $this->model = config('nova-ckeditor.image-model', 'App\Models\Image');
    }


    public function __invoke(Request $request): JsonResponse
    {
        $this->toolbar = $request->header('X-Toolbar');

        if ($error = $this->validate($request)) {
            return $this->errorResponse($error);
        }

        if (!$this->uploadIsEnabled()) {
            $message = __('Upload is not enabled.');

            return $this->errorResponse($message, 403);
        }


        return response()->json([
            'url' => $this->hasLaruploadTrait()
                ? $this->uploadWithLarupload($request)
                : $this->uploadWithCustomStorage($request)
        ]);
    }


    private function validate(Request $request): ?string
    {
        $errors = Validator::make($request->all(), $this->rules())->errors();

        if ($errors->has('upload')) {
            return implode(', ', $errors->get('upload'));
        }

        return null;
    }

    private function rules(): array
    {
        $options = config("nova-ckeditor.toolbars.$this->toolbar.image.insert");
        $maxSize = 1500;
        $mimeTypes = 'jpg,jpeg,png,gif,webp';

        if ($this->toolbar and $options) {
            $maxSize = $options['size'];
            $mimeTypes = implode(',', $options['types']);
        }

        return [
            'upload' => [
                'required', 'file', "mimes:$mimeTypes", "max:$maxSize"
            ],
        ];
    }

    private function uploadIsEnabled(): bool
    {
        return config("nova-ckeditor.toolbars.$this->toolbar.browser.image", false);
    }

    private function hasLaruploadTrait(): bool
    {
        return class_exists($this->model) and in_array(Larupload::class, class_uses($this->model));
    }

    private function uploadWithCustomStorage(Request $request): ?string
    {
        $disk = 'image';
        $model = $this->model;
        $file = $request->file('upload');

        foreach (Image::make()->fields(request()) as $field) {
            if (is_a($field, ImageUpload::class) or $field->component === 'file-field') {
                $disk = $field->disk;

                break;
            }
        }


        $storage = app('ckeditor-image-storage', compact('disk'));
        $upload = $storage->handleUpload($file);

        $model = new $model;
        $model->name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $model->file = $upload['file'];
        $model->disk = $upload['disk'];
        $model->mime = $upload['mime'];
        $model->width = $upload['width'];
        $model->height = $upload['height'];
        $model->size = $upload['size'];
        $model->save();

        return $storage->url($upload['file']);
    }

    private function uploadWithLarupload(Request $request): ?string
    {
        $model = $this->model;
        $file = $request->file('upload');

        $model = new $model;
        $model->attachment('file')->attach($file);
        $model->save();


        return $model->attachment('file')->url();
    }

    private function errorResponse(string $error, int $status = 422): JsonResponse
    {
        return response()->json([
            'error' => [
                'message' => $error
            ]
        ], $status);
    }
}

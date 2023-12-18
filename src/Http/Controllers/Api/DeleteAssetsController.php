<?php

namespace Mostafaznv\NovaCkEditor\Http\Controllers\Api;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Laravel\Nova\Resource;
use Mostafaznv\NovaCkEditor\Http\Requests\Api\DeleteAssetsRequest;


class DeleteAssetsController extends ApiController
{
    public function __invoke(DeleteAssetsRequest $request): JsonResponse
    {
        /** @var Resource $resource */
        $resource = $request->input('resource');
        $resource = $resource::make();

        if ($resource->authorizedToDelete($request)) {
            /** @var Model $model */
            $model = $resource::$model;

            $model::query()
                ->whereIn('id', $request->input('id'))
                ->delete();

            return response()->json();
        }

        return response()->json([
            'message' => trans('Unauthorized'),
        ], 403);
    }
}

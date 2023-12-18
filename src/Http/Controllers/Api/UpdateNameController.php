<?php

namespace Mostafaznv\NovaCkEditor\Http\Controllers\Api;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Laravel\Nova\Resource;
use Mostafaznv\NovaCkEditor\Http\Requests\Api\UpdateNameRequest;


class UpdateNameController extends ApiController
{
    public function __invoke(UpdateNameRequest $request): JsonResponse
    {
        /** @var Resource $resource */
        $resource = $request->input('resource');
        $resource = $resource::make();

        if ($resource->authorizedToUpdate($request)) {
            /** @var Model $model */
            $model = $resource::$model;
            $model = $model::query()->find($request->input('id'));

            $model->update([
                'name' => $request->input('name'),
            ]);

            return response()->json();
        }

        return response()->json([
            'message' => trans('Unauthorized'),
        ], 403);
    }
}

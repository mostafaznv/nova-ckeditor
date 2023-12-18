<?php

use Illuminate\Support\Facades\Route;
use Mostafaznv\NovaCkEditor\Http\Controllers\Api\DeleteAssetsController;
use Mostafaznv\NovaCkEditor\Http\Controllers\Api\UpdateNameController;
use Mostafaznv\NovaCkEditor\Http\Controllers\Api\UploadImageController;


Route::as('nova-ckeditor.')->middleware('nova')->group(function () {
    Route::prefix('image')->name('image.')->group(function () {
        Route::post('/', UploadImageController::class)->name('upload');
    });


    Route::put('update-name', UpdateNameController::class)->name('update-name');
    Route::post('delete-assets', DeleteAssetsController::class)->name('delete-assets');
});

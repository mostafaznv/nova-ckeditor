<?php

namespace Mostafaznv\NovaCkEditor;

use Illuminate\Support\Facades\Route;
use Laravel\Nova\Nova;
use Illuminate\Support\Facades\App;
use Laravel\Nova\Events\ServingNova;
use Illuminate\Support\ServiceProvider;


class FieldServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if (!$this->app->bound('ckeditor-image-storage')) {
            $this->app->bind('ckeditor-image-storage', ImageStorage::class);
        }

        if (!$this->app->bound('ckeditor-audio-storage')) {
            $this->app->bind('ckeditor-audio-storage', AudioStorage::class);
        }

        if (!$this->app->bound('ckeditor-file-storage')) {
            $this->app->bind('ckeditor-file-storage', FileStorage::class);
        }

        if ($this->app->runningInConsole()) {
            $this->publish();
        }

        $this->mergeConfigFrom(__DIR__ . '/../config/nova-ckeditor.php', 'nova-ckeditor');
    }

    public function boot(): void
    {
        Nova::serving(function(ServingNova $event) {
            Nova::provideToScript(['ckeditor' => config('nova-ckeditor', [])]);
            Nova::style('field-ckeditor', __DIR__ . '/../dist/css/field.css');

            $this->registerUiLanguageScripts();

            // allow hot reloading
            if (App::environment('local') && file_exists(__DIR__ . '/../dist/hot')) {
                Nova::remoteScript('http://localhost:8080/js/field.js');
            }
            else {
                Nova::script('field-ckeditor', __DIR__ . '/../dist/js/field.js');
            }
        });

        $this->app->booted(function() {
            $this->routes();
        });
    }

    protected function publish(): void
    {
        $this->publishes([
            __DIR__ . '/../config/nova-ckeditor.php' => config_path('nova-ckeditor.php')
        ], 'nova-ckeditor-config');

        $this->publishes([
            # views
            __DIR__ . '/../stubs/views' => resource_path('views/ckeditor'),

            # migrations
            __DIR__ . '/../stubs/migrations/2021_01_01_000000_create_images_table.stub' => database_path('migrations/2021_01_01_000000_create_images_table.php'),
            __DIR__ . '/../stubs/migrations/2021_01_01_000000_create_videos_table.stub' => database_path('migrations/2021_01_01_000000_create_videos_table.php'),
            __DIR__ . '/../stubs/migrations/2023_09_28_114516_create_audio_table.stub' => database_path('migrations/2023_09_28_114516_create_audio_table.php'),
            __DIR__ . '/../stubs/migrations/2024_04_03_114516_create_files_table.stub' => database_path('migrations/2024_04_03_114516_create_files_table.php'),

            # models
            __DIR__ . '/../stubs/models/Image.stub' => app_path('Models/Image.php'),
            __DIR__ . '/../stubs/models/Video.stub' => app_path('Models/Video.php'),
            __DIR__ . '/../stubs/models/Audio.stub' => app_path('Models/Audio.php'),
            __DIR__ . '/../stubs/models/File.stub' => app_path('Models/File.php'),

            # resources
            __DIR__ . '/../stubs/resources/Image.stub' => app_path('Nova/Resources/Image.php'),
            __DIR__ . '/../stubs/resources/Video.stub' => app_path('Nova/Resources/Video.php'),
            __DIR__ . '/../stubs/resources/Audio.stub' => app_path('Nova/Resources/Audio.php'),
            __DIR__ . '/../stubs/resources/File.stub' => app_path('Nova/Resources/File.php'),
        ], 'nova-ckeditor-stubs');
    }

    private function routes(): void
    {
        if ($this->app->routesAreCached()) {
            return;
        }

        Route::middleware(['nova:api'])
            ->prefix('nova-vendor/nova-ckeditor')
            ->group(__DIR__ . '/../routes/api.php');
    }

    private function registerUiLanguageScripts(): void {
        $toolbars = config('nova-ckeditor.toolbars');
        $scripts = [];

        foreach ($toolbars as $key => $toolbar) {
            if (isset($toolbars[$key]['ui-language']['script'])) {
                $scripts[] = $toolbars[$key]['ui-language']['script'];
            }
        }

        $scripts = array_unique($scripts);

        foreach ($scripts as $script) {
            Nova::script('ckeditor-lang', $script);
        }
    }
}

<?php

namespace Mostafaznv\NovaCkEditor;

use Composer\InstalledVersions;
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
    }

    protected function publish(): void
    {
        $videoStub = $this->isLegacy() ? 'Video.legacy.stub' : 'Video.stub';

        $this->publishes([
            __DIR__ . '/../config/nova-ckeditor.php' => config_path('nova-ckeditor.php')
        ], 'nova-ckeditor-config');

        $this->publishes([
            # views
            __DIR__ . '/../stubs/views' => resource_path('views/ckeditor'),

            # migrations
            __DIR__ . '/../stubs/migrations/2021_01_01_000000_create_images_table.stub' => database_path('migrations/2021_01_01_000000_create_images_table.php'),
            __DIR__ . '/../stubs/migrations/2021_01_01_000000_create_videos_table.stub' => database_path('migrations/2021_01_01_000000_create_videos_table.php'),

            # models
            __DIR__ . '/../stubs/models/Image.stub' => app_path('Models/Image.php'),
            __DIR__ . "/../stubs/models/$videoStub" => app_path('Models/Video.php'),

            # resources
            __DIR__ . '/../stubs/resources/Image.stub' => app_path('Nova/Resources/Image.php'),
            __DIR__ . '/../stubs/resources/Video.stub' => app_path('Nova/Resources/Video.php')
        ], 'nova-ckeditor-stubs');
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

    private function isLegacy(): bool
    {
        $larupload = InstalledVersions::getVersion('mostafaznv/larupload');

        return version_compare($larupload, '1.0.0', '<');
    }
}

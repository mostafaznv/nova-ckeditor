<?php

namespace Mostafaznv\NovaCkEditor;

use Laravel\Nova\Fields\Expandable;
use Laravel\Nova\Fields\Field;
use Laravel\Nova\Fields\SupportsDependentFields;
use Mostafaznv\Larupload\Traits\Larupload;
use Mostafaznv\NovaVideo\Video;

/**
 * @method static static make(mixed $name, string|\Closure|callable|object|null $attribute = null, callable|null $resolveCallback = null)
 */
class CkEditor extends Field
{
    use SupportsDependentFields, Expandable;

    /**
     * The field's component
     *
     * @var string $component
     */
    public $component = 'ckeditor';

    /**
     * Specifies the toolbar name
     *
     * @var string $toolbarName
     */
    public string $toolbarName;

    /**
     * Specifies the available toolbar items
     *
     * @var array $toolbar
     */
    public array $toolbar;

    /**
     * Specifies the toolbar options
     *
     * @var array
     */
    public array $toolbarOptions;

    /**
     * Specifies the editor default height in pixels
     *
     * @var int $height
     */
    public int $height;

    /**
     * Specifies character limitation on index table
     *
     * @var int $indexLimit
     */
    public int $indexLimit = 85;

    /**
     * Content Language
     *
     * @var string
     */
    public string $contentLanguage;

    /**
     * Force Paste As Plain Text
     *
     * @var bool
     */
    public bool $forcePasteAsPlainText;

    /**
     * Text Part Language
     *
     * @var array
     */
    public array $textPartLanguage;

    /**
     * General HTML Support
     *
     * @var array
     */
    public array $htmlSupport;

    /**
     * UI Language
     *
     * @var string
     */
    public string $uiLanguage = 'en';

    /**
     * Indicates whether the editor shows 3 dots in overflow mode
     *
     * @var bool
     */
    public bool $shouldNotGroupWhenFull = false;

    /**
     * Indicates whether the image browser should be available
     *
     * @var bool $imageBrowser
     */
    public bool $imageBrowser;

    /**
     * Indicates whether the video browser should be available
     *
     * @var bool $videoBrowser
     */
    public bool $videoBrowser;

    /**
     * Indicates whether the audio browser should be available
     *
     * @var bool $audioBrowser
     */
    public bool $audioBrowser;

    /**
     * Indicates whether the file browser should be available
     *
     * @var bool $fileBrowser
     */
    public bool $fileBrowser;

    /**
     * The snippets to be displayed in the snippet browser
     *
     * @var array
     */
    public array $snippetBrowser = [];

    /**
     * Specifies the path of your video model
     *
     * @var string
     */
    public string $videoModel = '';

    /**
     * Specifies the path of your image model
     *
     * @var string
     */
    public string $imageModel = '';


    public function __construct($name, $attribute = null, callable $resolveCallback = null)
    {
        parent::__construct($name, $attribute, $resolveCallback);

        $this->prepareToolbar(
            config('nova-ckeditor.toolbars.default')
        );

        $this->videoModel = config('nova-ckeditor.video-model');
        $this->imageModel = config('nova-ckeditor.image-model', 'App\Models\Image');
    }


    /**
     * Set the toolbar name and items
     *
     * @param string $name
     * @param array|null $items
     * @return $this
     */
    public function toolbar(string $name, array $items = null): self
    {
        $this->prepareToolbar($name, $items);

        return $this;
    }

    /**
     * Set the editor height
     *
     * @param int $pixels
     * @return $this
     */
    public function height(int $pixels): self
    {
        $this->height = $pixels;

        return $this;
    }

    /**
     * Set character limit on index
     *
     * @param int $limit
     * @return $this
     */
    public function limitOnIndex(int $limit): self
    {
        $this->indexLimit = $limit;

        return $this;
    }

    /**
     * Set Content Language
     *
     * @param string $lang
     * @return $this
     */
    public function contentLanguage(string $lang): self
    {
        $this->contentLanguage = $lang;

        return $this;
    }

    /**
     * Set Force Paste As Plain Text
     *
     * @param bool $status
     * @return $this
     */
    public function forcePasteAsPlainText(bool $status = true): self
    {
        $this->forcePasteAsPlainText = $status;

        return $this;
    }

    /**
     * Set Text Part Language
     *
     * @param array $languages
     * @return $this
     */
    public function textPartLanguage(array $languages): self
    {
        $this->textPartLanguage = $languages;

        return $this;
    }

    /**
     * Set General HTML Support
     *
     * @param array $htmlSupport
     * @return $this
     */
    public function htmlSupport(array $htmlSupport): self
    {
        $this->htmlSupport = $htmlSupport;

        return $this;
    }

    /**
     * Set Should Not Group When Full
     *
     * @param bool $status
     * @return $this
     */
    public function shouldNotGroupWhenFull(bool $status = true): self
    {
        $this->shouldNotGroupWhenFull = $status;

        return $this;
    }

    /**
     * Enable/Disable Image Browser
     *
     * @param bool $enabled
     * @return $this
     */
    public function imageBrowser(bool $enabled = true): self
    {
        $this->imageBrowser = $enabled;

        return $this;
    }

    /**
     * Enable/Disable Video Browser
     *
     * @param bool $enabled
     * @return $this
     */
    public function videoBrowser(bool $enabled = true): self
    {
        $this->videoBrowser = $enabled;

        return $this;
    }

    /**
     * Enable/Disable Audio Browser
     *
     * @param bool $enabled
     * @return $this
     */
    public function audioBrowser(bool $enabled = true): self
    {
        $this->audioBrowser = $enabled;

        return $this;
    }

    /**
     * Enable/Disable File Browser
     *
     * @param bool $enabled
     * @return $this
     */
    public function fileBrowser(bool $enabled = true): self
    {
        $this->fileBrowser = $enabled;

        return $this;
    }

    /**
     * Enable Snippets Browser
     *
     * @param array $snippets
     * @return $this
     */
    public function snippets(array $snippets): self
    {
        $this->snippetBrowser = $this->prepareSnippets($snippets);

        return $this;
    }

    /**
     * Prepare the element for JSON serialization
     *
     * @return array
     */
    public function jsonSerialize(): array
    {
        return array_merge(parent::jsonSerialize(), [
            'toolbarName'            => $this->toolbarName,
            'snippetBrowser'         => $this->snippetBrowser,
            'imageBrowser'           => $this->imageBrowser,
            'videoBrowser'           => $this->videoBrowser,
            'audioBrowser'           => $this->audioBrowser,
            'fileBrowser'            => $this->fileBrowser,
            'toolbar'                => $this->toolbar,
            'toolbarOptions'         => $this->toolbarOptions,
            'height'                 => $this->height,
            'indexLimit'             => $this->indexLimit,
            'contentLanguage'        => $this->contentLanguage,
            'forcePasteAsPlainText'  => $this->forcePasteAsPlainText,
            'textPartLanguage'       => $this->textPartLanguage,
            'htmlSupport'            => $this->htmlSupport,
            'uiLanguage'             => $this->uiLanguage,
            'shouldNotGroupWhenFull' => $this->shouldNotGroupWhenFull,
            'shouldShow'             => $this->shouldBeExpanded(),
            'videoHasLaruploadTrait' => $this->videoHasLaruploadTrait(),
            'imageHasLaruploadTrait' => $this->imageHasLaruploadTrait()
        ]);
    }

    /**
     * Render Snippets as HTML
     *
     * @param array $snippets
     * @return array
     */
    protected function prepareSnippets(array $snippets): array
    {
        foreach ($snippets as $key => $snippet) {
            $snippet['html'] = view($snippet['html'])->render();
            $snippets[$key] = $snippet;
        }

        return $snippets;
    }

    /**
     * Check if image class has larupload trait
     *
     * @return bool
     */
    private function imageHasLaruploadTrait(): bool
    {
        if ($this->imageModel) {
            return $this->hasLaruploadTrait($this->imageModel);
        }

        return false;
    }

    /**
     * Check if video class has larupload trait
     *
     * @return bool
     */
    private function videoHasLaruploadTrait(): bool
    {
        if ($this->videoModel) {
            return $this->hasLaruploadTrait($this->videoModel);
        }

        return false;
    }

    /**
     * Check if class has larupload trait
     *
     * @param string $class
     * @return bool
     */
    private function hasLaruploadTrait(string $class): bool
    {
        return class_exists($class) and in_array(Larupload::class, class_uses($class));
    }

    private function prepareToolbar(string $toolbar, array $items = null): void
    {
        $this->toolbarName = $toolbar;

        $toolbar = config('nova-ckeditor.toolbars.' . $toolbar);

        $defaultTextPartLanguage = [
            ['title' => 'Farsi', 'languageCode' => 'fa'],
            ['title' => 'English', 'languageCode' => 'en']
        ];

        $defaultHtmlSupport = [
            'allow'    => [],
            'disallow' => []
        ];

        $this->toolbar = is_null($items) ? $toolbar['items'] : $items;
        $this->toolbarOptions = $toolbar['options'];
        $this->height = $toolbar['height'];
        $this->imageBrowser = $toolbar['browser']['image'];
        $this->videoBrowser = $toolbar['browser']['video'];
        $this->audioBrowser = $toolbar['browser']['audio'] ?? true;
        $this->fileBrowser = $toolbar['browser']['file'] ?? false;
        $this->snippetBrowser = $this->prepareSnippets($toolbar['snippets']);
        $this->contentLanguage = $toolbar['content-lang'];
        $this->forcePasteAsPlainText = $toolbar['force-paste-as-plain-text'] ?? false;
        $this->textPartLanguage = $toolbar['text-part-language'] ?? $defaultTextPartLanguage;
        $this->htmlSupport = $toolbar['html-support'] ?? $defaultHtmlSupport;
        $this->uiLanguage = $toolbar['ui-language']['name'] ?? 'en';
        $this->shouldNotGroupWhenFull = $toolbar['should-not-group-when-full'];
    }
}

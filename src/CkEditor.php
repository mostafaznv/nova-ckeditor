<?php

namespace Mostafaznv\NovaCkEditor;

use Laravel\Nova\Fields\Expandable;
use Laravel\Nova\Fields\Field;
use Mostafaznv\Larupload\Traits\Larupload;

class CkEditor extends Field
{
    use Expandable;

    /**
     * The field's component
     *
     * @var string $component
     */
    public $component = 'ckeditor';

    /**
     * Specifies the available toolbar items
     *
     * @var array $toolbar
     */
    public array $toolbar;

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
     * Text Part Language
     *
     * @var array
     */
    public array $textPartLanguage;

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
     * Heading options
     *
     * @var array
     */
    public array $headings = [];


    public function __construct($name, $attribute = null, callable $resolveCallback = null)
    {
        parent::__construct($name, $attribute, $resolveCallback);

        $config = config('nova-ckeditor');

        $defaultTextPartLanguage = [
            ['title' => 'Farsi', 'languageCode' => 'fa'],
            ['title' => 'English', 'languageCode' => 'en']
        ];

        $this->toolbar = $config['toolbar']['items'];
        $this->height = $config['toolbar']['height'];
        $this->imageBrowser = $config['toolbar']['browser']['image'];
        $this->videoBrowser = $config['toolbar']['browser']['video'];
        $this->snippetBrowser = $this->prepareSnippets($config['toolbar']['snippets']);
        $this->contentLanguage = $config['toolbar']['content-lang'];
        $this->textPartLanguage = $config['toolbar']['text-part-language'] ?? $defaultTextPartLanguage;
        $this->uiLanguage = $config['toolbar']['ui-language']['name'] ?? 'en';
        $this->shouldNotGroupWhenFull = $config['toolbar']['should-not-group-when-full'];
        $this->videoModel = $config['video-model'];
        $this->headings = $config['headings'];
    }


    /**
     * Set the toolbar item layout
     *
     * @param array $items
     * @return $this
     */
    public function toolbar(array $items): self
    {
        $this->toolbar = $items;

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
     * Add heading options.
     *
     * @param array $headings
     * @return $this
     */
    public function headings(array $headings = []): self
    {
        $this->headings = $headings;

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
            'snippetBrowser'         => $this->snippetBrowser,
            'imageBrowser'           => $this->imageBrowser,
            'videoBrowser'           => $this->videoBrowser,
            'toolbar'                => $this->toolbar,
            'toolbarOptions'         => config('nova-ckeditor.toolbar.options'),
            'height'                 => $this->height,
            'indexLimit'             => $this->indexLimit,
            'contentLanguage'        => $this->contentLanguage,
            'textPartLanguage'       => $this->textPartLanguage,
            'uiLanguage'             => $this->uiLanguage,
            'shouldNotGroupWhenFull' => $this->shouldNotGroupWhenFull,
            'shouldShow'             => $this->shouldBeExpanded(),
            'videoHasLaruploadTrait' => $this->hasLaruploadTrait(),
            'headings'               => $this->headings,
        ]);
    }

    /**
     * Check if class has larupload trait
     *
     * @return bool
     */
    protected function hasLaruploadTrait(): bool
    {
        if ($this->videoModel) {
            $class = $this->videoModel;

            return class_exists($class) and in_array(Larupload::class, class_uses($class));
        }

        return false;
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
}

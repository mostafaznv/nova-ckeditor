# Media Embed

The [media embed](https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html) feature adds support for easily inserting embeddable media, such as YouTube or Vimeo videos and tweets, into your rich text content.

* To embed media, you can utilize the <mark style="color:red;">Insert media</mark>  [![](https://user-images.githubusercontent.com/7619687/212122242-26996316-aca1-4dcd-9117-6b17a3f77fe5.png)](https://user-images.githubusercontent.com/7619687/212122242-26996316-aca1-4dcd-9117-6b17a3f77fe5.png) button available in the toolbar.
* Alternatively, you can directly paste the media URL into the editor content, and it will be automatically embedded for you.



#### Configuration:

To configure the media embed feature, you have the option to override `providers` or add `extraProviders` through the configuration file.

{% code title="config/nova-ckeditor.php" %}
```php
<?php

return [
    ...
    'toolbar' => [
        ...

        'options' => [
            ...

            'mediaEmbed' => [
                'providers' => [
                    [
                        'name' => 'youtube',
                        'url'  => [
                            '/^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)(?:&t=(\d+))?/',
                            '/^(?:m\.)?youtube\.com\/v\/([\w-]+)(?:\?t=(\d+))?/',
                            '/^youtube\.com\/embed\/([\w-]+)(?:\?start=(\d+))?/',
                            '/^youtu\.be\/([\w-]+)(?:\?t=(\d+))?/'
                        ],
                        'html' => '
                            <div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: calc(56.2493% + 26px);">
                                <div><b>id</b>: ${match[1]}, <b>start</b>: ${match[2]}</div>
                                <iframe
                                    src="https://www.youtube.com/embed/${match[1]}${match[2] ? `?start=${match[2]}` : ""}"
                                    style="position: absolute; width: 100%; height: calc(100% - 26px); top: 26px; left: 0;"
                                    frameborder="0"
                                    allow="autoplay; encrypted-media"
                                    allowfullscreen
                                />
                            </div>'
                    ]
                ],
                
                // or
                'extraProviders' => [
                    [
                        'name' => 'example',
                        'url'  => '/^example\.com\/media\/(\w+)\/(.+)/',
                        'html' => '<p>first: ${match[1]}</p><p>second: ${match[2]}</p>'
                    ]
                ]
            ],
        ]
    ],
];

```
{% endcode %}

{% hint style="info" %}
For more detailed information and instructions on configuring media embed, please refer to the official documentation: [Media Embed Documentation](https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html)
{% endhint %}




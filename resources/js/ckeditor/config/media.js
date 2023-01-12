/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html#installation
 */
export default {
    mediaEmbed: {
        previewsInData: true,
        elementName: 'oembed',
        providers: [
            {
                name: 'dailymotion',
                url: /^dailymotion\.com\/video\/(\w+)/,
                html: match => {
                    const id = match[1];

                    return (
                        '<div style="position: relative; padding-bottom: 100%; height: 0; ">' +
                        `<iframe src="https://www.dailymotion.com/embed/video/${id}" ` +
                        'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                        'frameborder="0" width="480" height="270" allowfullscreen allow="autoplay">' +
                        '</iframe>' +
                        '</div>'
                    );
                }
            },
            {
                name: 'spotify',
                url: [
                    /^open\.spotify\.com\/(artist\/\w+)/,
                    /^open\.spotify\.com\/(album\/\w+)/,
                    /^open\.spotify\.com\/(track\/\w+)/
                ],
                html: match => {
                    const id = match[1];

                    return (
                        '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 126%;">' +
                        `<iframe src="https://open.spotify.com/embed/${id}" ` +
                        'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                        'frameborder="0" allowtransparency="true" allow="encrypted-media">' +
                        '</iframe>' +
                        '</div>'
                    );
                }
            },
            {
                name: 'youtube',
                url: [
                    /^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)(?:&t=(\d+))?/,
                    /^(?:m\.)?youtube\.com\/v\/([\w-]+)(?:\?t=(\d+))?/,
                    /^youtube\.com\/embed\/([\w-]+)(?:\?start=(\d+))?/,
                    /^youtu\.be\/([\w-]+)(?:\?t=(\d+))?/
                ],
                html: match => {
                    const id = match[1];
                    const time = match[2];

                    return (
                        '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                        `<iframe src="https://www.youtube.com/embed/${id}${time ? `?start=${time}` : ''}" ` +
                        'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                        'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                        '</iframe>' +
                        '</div>'
                    );
                }
            },
            {
                name: 'vimeo',
                url: [
                    /^vimeo\.com\/(\d+)/,
                    /^vimeo\.com\/[^/]+\/[^/]+\/video\/(\d+)/,
                    /^vimeo\.com\/album\/[^/]+\/video\/(\d+)/,
                    /^vimeo\.com\/channels\/[^/]+\/(\d+)/,
                    /^vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
                    /^vimeo\.com\/ondemand\/[^/]+\/(\d+)/,
                    /^player\.vimeo\.com\/video\/(\d+)/
                ],
                html: match => {
                    const id = match[1];

                    return (
                        '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                        `<iframe src="https://player.vimeo.com/video/${id}" ` +
                        'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                        'frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>' +
                        '</iframe>' +
                        '</div>'
                    );
                }
            },
            {
                name: 'instagram',
                url: /^instagram\.com\/p\/(\w+)/
            },
            {
                name: 'twitter',
                url: /^twitter\.com/
            },
            {
                name: 'googleMaps',
                url: [
                    /^google\.com\/maps/,
                    /^goo\.gl\/maps/,
                    /^maps\.google\.com/,
                    /^maps\.app\.goo\.gl/
                ]
            },
            {
                name: 'flickr',
                url: /^flickr\.com/
            },
            {
                name: 'facebook',
                url: /^facebook\.com/
            }
        ]
    },
}

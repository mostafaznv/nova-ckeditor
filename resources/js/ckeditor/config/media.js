/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/media-embed.html#installation
 */
export default {
    mediaEmbed: {
        previewsInData: true,
        providers: [
            {
                name: 'youtube',
                url: [
                    /^https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/,
                    /^https:\/\/www\.youtube\.com\/v\/([\w-]+)/,
                    /^https:\/\/www\.youtube\.com\/embed\/([\w-]+)/,
                    /^https:\/\/www\.youtu\.be\/([\w-]+)/
                ],
                html: match => `
                        <div class="embed-responsive embed-responsive-16by9">
                            <iframe src="https://www.youtube.com/embed/${match[1]}" class="embed-responsive-item" allowfullscreen></iframe>
                        </div>
                   `
            },
        ]
    },
}

/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/image.html
 */
export default {
    image: {
        upload: {
            types: ['gif', 'png', 'jpg', 'jpeg', 'webp']
        },
        toolbar: [
            'imageBrowser',
            '|',
            'imageStyle:full',
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
            '|',
            'imageTextAlternative',
            'toggleImageCaption',
            '|',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'linkImage'
        ],
        styles: [
            'full',
            'alignLeft',
            'alignCenter',
            'alignRight',
        ]
    }
}

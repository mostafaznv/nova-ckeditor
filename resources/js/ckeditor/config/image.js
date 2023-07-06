/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/image.html
 */
export default {
    image: {
        upload: {
            types: ['gif', 'png', 'jpg', 'jpeg', 'webp']
        },
        resizeUnit: '%',
        resizeOptions: [
            {
                name: 'resizeImage:original',
                value: null,
                label: 'Original',
                icon: 'original'
            },
            {
                name: 'resizeImage:25',
                value: '25',
                label: 'Small (25%)',
                icon: 'small'
            },
            {
                name: 'resizeImage:50',
                value: '50',
                label: 'Medium (50%)',
                icon: 'medium'
            },
            {
                name: 'resizeImage:75',
                value: '75',
                label: 'Large (75%)',
                icon: 'large'
            }
        ],
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
            'linkImage',
            '|',
            'resizeImage:25',
            'resizeImage:50',
            'resizeImage:75',
            'resizeImage:original',
        ],
        styles: [
            'full',
            'alignLeft',
            'alignCenter',
            'alignRight',
        ]
    }
}

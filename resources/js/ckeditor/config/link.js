/**
 * https://ckeditor.com/docs/ckeditor5/latest/features/link.html
 * https://ckeditor.com/docs/ckeditor5/latest/api/module_link_link-LinkConfig.html#member-decorators
 * https://ckeditor.com/docs/ckeditor5/latest/api/module_link_link-LinkConfig.html#member-addTargetToExternalLinks
 */
export default {
    link: {
        decorators: {
            isTargetBlank: {
                mode: 'manual',
                label: 'Target _blank',
                attributes: {
                    target: '_blank'
                }
            },
            isNoFollow: {
                mode: 'manual',
                label: 'No Follow',
                attributes: {
                    rel: 'nofollow'
                }
            },
        }
    }
}

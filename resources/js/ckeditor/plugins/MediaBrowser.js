import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class MediaBrowser {
    constructor(editor) {
        this.config = editor.config
        this.model = editor.model
        this.ui = editor.ui
        this.data = editor.data
    }


    static get pluginName() {
        return 'MediaBrowser'
    }

    static get requires() {
        return ['Image', 'Video', 'Audio']
    }

    init() {
        Nova.$on(`ckeditor:media:${this.attribute}-media-browser:write`, this.writeContent.bind(this))
        this.ui.componentFactory.add('mediaBrowser', this.createButton.bind(this))
    }

    destroy() {
        Nova.$off(`ckeditor:media:${this.attribute}-media-browser:write`, this.writeContent.bind(this))
    }

    createButton(locale) {
        const {t} = locale
        const view = new ButtonView(locale)

        view.set({
            icon: this.icon,
            tooltip: true,
            label: t('Media Browser')
        })

        if (this.isEnabled) {
            view.on('execute', this.openModal.bind(this))
        }

        view.set('isVisible', this.isEnabled)
        view.set('isEnabled', !this.config.get('isReadOnly'))

        return view
    }

    openModal() {
        this.saveSelection()

        Nova.$emit(`ckeditor:media:${this.attribute}-media-browser`)
    }

    saveSelection() {
        this.selected = this.model.document.selection.getSelectedElement()
    }

    clearSelection() {
        this.selected = null
    }

    get isEnabled() {
        return this.config.get('mediaBrowser')
    }

    get attribute() {
        return this.config.get('attribute')
    }

    /**
     * @param type {'image' | 'video' | 'audio'}
     * @return {Boolean}
     */
    hasSelectedWidget(type) {
        if (type === 'image') {
            return (this.selected && this.selected.name === 'imageBlock')
        }
        else if (type === 'video') {
            return (this.selected && this.selected.name === 'videoBlock')
        }

        return (this.selected && this.selected.name === 'audioBlock')
    }

    /**
     * Write Document Content.
     * @param items {Array}
     * @param type {'image' | 'video' | 'audio'}
     * @return void
     */
    writeContent(items, type) {
        this.model.change((writer) => {
            items.forEach(({file, url, urls}, index) => {
                if (index === 0 && this.hasSelectedWidget(type)) {
                    if (urls) {
                        if (urls.image) {
                            url = urls.image
                        }
                        else if (urls.video) {
                            url = urls.video
                        }
                    }

                    return writer.setAttributes(
                        {
                            src: url,
                            alt: file,
                            imageCaption: file
                        },
                        this.selected
                    )
                }

                if (type === 'image') {
                    if (urls && urls.image) {
                        url = urls.image
                    }

                    return this.model.insertContent(
                        writer.createElement(
                            'imageBlock',
                            {
                                src: url,
                                alt: file,
                                imageCaption: file
                            }
                        ),

                        this.model.document.selection.getLastPosition()
                    )
                }
                else if (type === 'video') {
                    return this.model.insertContent(
                        writer.createElement(
                            'videoBlock',
                            {
                                src: urls.video,
                                poster: urls.cover,
                                controls: 'controls'
                            }
                        ),

                        // modelFragment,
                        this.model.document.selection.getLastPosition()
                    )
                }
                else if (type === 'audio') {
                    return this.model.insertContent(
                        writer.createElement(
                            'audioBlock',
                            {
                                src: url,
                                controls: 'controls'
                            }
                        ),

                        // modelFragment,
                        this.model.document.selection.getLastPosition()
                    )
                }
            })
        })

        this.clearSelection()
    }

    get icon() {
        return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.627 16.5zm5.873-.196zm0-7.001V8h-13v8.5h4.341c.191.54.457 1.044.785 1.5H2a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 2 2h4.5a1.5 1.5 0 0 1 1.06.44L9.122 4H16a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 19 8v2.531a6.027 6.027 0 0 0-1.5-1.228zM16 6.5v-1H8.5l-2-2H2v13h1V8a1.5 1.5 0 0 1 1.5-1.5H16z"></path><path d="M14.5 19.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM15 14v-2h-1v2h-2v1h2v2h1v-2h2v-1h-2z"></path></svg>`
    }
}

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class MediaBrowser {
    constructor(editor, type) {
        this.config = editor.config
        this.model = editor.model
        this.ui = editor.ui
        this.data = editor.data
        this.type = type // imageBrowser, videoBrowser, audioBrowser

        if (type === 'videoBrowser') {
            this.localType = 'video'
        }
        else if (type === 'audioBrowser') {
            this.localType = 'audio'
        }
        else {
            this.localType = 'image'
        }
    }

    /**
     * Get the Plugin Name
     */
    static get pluginName() {
        return this.type
    }

    /**
     * Get Required Children
     */
    static get requires() {
        switch (this.type) {
            case 'imageBrowser':
                return ['Image']
            case 'videoBrowser':
                return ['Video']
            case 'audioBrowser':
                return ['Audio']
        }
    }

    /**
     * Initialize the plugin.
     * Start listening for events.
     * @return void
     */
    init() {
        Nova.$on(`ckeditor:media:${this.attribute}-${this.localType}:write`, this.writeContent.bind(this))
        this.ui.componentFactory.add(this.type, this.createButton.bind(this))
    }

    /**
     * Destroy Instance
     * Stop listening for events.
     * @return void
     */
    destroy() {
        Nova.$off(`ckeditor:media:${this.attribute}-${this.localType}:write`, this.writeContent.bind(this))
    }

    /**
     * Create the plugin ButtonView
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale) {
        const {t} = locale
        const view = new ButtonView(locale)

        view.set({
            icon: this.icon,
            tooltip: true,
            label: t(
                this.localType === 'image'
                    ? 'Insert Image'
                    : (
                        this.localType === 'video'
                            ? 'Insert Video'
                            : 'Insert Audio'
                    )
            )
        })

        if (this.isEnabled) {
            view.on('execute', this.openModal.bind(this))
        }

        view.set('isVisible', this.isEnabled)
        view.set('isEnabled', !this.config.get('isReadOnly'))

        return view
    }

    /**
     * Launch the Media Browser.
     */
    openModal() {
        this.saveSelection()

        Nova.$emit(`ckeditor:media:${this.attribute}-${this.localType}`)
    }

    /**
     * Save the editor selection.
     */
    saveSelection() {
        this.selected = this.model.document.selection.getSelectedElement()
    }

    /**
     * Clear the saved editor selection.
     */
    clearSelection() {
        this.selected = null
    }

    /**
     * Is the plugin enabled?
     * @return {Boolean}
     */
    get isEnabled() {
        return this.config.get(this.type)
    }

    /**
     * Get the Nova field name.
     * @return {String}
     */
    get attribute() {
        return this.config.get('attribute')
    }

    /**
     * Is Image Element
     * @return {Boolean}
     */
    get hasSelectedWidget() {
        if (this.localType === 'image') {
            return (this.selected && this.selected.name === 'imageBlock')
        }
        else if (this.localType === 'video') {
            return (this.selected && this.selected.name === 'videoBlock')
        }

        return (this.selected && this.selected.name === 'audioBlock')
    }

    /**
     * Write Document Content.
     * @param items {Array}
     * @return void
     */
    writeContent(items) {
        this.model.change((writer) => {
            items.forEach(({file, url, urls}, index) => {
                if (index === 0 && this.hasSelectedWidget) {
                    if (urls) {
                        if (urls.image) {
                            url = urls.image
                        }
                        else if (urls.video) {
                            url = urls.video
                        }
                    }

                    return writer.setAttributes({src: url, alt: file, imageCaption: file}, this.selected)
                }

                if (this.localType === 'image') {
                    if (urls && urls.image) {
                        url = urls.image
                    }

                    return this.model.insertContent(
                        writer.createElement('imageBlock', {src: url, alt: file, imageCaption: file}),
                        this.model.document.selection.getLastPosition()
                    )
                }
                else if (this.localType === 'video') {
                    return this.model.insertContent(
                        writer.createElement('videoBlock', {src: urls.video, poster: urls.cover, controls: 'controls'}),
                        // modelFragment,
                        this.model.document.selection.getLastPosition()
                    )
                }
                else if (this.localType === 'audio') {
                    return this.model.insertContent(
                        writer.createElement('audioBlock', {src: url, controls: 'controls'}),
                        // modelFragment,
                        this.model.document.selection.getLastPosition()
                    )
                }
            })
        })
        this.clearSelection()
    }

    /**
     * Get the Icon
     * @return string
     */
    get icon() {
        if (this.localType === 'image') {
            return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.91 10.54c.26-.23.64-.21.88.03l3.36 3.14 2.23-2.06a.64.64 0 0 1 .87 0l2.52 2.97V4.5H3.2v10.12l3.71-4.08zm10.27-7.51c.6 0 1.09.47 1.09 1.05v11.84c0 .59-.49 1.06-1.09 1.06H2.79c-.6 0-1.09-.47-1.09-1.06V4.08c0-.58.49-1.05 1.1-1.05h14.38zm-5.22 5.56a1.96 1.96 0 1 1 3.4-1.96 1.96 1.96 0 0 1-3.4 1.96z"/></svg>`
        }
        else if (this.localType === 'video') {
            return `<?xml version="1.0" ?><svg id="Layer_1" style="enable-background:new 0 0 32 30;" version="1.1" viewBox="0 0 32 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M25.7,10V6.4c0-1.4-1.1-2.5-2.5-2.5H2.5C1.1,3.9,0,5,0,6.4v14.3c0,1.4,1.1,2.5,2.5,2.5h10c0-0.3-0.1-0.7-0.1-1s0-0.6,0-1  h-10c-0.3,0-0.5-0.2-0.5-0.5V6.4C2,6.1,2.2,5.9,2.5,5.9h20.7c0.3,0,0.5,0.2,0.5,0.5v4.8v4.7v0.8c1,1.3,1.8,2.8,2,4.5l0,0v-4.1  l6.3,3.7V6.3L25.7,10z M30,17.2l-4.3-2.5v-2.4L30,9.8V17.2z"/><path d="M20.1,21.1l2,0l0,2l-2,0l0,2l-2,0l0-2l-2,0l0-2l2,0l0-2l2,0L20.1,21.1z M18.9,16.3c-3.3,0-5.9,2.7-5.8,6  c0,3.3,2.7,5.9,6,5.8c3.3,0,5.9-2.7,5.8-6C24.9,18.9,22.2,16.2,18.9,16.3z M19,26.1c-2.2,0-3.9-1.6-4-3.8c0-2.2,1.7-3.9,3.9-4  c2.2,0,3.9,1.8,3.9,3.8C22.9,24.4,21.3,26,19,26.1z"/></svg>`
        }

        return `<?xml version="1.0" ?><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:#101820;}</style></defs><title/><g data-name="Layer 33" id="Layer_33"><path class="cls-1" d="M18,29a1,1,0,0,1-.57-.18l-10-7A1,1,0,0,1,7,21V11a1,1,0,0,1,.43-.82l10-7a1,1,0,0,1,1-.07A1,1,0,0,1,19,4V28a1,1,0,0,1-.54.89A1,1,0,0,1,18,29ZM9,20.48l8,5.6V5.92l-8,5.6Z"/><path class="cls-1" d="M8,22H4a3,3,0,0,1-3-3V13a3,3,0,0,1,3-3H8a1,1,0,0,1,1,1V21A1,1,0,0,1,8,22ZM4,12a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1H7V12Z"/><path class="cls-1" d="M18,21V19a3,3,0,0,0,2.12-5.12l1.42-1.42A5,5,0,0,1,18,21Z"/><path class="cls-1" d="M23.65,22.65a1,1,0,0,1-.7-.29A1,1,0,0,1,23,21a7,7,0,0,0,0-9.9,1,1,0,0,1,1.41-1.41,9,9,0,0,1,0,12.72A1,1,0,0,1,23.65,22.65Z"/></g></svg>`
    }
}

/**
 * @var Nova
 */
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class SnippetBrowser {

    constructor(editor) {
        this.editor = editor;
        this.config = editor.config;
        this.model = editor.model;
        this.data = editor.data;
        this.ui = editor.ui;
    }

    /**
     * Get Required Children
     * @inheritDoc
     */
    static get requires() {
        return []
    }

    /**
     * Get the Plugin Name
     * @inheritDoc
     */
    static get pluginName() {
        return 'snippetBrowser'
    }

    /**
     * Is the plugin enabled?
     * @return {Boolean}
     */
    get isEnabled() {
        return (this.config.get('snippetBrowser') || []).length > 0
    }

    /**
     * Get the Nova field name.
     * @return {String}
     */
    get attribute() {
        return this.config.get('attribute')
    }

    /**
     * Initialize the plugin.
     * Start listening for events.
     * @return void
     */
    init() {
        this.ui.componentFactory.add('snippetBrowser', this.createButton.bind(this))
        Nova.$on(`ckeditor:snippets:${this.attribute}:write`, this.writeContent.bind(this))
    }

    /**
     * Destroy Instance
     * Stop listening for events.
     * @return void
     */
    destroy() {
        Nova.$off(`ckeditor:snippets:${this.attribute}:write`, this.writeContent.bind(this))
    }

    /**
     * Write Document Content.
     * @param locale object
     * @return {ButtonView}
     */
    createButton(locale) {
        const view = new ButtonView(locale)
        view.set({
            label: 'Insert Snippet',
            icon: this.icon,
            tooltip: true,
        })
        if (this.isEnabled) {
            view.on('execute', this.openModal.bind(this))
        }

        view.set('isVisible', this.isEnabled)
        return view
    }

    /**
     * Launch the Link Browser.
     */
    openModal() {
        Nova.$emit(`ckeditor:snippets:${this.attribute}`)
    }

    /**
     * Write Document Content.
     * @return void
     */
    writeContent(snippet) {
        this.model.insertContent(this.data.toModel(this.data.processor.toView(`<div class="raw-html-embed">${snippet}</div>`)));
    }

    /**
     * Get the Icon
     * @return string
     */
    get icon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502.664 502.664"><path d="M153.821 358.226L0 274.337v-46.463l153.821-83.414v54.574L46.636 250.523l107.185 53.431v54.272zm26.273 29.358L282.103 115.08h32.227L212.084 387.584h-31.99zm168.749-29.358v-54.272l107.164-52.999-107.164-52.59v-53.927l153.821 83.522v46.183l-153.821 84.083z" fill="#000"/></svg>`
    }
}

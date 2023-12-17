import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class SnippetBrowser {
    constructor(editor) {
        this.editor = editor
        this.config = editor.config
        this.model = editor.model
        this.data = editor.data
        this.ui = editor.ui
    }


    static get pluginName() {
        return 'snippetBrowser'
    }

    static get requires() {
        return []
    }

    get isEnabled() {
        return (this.config.get('snippetBrowser') || []).length > 0
    }

    get attribute() {
        return this.config.get('attribute')
    }


    init() {
        this.ui.componentFactory.add('snippetBrowser', this.createButton.bind(this))
        Nova.$on(`ckeditor:snippets:${this.attribute}-snippets-browser:write`, this.writeContent.bind(this))
    }

    destroy() {
        Nova.$off(`ckeditor:snippets:${this.attribute}-snippets-browser:write`, this.writeContent.bind(this))
    }

    createButton(locale) {
        const {t} = locale
        const view = new ButtonView(locale)

        view.set({
            label: t('Insert Snippet'),
            icon: this.icon,
            tooltip: true
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

        Nova.$emit(`ckeditor:snippets:${this.attribute}-snippets-browser`)
    }

    saveSelection() {
        this.selected = this.model.document.selection.getSelectedElement()
    }

    clearSelection() {
        this.selected = null
    }

    writeContent(snippet) {
        this.model.insertContent(
            this.data.toModel(
                this.data.processor.toView(`<div class="raw-html-embed">${snippet}</div>`)
            )
        )
    }

    get icon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502.664 502.664"><path d="M153.821 358.226L0 274.337v-46.463l153.821-83.414v54.574L46.636 250.523l107.185 53.431v54.272zm26.273 29.358L282.103 115.08h32.227L212.084 387.584h-31.99zm168.749-29.358v-54.272l107.164-52.999-107.164-52.59v-53.927l153.821 83.522v46.183l-153.821 84.083z" fill="#000"/></svg>`
    }
}

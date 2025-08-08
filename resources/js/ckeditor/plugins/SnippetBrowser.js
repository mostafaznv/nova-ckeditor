import {ButtonView} from '@ckeditor/ckeditor5-ui/src/button/buttonview'

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
        return `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502.664 502.664"><path d="M281.398 117.079c-.489 1.267-23.338 62.246-50.775 135.51-27.437 73.263-50.068 133.685-50.29 134.271-.321.844 2.936 1.019 15.673.838l16.079-.228 50.499-134.462c27.775-73.955 50.768-135.311 51.097-136.348l.597-1.885h-31.99l-.89 2.304M76.656 186.33.419 227.693l-.222 23.354-.222 23.354 75.97 41.455c41.784 22.8 76.474 41.576 77.088 41.725.914.222 1.117-4.632 1.117-26.621v-26.893l-53.648-26.753-53.649-26.754 3.173-1.598c1.745-.879 25.415-12.257 52.601-25.284s49.9-24.056 50.476-24.508c.799-.628 1.047-7.161 1.047-27.529 0-14.688-.282-26.699-.628-26.69-.346.009-34.935 18.63-76.866 41.379m271.858-14.73v26.666l53.717 26.324 53.717 26.323-53.717 26.63-53.717 26.631v26.867c0 25.24.089 26.834 1.466 26.316.806-.303 35.482-19.099 77.057-41.769l75.591-41.217-.192-23.294-.191-23.293-76.237-41.412c-41.931-22.777-76.52-41.418-76.866-41.425-.346-.007-.628 11.987-.628 26.653" fill-rule="evenodd"/></svg>`
    }
}

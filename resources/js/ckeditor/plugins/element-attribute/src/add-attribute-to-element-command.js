import Command from '@ckeditor/ckeditor5-core/src/command'

class ElementAddAttributesCommand extends Command {
    refresh() {
        const element = this.editor.model.document.selection.anchor.parent

        this.isEnabled = true

        if (!!element && element.hasAttribute('id')) {
            this.value = element.getAttribute('id')
        }
        else {
            this.value = false
        }
    }

    execute(options) {
        const model = this.editor.model
        const element = this.editor.model.document.selection.anchor.parent

        model.change(writer => {
            writer.setAttribute('id', options.newValue, element)
        })
    }
}

export default ElementAddAttributesCommand

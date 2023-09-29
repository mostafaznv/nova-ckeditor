import Command from '@ckeditor/ckeditor5-core/src/command'
import {logWarning, toArray} from 'ckeditor5/src/utils'


export default class InsertAudioCommand extends Command {
    constructor(editor) {
        super(editor);

        const configAudioInsertType = editor.config.get('audio.insert.type');

        if (!editor.plugins.has('AudioBlockEditing')) {
            if (configAudioInsertType === 'block') {
                logWarning('audio-block-plugin-required');
            }
        }

        if (!editor.plugins.has('AudioInlineEditing')) {
            if (configAudioInsertType === 'inline') {
                logWarning('audio-inline-plugin-required');
            }
        }
    }

    refresh() {
        this.isEnabled = this.editor.plugins.get('AudioUtils').isAudioAllowed();
    }

    execute(options) {
        const sourceDefinitions = toArray(options.source);
        const selection = this.editor.model.document.selection;
        const audioUtils = this.editor.plugins.get('AudioUtils');

        const selectionAttributes = Object.fromEntries(selection.getAttributes());

        sourceDefinitions.forEach((sourceDefinition, index) => {
            const selectedElement = selection.getSelectedElement();

            if (typeof sourceDefinition === 'string') {
                sourceDefinition = {src: sourceDefinition};
            }

            if (index && selectedElement && audioUtils.isAudio(selectedElement)) {
                const position = this.editor.model.createPositionAfter(selectedElement);

                audioUtils.insertAudio({...sourceDefinition, ...selectionAttributes}, position);
            }
            else {
                audioUtils.insertAudio({...sourceDefinition, ...selectionAttributes});
            }
        });
    }
}

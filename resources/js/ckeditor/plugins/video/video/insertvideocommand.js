import Command from '@ckeditor/ckeditor5-core/src/command'
import {logWarning, toArray} from 'ckeditor5/src/utils'


export default class InsertVideoCommand extends Command {
    constructor(editor) {
        super(editor);

        const configVideoInsertType = editor.config.get('video.insert.type');

        if (!editor.plugins.has('VideoBlockEditing')) {
            if (configVideoInsertType === 'block') {
                logWarning('video-block-plugin-required');
            }
        }

        if (!editor.plugins.has('VideoInlineEditing')) {
            if (configVideoInsertType === 'inline') {
                logWarning('video-inline-plugin-required');
            }
        }
    }

    refresh() {
        this.isEnabled = this.editor.plugins.get('VideoUtils').isVideoAllowed();
    }

    execute(options) {
        const sourceDefinitions = toArray(options.source);
        const selection = this.editor.model.document.selection;
        const videoUtils = this.editor.plugins.get('VideoUtils');

        const selectionAttributes = Object.fromEntries(selection.getAttributes());

        sourceDefinitions.forEach((sourceDefinition, index) => {
            const selectedElement = selection.getSelectedElement();

            if (typeof sourceDefinition === 'string') {
                sourceDefinition = {src: sourceDefinition};
            }

            if (index && selectedElement && videoUtils.isVideo(selectedElement)) {
                const position = this.editor.model.createPositionAfter(selectedElement);

                videoUtils.insertVideo({...sourceDefinition, ...selectionAttributes}, position);
            }
            else {
                videoUtils.insertVideo({...sourceDefinition, ...selectionAttributes});
            }
        });
    }
}

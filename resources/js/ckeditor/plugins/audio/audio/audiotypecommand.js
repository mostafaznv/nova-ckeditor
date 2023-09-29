import {Command} from 'ckeditor5/src/core'

export default class AudioTypeCommand extends Command {
    constructor(editor, modelElementName) {
        super(editor);

        this._modelElementName = modelElementName;
    }

    refresh() {
        const editor = this.editor;
        const audioUtils = editor.plugins.get('AudioUtils');
        const element = audioUtils.getClosestSelectedAudioElement(this.editor.model.document.selection);

        if (this._modelElementName === 'audioBlock') {
            this.isEnabled = audioUtils.isInlineAudio(element);
        }
        else {
            this.isEnabled = audioUtils.isBlockAudio(element);
        }
    }

    execute() {
        const editor = this.editor;
        const model = this.editor.model;
        const audioUtils = editor.plugins.get('AudioUtils');
        const oldElement = audioUtils.getClosestSelectedAudioElement(model.document.selection);
        const attributes = Object.fromEntries(oldElement.getAttributes());

        if (!attributes.src && !attributes.uploadId) {
            return null;
        }

        return model.change(writer => {
            const markers = Array.from(model.markers)
                .filter(marker => marker.getRange().containsItem(oldElement));

            const newElement = audioUtils.insertAudio(attributes, model.createSelection(oldElement, 'on'), this._modelElementName);

            if (!newElement) {
                return null;
            }

            const newElementRange = writer.createRangeOn(newElement);

            for (const marker of markers) {
                const markerRange = marker.getRange();

                const range = markerRange.root.rootName != '$graveyard' ?
                    markerRange.getJoined(newElementRange, true) : newElementRange;

                writer.updateMarker(marker, {range});
            }

            return {
                oldElement,
                newElement
            };
        });
    }
}

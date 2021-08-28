import {Command} from 'ckeditor5/src/core'

export default class VideoTypeCommand extends Command {
    constructor(editor, modelElementName) {
        super(editor);

        this._modelElementName = modelElementName;
    }

    refresh() {
        const editor = this.editor;
        const videoUtils = editor.plugins.get('VideoUtils');
        const element = videoUtils.getClosestSelectedVideoElement(this.editor.model.document.selection);

        if (this._modelElementName === 'videoBlock') {
            this.isEnabled = videoUtils.isInlineVideo(element);
        }
        else {
            this.isEnabled = videoUtils.isBlockVideo(element);
        }
    }

    execute() {
        const editor = this.editor;
        const model = this.editor.model;
        const videoUtils = editor.plugins.get('VideoUtils');
        const oldElement = videoUtils.getClosestSelectedVideoElement(model.document.selection);
        const attributes = Object.fromEntries(oldElement.getAttributes());

        if (!attributes.src && !attributes.uploadId) {
            return null;
        }

        return model.change(writer => {
            const markers = Array.from(model.markers)
                .filter(marker => marker.getRange().containsItem(oldElement));

            const newElement = videoUtils.insertVideo(attributes, model.createSelection(oldElement, 'on'), this._modelElementName);

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

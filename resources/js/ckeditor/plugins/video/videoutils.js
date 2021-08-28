import {Plugin} from 'ckeditor5/src/core'
import {findOptimalInsertionRange, isWidget, toWidget} from 'ckeditor5/src/widget'
import {determineVideoTypeForInsertionAtSelection} from './video/utils'

export default class VideoUtils extends Plugin {
    static get pluginName() {
        return 'VideoUtils';
    }

    isVideo(modelElement) {
        return this.isInlineVideo(modelElement) || this.isBlockVideo(modelElement);
    }

    isInlineVideoView(element) {
        return !!element && element.is('element', 'video');
    }

    isBlockVideoView(element) {
        return !!element && element.is('element', 'figure') && element.hasClass('video');
    }

    insertVideo(attributes = {}, selectable = null, videoType = null) {
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;

        videoType = determineVideoTypeForInsertion(editor, selectable || selection, videoType);

        attributes = {
            ...Object.fromEntries(selection.getAttributes()),
            ...attributes
        };

        for (const attributeName in attributes) {
            if (!model.schema.checkAttribute(videoType, attributeName)) {
                delete attributes[attributeName];
            }
        }

        return model.change(writer => {
            const videoElement = writer.createElement(videoType, attributes);

            if (!selectable && videoType !== 'videoInline') {
                selectable = findOptimalInsertionRange(selection, model);
            }

            model.insertContent(videoElement, selectable);

            if (videoElement.parent) {
                writer.setSelection(videoElement, 'on');

                return videoElement;
            }

            return null;
        });
    }

    getClosestSelectedVideoWidget(selection) {
        const viewElement = selection.getSelectedElement();

        if (viewElement && this.isVideoWidget(viewElement)) {
            return viewElement;
        }

        let parent = selection.getFirstPosition().parent;

        while (parent) {
            if (parent.is('element') && this.isVideoWidget(parent)) {
                return parent;
            }

            parent = parent.parent;
        }

        return null;
    }

    getClosestSelectedVideoElement(selection) {
        const selectedElement = selection.getSelectedElement();

        return this.isVideo(selectedElement) ? selectedElement : selection.getFirstPosition().findAncestor('videoBlock');
    }

    isVideoAllowed() {
        const model = this.editor.model;
        const selection = model.document.selection;

        return isVideoAllowedInParent(this.editor, selection) && isNotInsideVideo(selection);
    }

    toVideoWidget(viewElement, writer) {
        writer.setCustomProperty('video', true, viewElement);

        return toWidget(viewElement, writer);
    }

    isVideoWidget(viewElement) {
        return !!viewElement.getCustomProperty('video') && isWidget(viewElement);
    }

    isBlockVideo(modelElement) {
        return !!modelElement && modelElement.is('element', 'videoBlock');
    }

    isInlineVideo(modelElement) {
        return !!modelElement && modelElement.is('element', 'videoInline');
    }

    findViewVideoElement(figureView) {
        if (this.isInlineVideoView(figureView)) {
            return figureView;
        }

        const editingView = this.editor.editing.view;

        for (const {item} of editingView.createRangeIn(figureView)) {
            if (this.isInlineVideoView(item)) {
                return item;
            }
        }
    }
}

function isVideoAllowedInParent(editor, selection) {
    const videoType = determineVideoTypeForInsertion(editor, selection);

    if (videoType === 'videoBlock') {
        const parent = getInsertVideoParent(selection, editor.model);

        if (editor.model.schema.checkChild(parent, 'videoBlock')) {
            return true;
        }
    }
    else if (editor.model.schema.checkChild(selection.focus, 'videoInline')) {
        return true;
    }

    return false;
}

function isNotInsideVideo(selection) {
    return [...selection.focus.getAncestors()].every(ancestor => !ancestor.is('element', 'videoBlock'));
}

function getInsertVideoParent(selection, model) {
    const insertionRange = findOptimalInsertionRange(selection, model);
    const parent = insertionRange.start.parent;

    if (parent.isEmpty && !parent.is('element', '$root')) {
        return parent.parent;
    }

    return parent;
}

function determineVideoTypeForInsertion(editor, selectable, videoType) {
    const schema = editor.model.schema;
    const configVideoInsertType = editor.config.get('video.insert.type');

    if (!editor.plugins.has('VideoBlockEditing')) {
        return 'videoInline';
    }

    if (!editor.plugins.has('VideoInlineEditing')) {
        return 'videoBlock';
    }

    if (videoType) {
        return videoType;
    }

    if (configVideoInsertType === 'inline') {
        return 'videoInline';
    }

    if (configVideoInsertType === 'block') {
        return 'videoBlock';
    }

    if (selectable.is('selection')) {
        return determineVideoTypeForInsertionAtSelection(schema, selectable);
    }

    return schema.checkChild(selectable, 'videoInline') ? 'videoInline' : 'videoBlock';
}

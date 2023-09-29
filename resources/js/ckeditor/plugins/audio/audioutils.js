import {Plugin} from 'ckeditor5/src/core'
import {findOptimalInsertionRange, isWidget, toWidget} from 'ckeditor5/src/widget'
import {determineAudioTypeForInsertionAtSelection} from './audio/utils'

export default class AudioUtils extends Plugin {
    static get pluginName() {
        return 'AudioUtils';
    }

    isAudio(modelElement) {
        return this.isInlineAudio(modelElement) || this.isBlockAudio(modelElement);
    }

    isInlineAudioView(element) {
        return !!element && element.is('element', 'audio');
    }

    isBlockAudioView(element) {
        return !!element && element.is('element', 'figure') && element.hasClass('audio');
    }

    insertAudio(attributes = {}, selectable = null, audioType = null) {
        const editor = this.editor;
        const model = editor.model;
        const selection = model.document.selection;

        audioType = determineAudioTypeForInsertion(editor, selectable || selection, audioType);

        attributes = {
            ...Object.fromEntries(selection.getAttributes()),
            ...attributes
        };

        for (const attributeName in attributes) {
            if (!model.schema.checkAttribute(audioType, attributeName)) {
                delete attributes[attributeName];
            }
        }

        return model.change(writer => {
            const audioElement = writer.createElement(audioType, attributes);

            if (!selectable && audioType !== 'audioInline') {
                selectable = findOptimalInsertionRange(selection, model);
            }

            model.insertContent(audioElement, selectable);

            if (audioElement.parent) {
                writer.setSelection(audioElement, 'on');

                return audioElement;
            }

            return null;
        });
    }

    getClosestSelectedAudioWidget(selection) {
        const viewElement = selection.getSelectedElement();

        if (viewElement && this.isAudioWidget(viewElement)) {
            return viewElement;
        }

        let parent = selection.getFirstPosition().parent;

        while (parent) {
            if (parent.is('element') && this.isAudioWidget(parent)) {
                return parent;
            }

            parent = parent.parent;
        }

        return null;
    }

    getClosestSelectedAudioElement(selection) {
        const selectedElement = selection.getSelectedElement();

        return this.isAudio(selectedElement) ? selectedElement : selection.getFirstPosition().findAncestor('audioBlock');
    }

    isAudioAllowed() {
        const model = this.editor.model;
        const selection = model.document.selection;

        return isAudioAllowedInParent(this.editor, selection) && isNotInsideAudio(selection);
    }

    toAudioWidget(viewElement, writer) {
        writer.setCustomProperty('audio', true, viewElement);

        return toWidget(viewElement, writer);
    }

    isAudioWidget(viewElement) {
        return !!viewElement.getCustomProperty('audio') && isWidget(viewElement);
    }

    isBlockAudio(modelElement) {
        return !!modelElement && modelElement.is('element', 'audioBlock');
    }

    isInlineAudio(modelElement) {
        return !!modelElement && modelElement.is('element', 'audioInline');
    }

    findViewAudioElement(figureView) {
        if (this.isInlineAudioView(figureView)) {
            return figureView;
        }

        const editingView = this.editor.editing.view;

        for (const {item} of editingView.createRangeIn(figureView)) {
            if (this.isInlineAudioView(item)) {
                return item;
            }
        }
    }
}

function isAudioAllowedInParent(editor, selection) {
    const audioType = determineAudioTypeForInsertion(editor, selection);

    if (audioType === 'audioBlock') {
        const parent = getInsertAudioParent(selection, editor.model);

        if (editor.model.schema.checkChild(parent, 'audioBlock')) {
            return true;
        }
    }
    else if (editor.model.schema.checkChild(selection.focus, 'audioInline')) {
        return true;
    }

    return false;
}

function isNotInsideAudio(selection) {
    return [...selection.focus.getAncestors()].every(ancestor => !ancestor.is('element', 'audioBlock'));
}

function getInsertAudioParent(selection, model) {
    const insertionRange = findOptimalInsertionRange(selection, model);
    const parent = insertionRange.start.parent;

    if (parent.isEmpty && !parent.is('element', '$root')) {
        return parent.parent;
    }

    return parent;
}

function determineAudioTypeForInsertion(editor, selectable, audioType) {
    const schema = editor.model.schema;
    const configAudioInsertType = editor.config.get('audio.insert.type');

    if (!editor.plugins.has('AudioBlockEditing')) {
        return 'audioInline';
    }

    if (!editor.plugins.has('AudioInlineEditing')) {
        return 'audioBlock';
    }

    if (audioType) {
        return audioType;
    }

    if (configAudioInsertType === 'inline') {
        return 'audioInline';
    }

    if (configAudioInsertType === 'block') {
        return 'audioBlock';
    }

    if (selectable.is('selection')) {
        return determineAudioTypeForInsertionAtSelection(schema, selectable);
    }

    return schema.checkChild(selectable, 'audioInline') ? 'audioInline' : 'audioBlock';
}

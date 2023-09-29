import {first} from 'ckeditor5/src/utils'

export function createAudioViewElement(writer, audioType) {
    const emptyElement = writer.createEmptyElement('audio');

    const container = audioType === 'audioBlock' ?
        writer.createContainerElement('figure', {class: 'audio'}) :
        writer.createContainerElement('span', {class: 'audio-inline'}, {isAllowedInsideAttributeElement: true});

    writer.insert(writer.createPositionAt(container, 0), emptyElement);

    return container;
}

export function getAudioViewElementMatcher(editor, matchAudioType) {
    if (editor.plugins.has('AudioInlineEditing') !== editor.plugins.has('AudioBlockEditing')) {
        return {
            name: 'audio',
            attributes: {
                src: true
            }
        };
    }

    const audioUtils = editor.plugins.get('AudioUtils');

    return element => {
        if (!audioUtils.isInlineAudioView(element) || !element.hasAttribute('src')) {
            return null;
        }

        const audioType = element.findAncestor(audioUtils.isBlockAudioView) ? 'audioBlock' : 'audioInline';

        if (audioType !== matchAudioType) {
            return null;
        }

        return {name: true, attributes: ['src']};
    };
}

export function determineAudioTypeForInsertionAtSelection(schema, selection) {
    const firstBlock = first(selection.getSelectedBlocks());

    if (!firstBlock || schema.isObject(firstBlock)) {
        return 'audioBlock';
    }

    if (firstBlock.isEmpty && firstBlock.name !== 'listItem') {
        return 'audioBlock';
    }

    return 'audioInline';
}

import {first} from 'ckeditor5/src/utils'

export function createVideoViewElement(writer, videoType) {
    const emptyElement = writer.createEmptyElement('video');

    const container = videoType === 'videoBlock' ?
        writer.createContainerElement('figure', {class: 'video'}) :
        writer.createContainerElement('span', {class: 'video-inline'}, {isAllowedInsideAttributeElement: true});

    writer.insert(writer.createPositionAt(container, 0), emptyElement);

    return container;
}

export function getVideoViewElementMatcher(editor, matchVideoType) {
    if (editor.plugins.has('VideoInlineEditing') !== editor.plugins.has('VideoBlockEditing')) {
        return {
            name: 'video',
            attributes: {
                src: true
            }
        };
    }

    const videoUtils = editor.plugins.get('VideoUtils');

    return element => {
        if (!videoUtils.isInlineVideoView(element) || !element.hasAttribute('src')) {
            return null;
        }

        const videoType = element.findAncestor(videoUtils.isBlockVideoView) ? 'videoBlock' : 'videoInline';

        if (videoType !== matchVideoType) {
            return null;
        }

        return {name: true, attributes: ['src']};
    };
}

export function determineVideoTypeForInsertionAtSelection(schema, selection) {
    const firstBlock = first(selection.getSelectedBlocks());

    if (!firstBlock || schema.isObject(firstBlock)) {
        return 'videoBlock';
    }

    if (firstBlock.isEmpty && firstBlock.name !== 'listItem') {
        return 'videoBlock';
    }

    return 'videoInline';
}

import {Plugin} from 'ckeditor5/src/core'
import {ClipboardPipeline} from 'ckeditor5/src/clipboard'
import {UpcastWriter} from 'ckeditor5/src/engine'
import {downcastVideoAttribute} from './converters'
import VideoEditing from './videoediting'
import VideoTypeCommand from './videotypecommand'
import VideoUtils from '../videoutils'
import {getVideoViewElementMatcher, createVideoViewElement, determineVideoTypeForInsertionAtSelection} from './utils'


export default class VideoInlineEditing extends Plugin {
    static get requires() {
        return [VideoEditing, VideoUtils, ClipboardPipeline];
    }

    static get pluginName() {
        return 'VideoInlineEditing';
    }

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        schema.register('videoInline', {
            isObject: true,
            isInline: true,
            allowWhere: '$text',
            allowAttributes: ['src']
        });

        schema.addChildCheck((context, childDefinition) => {
            if (context.endsWith('caption') && childDefinition.name === 'videoInline') {
                return false;
            }
        });

        this._setupConversion();

        if (editor.plugins.has('VideoBlockEditing')) {
            editor.commands.add('videoTypeInline', new VideoTypeCommand(this.editor, 'videoInline'));

            this._setupClipboardIntegration();
        }
    }

    _setupConversion() {
        const editor = this.editor;
        const t = editor.t;
        const conversion = editor.conversion;
        const videoUtils = editor.plugins.get('VideoUtils');

        conversion.for('dataDowncast')
            .elementToElement({
                model: 'videoInline',
                view: (modelElement, {writer}) => writer.createEmptyElement('video')
            });

        conversion.for('editingDowncast')
            .elementToElement({
                model: 'videoInline',
                view: (modelElement, {writer}) => videoUtils.toVideoWidget(
                    createVideoViewElement(writer, 'videoInline'), writer, t('video widget')
                )
            });

        conversion.for('downcast')
            .add(downcastVideoAttribute(videoUtils, 'videoInline', 'src'));

        conversion.for('upcast')
            .elementToElement({
                view: getVideoViewElementMatcher(editor, 'videoInline'),
                model: (viewVideo, {writer}) => writer.createElement('videoInline', {src: viewVideo.getAttribute('src')})
            });
    }

    _setupClipboardIntegration() {
        const editor = this.editor;
        const model = editor.model;
        const editingView = editor.editing.view;
        const videoUtils = editor.plugins.get('VideoUtils');

        this.listenTo(editor.plugins.get('ClipboardPipeline'), 'inputTransformation', (evt, data) => {
            const docFragmentChildren = Array.from(data.content.getChildren());
            let modelRange;

            if (!docFragmentChildren.every(videoUtils.isBlockVideoView)) {
                return;
            }

            if (data.targetRanges) {
                modelRange = editor.editing.mapper.toModelRange(data.targetRanges[0]);
            }
            else {
                modelRange = model.document.selection.getFirstRange();
            }

            const selection = model.createSelection(modelRange);

            if (determineVideoTypeForInsertionAtSelection(model.schema, selection) === 'videoInline') {
                const writer = new UpcastWriter(editingView.document);

                const inlineViewVideos = docFragmentChildren.map(blockViewVideo => {
                    if (blockViewVideo.childCount === 1) {
                        Array.from(blockViewVideo.getAttributes())
                            .forEach(attribute => writer.setAttribute(
                                ...attribute,
                                videoUtils.findViewVideoElement(blockViewVideo)
                            ));

                        return blockViewVideo.getChild(0);
                    }
                    else {
                        return blockViewVideo;
                    }
                });

                data.content = writer.createDocumentFragment(inlineViewVideos);
            }
        });
    }
}

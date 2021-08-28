import {Plugin} from 'ckeditor5/src/core'
import {ClipboardPipeline} from 'ckeditor5/src/clipboard'
import {UpcastWriter} from 'ckeditor5/src/engine'
import VideoEditing from './videoediting'
import VideoTypeCommand from './videotypecommand'
import VideoUtils from '../videoutils'
import {downcastVideoAttribute, upcastVideoFigure} from './converters'
import {createVideoViewElement, determineVideoTypeForInsertionAtSelection, getVideoViewElementMatcher} from './utils'

export default class VideoBlockEditing extends Plugin {
    static get requires() {
        return [VideoEditing, VideoUtils, ClipboardPipeline];
    }

    static get pluginName() {
        return 'VideoBlockEditing';
    }

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        schema.register('videoBlock', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['src', 'poster', 'controls']
        });

        this._setupConversion();

        if (editor.plugins.has('VideoInlineEditing')) {
            editor.commands.add('videoTypeBlock', new VideoTypeCommand(this.editor, 'videoBlock'));

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
                model: 'videoBlock',
                view: (modelElement, {writer}) => createVideoViewElement(writer, 'videoBlock')
            });

        conversion.for('editingDowncast')
            .elementToElement({
                model: 'videoBlock',
                view: (modelElement, {writer}) => videoUtils.toVideoWidget(
                    createVideoViewElement(writer, 'videoBlock'), writer, t('video widget')
                )
            });

        conversion.for('downcast')
            .add(downcastVideoAttribute(videoUtils, 'videoBlock', 'src'))
            .add(downcastVideoAttribute(videoUtils, 'videoBlock', 'poster'))
            .add(downcastVideoAttribute(videoUtils, 'videoBlock', 'controls'));

        conversion.for('upcast')
            .elementToElement({
                view: getVideoViewElementMatcher(editor, 'videoBlock'),
                model: (viewVideo, {writer}) => writer.createElement('videoBlock', {
                    src: viewVideo.getAttribute('src'),
                    poster: viewVideo.getAttribute('poster'),
                    controls: viewVideo.getAttribute('controls')
                })
            })
            .add(upcastVideoFigure(videoUtils));
    }

    _setupClipboardIntegration() {
        const editor = this.editor;
        const model = editor.model;
        const editingView = editor.editing.view;
        const videoUtils = editor.plugins.get('VideoUtils');

        this.listenTo(editor.plugins.get('ClipboardPipeline'), 'inputTransformation', (evt, data) => {
            const docFragmentChildren = Array.from(data.content.getChildren());
            let modelRange;

            if (!docFragmentChildren.every(videoUtils.isInlineVideoView)) {
                return;
            }

            if (data.targetRanges) {
                modelRange = editor.editing.mapper.toModelRange(data.targetRanges[0]);
            }
            else {
                modelRange = model.document.selection.getFirstRange();
            }

            const selection = model.createSelection(modelRange);

            if (determineVideoTypeForInsertionAtSelection(model.schema, selection) === 'videoBlock') {
                const writer = new UpcastWriter(editingView.document);

                const blockViewVideos = docFragmentChildren.map(
                    inlineViewVideo => writer.createElement('figure', {class: 'video'}, inlineViewVideo)
                );

                data.content = writer.createDocumentFragment(blockViewVideos);
            }
        });
    }
}

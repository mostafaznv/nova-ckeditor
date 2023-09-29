import {Plugin} from 'ckeditor5/src/core'
import {ClipboardPipeline} from 'ckeditor5/src/clipboard'
import {UpcastWriter} from 'ckeditor5/src/engine'
import AudioEditing from './audioediting'
import AudioTypeCommand from './audiotypecommand'
import AudioUtils from '../audioutils'
import {downcastAudioAttribute, upcastAudioFigure} from './converters'
import {createAudioViewElement, determineAudioTypeForInsertionAtSelection, getAudioViewElementMatcher} from './utils'

export default class AudioBlockEditing extends Plugin {
    static get requires() {
        return [AudioEditing, AudioUtils, ClipboardPipeline];
    }

    static get pluginName() {
        return 'AudioBlockEditing';
    }

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        schema.register('audioBlock', {
            isObject: true,
            isBlock: true,
            allowWhere: '$block',
            allowAttributes: ['src', 'controls']
        });

        this._setupConversion();

        if (editor.plugins.has('AudioInlineEditing')) {
            editor.commands.add('audioTypeBlock', new AudioTypeCommand(this.editor, 'audioBlock'));

            this._setupClipboardIntegration();
        }
    }

    _setupConversion() {
        const editor = this.editor;
        const t = editor.t;
        const conversion = editor.conversion;
        const audioUtils = editor.plugins.get('AudioUtils');

        conversion.for('dataDowncast')
            .elementToElement({
                model: 'audioBlock',
                view: (modelElement, {writer}) => createAudioViewElement(writer, 'audioBlock')
            });

        conversion.for('editingDowncast')
            .elementToElement({
                model: 'audioBlock',
                view: (modelElement, {writer}) => audioUtils.toAudioWidget(
                    createAudioViewElement(writer, 'audioBlock'), writer, t('audio widget')
                )
            });

        conversion.for('downcast')
            .add(downcastAudioAttribute(audioUtils, 'audioBlock', 'src'))
            .add(downcastAudioAttribute(audioUtils, 'audioBlock', 'controls'));

        conversion.for('upcast')
            .elementToElement({
                view: getAudioViewElementMatcher(editor, 'audioBlock'),
                model: (viewAudio, {writer}) => writer.createElement('audioBlock', {
                    src: viewAudio.getAttribute('src'),
                    controls: viewAudio.getAttribute('controls')
                })
            })
            .add(upcastAudioFigure(audioUtils));

    }

    _setupClipboardIntegration() {
        const editor = this.editor;
        const model = editor.model;
        const editingView = editor.editing.view;
        const audioUtils = editor.plugins.get('AudioUtils');

        this.listenTo(editor.plugins.get('ClipboardPipeline'), 'inputTransformation', (evt, data) => {
            const docFragmentChildren = Array.from(data.content.getChildren());
            let modelRange;

            if (!docFragmentChildren.every(audioUtils.isInlineAudioView)) {
                return;
            }

            if (data.targetRanges) {
                modelRange = editor.editing.mapper.toModelRange(data.targetRanges[0]);
            }
            else {
                modelRange = model.document.selection.getFirstRange();
            }

            const selection = model.createSelection(modelRange);

            if (determineAudioTypeForInsertionAtSelection(model.schema, selection) === 'audioBlock') {
                const writer = new UpcastWriter(editingView.document);

                const blockViewAudios = docFragmentChildren.map(
                    inlineViewAudio => writer.createElement('figure', {class: 'audio'}, inlineViewAudio)
                );

                data.content = writer.createDocumentFragment(blockViewAudios);
            }
        });
    }
}

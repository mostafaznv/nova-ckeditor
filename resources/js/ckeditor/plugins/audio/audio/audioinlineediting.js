import {Plugin} from 'ckeditor5/src/core'
import {ClipboardPipeline} from 'ckeditor5/src/clipboard'
import {UpcastWriter} from 'ckeditor5/src/engine'
import {downcastAudioAttribute} from './converters'
import AudioEditing from './audioediting'
import AudioTypeCommand from './audiotypecommand'
import AudioUtils from '../audioutils'
import {getAudioViewElementMatcher, createAudioViewElement, determineAudioTypeForInsertionAtSelection} from './utils'


export default class AudioInlineEditing extends Plugin {
    static get requires() {
        return [AudioEditing, AudioUtils, ClipboardPipeline];
    }

    static get pluginName() {
        return 'AudioInlineEditing';
    }

    init() {
        const editor = this.editor;
        const schema = editor.model.schema;

        schema.register('audioInline', {
            isObject: true,
            isInline: true,
            allowWhere: '$text',
            allowAttributes: ['src']
        });

        schema.addChildCheck((context, childDefinition) => {
            if (context.endsWith('caption') && childDefinition.name === 'audioInline') {
                return false;
            }
        });

        this._setupConversion();

        if (editor.plugins.has('AudioBlockEditing')) {
            editor.commands.add('audioTypeInline', new AudioTypeCommand(this.editor, 'audioInline'));

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
                model: 'audioInline',
                view: (modelElement, {writer}) => writer.createEmptyElement('audio')
            });

        conversion.for('editingDowncast')
            .elementToElement({
                model: 'audioInline',
                view: (modelElement, {writer}) => audioUtils.toAudioWidget(
                    createAudioViewElement(writer, 'audioInline'), writer, t('audio widget')
                )
            });

        conversion.for('downcast')
            .add(downcastAudioAttribute(audioUtils, 'audioInline', 'src'));

        conversion.for('upcast')
            .elementToElement({
                view: getAudioViewElementMatcher(editor, 'audioInline'),
                model: (viewAudio, {writer}) => writer.createElement('audioInline', {src: viewAudio.getAttribute('src')})
            });
    }

    _setupClipboardIntegration() {
        const editor = this.editor;
        const model = editor.model;
        const editingView = editor.editing.view;
        const audioUtils = editor.plugins.get('AudioUtils');

        this.listenTo(editor.plugins.get('ClipboardPipeline'), 'inputTransformation', (evt, data) => {
            const docFragmentChildren = Array.from(data.content.getChildren());
            let modelRange;

            if (!docFragmentChildren.every(audioUtils.isBlockAudioView)) {
                return;
            }

            if (data.targetRanges) {
                modelRange = editor.editing.mapper.toModelRange(data.targetRanges[0]);
            }
            else {
                modelRange = model.document.selection.getFirstRange();
            }

            const selection = model.createSelection(modelRange);

            if (determineAudioTypeForInsertionAtSelection(model.schema, selection) === 'audioInline') {
                const writer = new UpcastWriter(editingView.document);

                const inlineViewAudios = docFragmentChildren.map(blockViewAudio => {
                    if (blockViewAudio.childCount === 1) {
                        Array.from(blockViewAudio.getAttributes())
                            .forEach(attribute => writer.setAttribute(
                                ...attribute,
                                audioUtils.findViewAudioElement(blockViewAudio)
                            ));

                        return blockViewAudio.getChild(0);
                    }
                    else {
                        return blockViewAudio;
                    }
                });

                data.content = writer.createDocumentFragment(inlineViewAudios);
            }
        });
    }
}

import {Plugin} from 'ckeditor5/src/core'
import AudioLoadObserver from './audioloadobserver'
import InsertAudioCommand from './insertaudiocommand'
import AudioUtils from "../audioutils"

export default class AudioEditing extends Plugin {
    static get requires() {
        return [AudioUtils];
    }

    static get pluginName() {
        return 'AudioEditing';
    }

    init() {
        const editor = this.editor;
        const conversion = editor.conversion;

        editor.editing.view.addObserver(AudioLoadObserver);

        conversion.for('upcast')
            .attributeToAttribute({
                view: {
                    name: 'audio',
                    key: 'src'
                },
                model: {
                    key: 'src',
                    value: viewAudio => {
                        const value = {
                            data: viewAudio.getAttribute('src')
                        };

                        if (viewAudio.hasAttribute('width')) {
                            value.width = viewAudio.getAttribute('width');
                        }

                        return value;
                    }
                }
            });

        const insertAudioCommand = new InsertAudioCommand(editor);
        editor.commands.add('insertAudio', insertAudioCommand);
        editor.commands.add('audioInsert', insertAudioCommand);
    }
}

export function createAudioViewElement(writer) {
    const emptyElement = writer.createEmptyElement('audio');
    const figure = writer.createContainerElement('figure', {class: 'audio'});

    writer.insert(writer.createPositionAt(figure, 0), emptyElement);

    return figure;
}

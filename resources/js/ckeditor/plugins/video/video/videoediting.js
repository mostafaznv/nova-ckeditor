import {Plugin} from 'ckeditor5/src/core'
import VideoLoadObserver from './videoloadobserver'
import InsertVideoCommand from './insertvideocommand'
import VideoUtils from "../videoutils"

export default class VideoEditing extends Plugin {
    static get requires() {
        return [VideoUtils];
    }

    static get pluginName() {
        return 'VideoEditing';
    }

    init() {
        const editor = this.editor;
        const conversion = editor.conversion;

        editor.editing.view.addObserver(VideoLoadObserver);

        conversion.for('upcast')
            .attributeToAttribute({
                view: {
                    name: 'video',
                    key: 'src'
                },
                model: {
                    key: 'src',
                    value: viewVideo => {
                        const value = {
                            data: viewVideo.getAttribute('src')
                        };

                        if (viewVideo.hasAttribute('width')) {
                            value.width = viewVideo.getAttribute('width');
                        }

                        return value;
                    }
                }
            });

        const insertVideoCommand = new InsertVideoCommand(editor);
        editor.commands.add('insertVideo', insertVideoCommand);
        editor.commands.add('videoInsert', insertVideoCommand);
    }
}

export function createVideoViewElement(writer) {
    const emptyElement = writer.createEmptyElement('video');
    const figure = writer.createContainerElement('figure', {class: 'video'});

    writer.insert(writer.createPositionAt(figure, 0), emptyElement);

    return figure;
}

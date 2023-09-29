import {Plugin} from 'ckeditor5/src/core'
import {Widget} from 'ckeditor5/src/widget'

import AudioInlineEditing from './audio/audioinlineediting'

import './theme/audio.css'

export default class AudioInline extends Plugin {
    static get requires() {
        return [AudioInlineEditing, Widget];
    }

    static get pluginName() {
        return 'AudioInline';
    }
}

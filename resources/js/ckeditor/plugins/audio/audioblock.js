import {Plugin} from 'ckeditor5/src/core'
import {Widget} from 'ckeditor5/src/widget'

import AudioBlockEditing from './audio/audioblockediting';

import './theme/audio.css';

export default class AudioBlock extends Plugin {
    static get requires() {
        return [AudioBlockEditing, Widget];
    }

    static get pluginName() {
        return 'AudioBlock';
    }
}

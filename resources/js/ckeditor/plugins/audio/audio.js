import {Plugin} from 'ckeditor5/src/core'
import AudioBlock from './audioblock'
import AudioInline from './audioinline'
import './theme/audio.css'

export default class Audio extends Plugin {
    static get requires() {
        return [AudioBlock, AudioInline];
    }

    static get pluginName() {
        return 'Audio';
    }
}

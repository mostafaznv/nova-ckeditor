import {Plugin} from 'ckeditor5/src/core'
import {Widget} from 'ckeditor5/src/widget'

import VideoBlockEditing from './video/videoblockediting';

import './theme/video.css';

export default class VideoBlock extends Plugin {
    static get requires() {
        return [VideoBlockEditing, Widget];
    }

    static get pluginName() {
        return 'VideoBlock';
    }
}

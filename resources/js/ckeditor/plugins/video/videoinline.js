import {Plugin} from 'ckeditor5/src/core'
import {Widget} from 'ckeditor5/src/widget'

import VideoInlineEditing from './video/videoinlineediting'

import './theme/video.css'

export default class VideoInline extends Plugin {
    static get requires() {
        return [VideoInlineEditing, Widget];
    }

    static get pluginName() {
        return 'VideoInline';
    }
}

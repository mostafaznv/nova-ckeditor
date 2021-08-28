import {Plugin} from 'ckeditor5/src/core'
import VideoBlock from './videoblock'
import VideoInline from './videoinline'
import './theme/video.css'

export default class Video extends Plugin {
    static get requires() {
        return [VideoBlock, VideoInline];
    }

    static get pluginName() {
        return 'Video';
    }
}

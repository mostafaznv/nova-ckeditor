'use strict';

// Base Editor
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

// Block Elements
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import Table from '@ckeditor/ckeditor5-table/src/table'

// Block Elements
import AutoFormat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import List from '@ckeditor/ckeditor5-list/src/list'
import TextPartLanguage from '@ckeditor/ckeditor5-language/src/textpartlanguage'
import {ShowBlocks} from '@ckeditor/ckeditor5-show-blocks'

// Font
import Font from '@ckeditor/ckeditor5-font/src/font'

// Styles & Enhancements
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import StrikeThrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import Code from '@ckeditor/ckeditor5-basic-styles/src/code'
import {GeneralHtmlSupport} from '@ckeditor/ckeditor5-html-support'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript'
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Link from '@ckeditor/ckeditor5-link/src/link'

// Images and Media
import Image from '@ckeditor/ckeditor5-image/src/image'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed'
import ImageTextAlternative from '@ckeditor/ckeditor5-image/src/imagetextalternative'

// Intend
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';

// Upload
import {SimpleUploadAdapter} from '@ckeditor/ckeditor5-upload'

// Browser
import ImageBrowser from './plugins/ImageBrowser'
import VideoBrowser from './plugins/VideoBrowser'
import AudioBrowser from './plugins/AudioBrowser'
import SnippetBrowser from './plugins/SnippetBrowser'

// Video
import Video from "./plugins/video/video"

// Audio
import Audio from "./plugins/audio/audio"


// Other
import {Clipboard} from '@ckeditor/ckeditor5-clipboard'
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting'
import ElementAddAttributes from './plugins/element-attribute/src/add-attribute-to-element'

// Extend the Base Class
export default class CkEditor extends ClassicEditorBase {

    // Merge Configurations
    static get defaultConfig() {
        return {
            licenseKey: '',
            ...require('./config/link').default,
            ...require('./config/image').default,
            ...require('./config/media').default,
            ...require('./config/table').default,
            ...require('./config/toolbar').default,
            ...require('./config/headings').default,
            ...require('./config/html').default,
            ...require('./config/video').default,
            ...require('./config/audio').default,
            ...require('./config/simple-upload').default
        }
    }

    // Add Plugins
    static get builtinPlugins() {
        return [
            ImageBrowser,
            VideoBrowser,
            AudioBrowser,
            SnippetBrowser,
            Video,
            Audio,
            Essentials,
            Font,
            Link,
            List,
            Heading,
            TextPartLanguage,
            Paragraph,
            ShowBlocks,
            BlockQuote,
            CodeBlock,
            PasteFromOffice,
            RemoveFormat,
            HorizontalLine,
            Bold,
            Italic,
            Underline,
            Subscript,
            Alignment,
            AutoFormat,
            Superscript,
            StrikeThrough,
            Code,
            GeneralHtmlSupport,
            Image,
            ImageStyle,
            ImageUpload,
            ImageCaption,
            ImageResize,
            ImageToolbar,
            ImageTextAlternative,
            MediaEmbed,
            Table,
            TableToolbar,
            HtmlEmbed,
            SourceEditing,
            Indent,
            IndentBlock,
            ElementAddAttributes,
            Clipboard,
            SimpleUploadAdapter
        ]
    }
}

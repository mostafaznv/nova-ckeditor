import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ElementAddAttributesEditing from './add-attribute-to-element-editing';
import ElementAddAttributesUI from './add-attribute-to-element-ui';

export default class ElementAddAttributes extends Plugin {
    static get requires() {
        return [ElementAddAttributesEditing, ElementAddAttributesUI];
    }

    static get pluginName() {
        return 'elementIdAttributes';
    }
}

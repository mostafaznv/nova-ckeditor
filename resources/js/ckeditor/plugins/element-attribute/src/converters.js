import {first} from '@ckeditor/ckeditor5-utils/src/first'

export function modelToViewStyleAttribute() {
    return (evt, data, conversionApi) => {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const viewElement = conversionApi.mapper.toViewElement(data.item);

        conversionApi.writer.setAttribute(data.attributeKey, data.attributeNewValue, viewElement);
    };
}

export function viewToModelStyleAttribute() {
    return (evt, data, conversionApi) => {
        if (!data.modelRange) {
            return;
        }

        const modelImageElement = first(data.modelRange.getItems())
        const id = data.viewItem.getAttribute('id')

        if (id) {
            conversionApi.writer.setAttribute('id', id, modelImageElement)
        }
    };
}

import {first} from 'ckeditor5/src/utils'

export function upcastAudioFigure(audioUtils) {
    return dispatcher => {
        dispatcher.on('element:figure', converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.test(data.viewItem, {name: true, classes: 'audio'})) {
            return;
        }

        const viewAudio = audioUtils.findViewAudioElement(data.viewItem);

        if (!viewAudio || !viewAudio.hasAttribute('src') || !conversionApi.consumable.test(viewAudio, {name: true})) {
            return;
        }

        const conversionResult = conversionApi.convertItem(viewAudio, data.modelCursor);

        const modelAudio = first(conversionResult.modelRange.getItems());

        if (!modelAudio) {
            return;
        }

        conversionApi.convertChildren(data.viewItem, modelAudio);

        conversionApi.updateConversionResult(modelAudio, data);
    }
}

export function downcastAudioAttribute(audioUtils, audioType, attributeKey) {
    return dispatcher => {
        dispatcher.on(`attribute:${attributeKey}:${audioType}`, converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const viewWriter = conversionApi.writer;
        const element = conversionApi.mapper.toViewElement(data.item);
        const audio = audioUtils.findViewAudioElement(element);

        viewWriter.setAttribute(data.attributeKey, data.attributeNewValue || '', audio);
    }
}

import {first} from 'ckeditor5/src/utils'

export function upcastVideoFigure(videoUtils) {
    return dispatcher => {
        dispatcher.on('element:figure', converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.test(data.viewItem, {name: true, classes: 'video'})) {
            return;
        }

        const viewVideo = videoUtils.findViewVideoElement(data.viewItem);

        if (!viewVideo || !viewVideo.hasAttribute('src') || !conversionApi.consumable.test(viewVideo, {name: true})) {
            return;
        }

        const conversionResult = conversionApi.convertItem(viewVideo, data.modelCursor);

        const modelVideo = first(conversionResult.modelRange.getItems());

        if (!modelVideo) {
            return;
        }

        conversionApi.convertChildren(data.viewItem, modelVideo);

        conversionApi.updateConversionResult(modelVideo, data);
    }
}

export function downcastVideoAttribute(videoUtils, videoType, attributeKey) {
    return dispatcher => {
        dispatcher.on(`attribute:${attributeKey}:${videoType}`, converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const viewWriter = conversionApi.writer;
        const element = conversionApi.mapper.toViewElement(data.item);
        const video = videoUtils.findViewVideoElement(element);

        viewWriter.setAttribute(data.attributeKey, data.attributeNewValue || '', video);
    }
}

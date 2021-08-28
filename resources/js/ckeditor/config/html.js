export default {
    htmlEmbed: {
        showPreviews: true,
        sanitizeHtml: (inputHtml) => ({
            html: inputHtml,
            hasChanged: true
        })
    }
}

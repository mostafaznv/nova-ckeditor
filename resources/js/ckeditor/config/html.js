export default {
    htmlEmbed: {
        showPreviews: true,
        sanitizeHtml(rawHtml) {
            return {
                html: rawHtml,
                hasChanged: false
            }
        }
    }
}

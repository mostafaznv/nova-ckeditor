/**
 * Map Nova Resource to Normal Object Format Including Additional Properties.
 * @param resource {Object}
 * @return {Object}
 */
export const resourceToObject = ({fields, id}) => {
    return fields.reduce((obj, item) => {
        if (item.displayedAs) {
            obj[item.attribute] = item.displayedAs
        }
        else if (item.value) {
            obj[item.attribute] = item.value
        }
        else {
            obj[item.attribute] = null
        }

        if (item.id) {
            obj.id = item.id
        }
        else if (id.value) {
            obj.id = id.value
        }

        if (item.attribute === 'size') {
            obj.size_original = item.value
        }


        if (item.hasOwnProperty('previewUrl')) {
            obj.url = item.previewUrl
        }
        else if (item.hasOwnProperty('thumbnailUrl')) {
            obj.url = item.thumbnailUrl
        }

        if (item.hasOwnProperty('meta')) {
            obj.meta = item.meta
        }

        return obj
    }, {})
}

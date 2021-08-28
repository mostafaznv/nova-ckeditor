export default {
    methods: {
        /**
         * Map Nova Resource to Normal Object Format Including Additional Properties.
         * @param resource {Object}
         * @return {Object}
         */
        resourceToObject({fields}) {
            return fields.reduce((obj, item) => {
                obj[item.attribute] = item.value
                if (item.hasOwnProperty('thumbnailUrl')) {
                    obj.url = item.thumbnailUrl
                }
                else if (item.hasOwnProperty('previewUrl')) {
                    obj.url = item.previewUrl
                }
                if (item.hasOwnProperty('meta')) {
                    obj.meta = item.meta
                }
                return obj
            }, {})
        },

        /**
         * Fetch Resource Entity
         * @param resourceKey {String}
         * @param id {String|Number}
         * @return {Promise<Array>}
         */
        async fetchResourceEntity(resourceKey, id) {
            return await Nova.request()
                .get(`/nova-api/${resourceKey}/${id}`)
                .then(({data}) => this.resourceToObject(data.resource))
                .catch(this.handleResourceError)
        },

        /**
         * Fetch Resource Collection
         * @param resourceKey {String}
         * @param params {Object}
         * @return {Promise<Array>}
         */
        async fetchResourceCollection(resourceKey, params) {
            return await Nova.request()
                .get(`/nova-api/${resourceKey}`, {params})
                .then(({data}) => data.resources.map((resource) => this.resourceToObject(resource)))
                .catch(this.handleResourceError)
        },

        /**
         * Fetch Resource Entity as Object
         * @param resourceKey {String}
         * @param params {Object}
         * @return {Promise<Array>}
         */
        async uploadResource(resourceKey, params) {
            const data = new FormData
            Object.entries(params).forEach(([key, value]) => data.append(key, value))
            return await Nova.request()
                .post(`/nova-api/${resourceKey}`, data)
                .then(({data}) => data.resource)
                .catch(this.handleResourceError)
        },

        /**
         * Handle Resource Error
         * @param error {Error}
         * @return void
         */
        handleResourceError(error) {
            this.$toasted.show(this.__(':message', {message: error}), {
                type: 'error'
            })
        }
    }
}

export default {
    computed: {
        editorUUID() {
            return this.editorName + 'UUID'
        }
    },

    methods: {
        uuid() {
            return crypto.getRandomValues(new Uint32Array(4)).join('-')
        },
    },
}

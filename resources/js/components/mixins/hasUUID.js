export default {
    computed: {
        editorUUID() {
            return this.editorName + 'UUID'
        }
    },

    methods: {
        uuid() {
            return crypto.randomUUID()
        },
    },
}

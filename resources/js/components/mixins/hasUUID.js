export default {
    methods: {
        uuid() {
            return crypto.getRandomValues(new Uint32Array(4)).join('-')
        },
    },
}

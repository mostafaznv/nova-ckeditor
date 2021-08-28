Nova.booting((Vue, router) => {
    Vue.use(require("v-lazy-image").VLazyImagePlugin)
    Vue.component('index-ckeditor', require('./components/editor-index').default)
    Vue.component('detail-ckeditor', require('./components/editor-detail').default)
    Vue.component('form-ckeditor', require('./components/editor-field').default)
    Vue.component('index-media', require('./components/media-index').default)
    Vue.component('detail-media', require('./components/media-detail').default)
    Vue.component('form-media', require('./components/media-field').default)
})

import EditorIndex from './components/editor-index'
import EditorDetail from './components/editor-detail'
import EditorField from './components/editor-field'
import MediaIndex from './components/media-index'
import MediaDetail from './components/media-detail'
import MediaField from './components/media-field'
import clickOutside from './utils/click-outside'


Nova.booting((Vue) => {
    Vue.component('index-ckeditor', EditorIndex)
    Vue.component('detail-ckeditor', EditorDetail)
    Vue.component('form-ckeditor', EditorField)
    Vue.component('index-media', MediaIndex)
    Vue.component('detail-media', MediaDetail)
    Vue.component('form-media', MediaField)


    Vue.directive('click-outside', clickOutside)
})

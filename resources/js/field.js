import EditorIndex from './fields/editor-index'
import EditorDetail from './fields/editor-detail'
import EditorField from './fields/editor-field'


Nova.booting((Vue) => {
    Vue.component('index-ckeditor', EditorIndex)
    Vue.component('detail-ckeditor', EditorDetail)
    Vue.component('form-ckeditor', EditorField)
})

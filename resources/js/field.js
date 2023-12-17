import EditorIndex from './components/editor-index'
import EditorDetail from './components/editor-detail'
import EditorField from './components/editor-field'


Nova.booting((Vue) => {
    Vue.component('index-ckeditor', EditorIndex)
    Vue.component('detail-ckeditor', EditorDetail)
    Vue.component('form-ckeditor', EditorField)
})

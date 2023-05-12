<template>
    <default-field :field="field" :errors="errors" :full-width-content="true">
        <template #field>
            <textarea ref="editor" class="hidden" :id="field.attribute" :class="errorClasses" :value="value" />

            <p v-if="field.helpText" v-html="field.helpText" class="help-text help-text mt-2" />

            <media-browser @select="$options[editorName].execute('imageBrowser', $event)" type="image" :field-key="$options[editorUUID] + '-image'" :multiple="true" />
            <media-browser @select="$options[editorName].execute('videoBrowser', $event)" type="video" :field-key="$options[editorUUID] + '-video'" :multiple="true" :has-larupload-trait="field.videoHasLaruploadTrait" />
            <snippet-browser :field-key="$options[editorUUID]" :snippets="field.snippetBrowser" />
        </template>
    </default-field>
</template>

<script>
import CkEditor from '../ckeditor/ckeditor'
import SnippetBrowser from "./snippet-browser"
import MediaBrowser from "./media-browser"
import HasUUID from "./mixins/hasUUID"
import {FormField, HandlesValidationErrors} from 'laravel-nova'
import debounce from 'lodash/debounce'
import RegexParser from 'regex-parser'

export default {
    mixins: [FormField, HandlesValidationErrors, HasUUID],
    props: ['resourceName', 'resourceId', 'field', 'toolbar'],
    components: {SnippetBrowser, MediaBrowser},
    computed: {
        editorName() {
            const attribute = this.field.attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

            return attribute + 'Editor'
        }
    },
    methods: {
        setInitialValue() {
            this.value = this.field.value || ''
        },

        initToolbarOptions(toolbarOptions) {
            if (toolbarOptions.mediaEmbed) {
                if (toolbarOptions.mediaEmbed.providers) {
                    toolbarOptions.mediaEmbed.providers = this.normalizeMediaEmbedToolbarOptions(toolbarOptions.mediaEmbed.providers)
                }
                if (toolbarOptions.mediaEmbed.extraProviders) {
                    toolbarOptions.mediaEmbed.extraProviders = this.normalizeMediaEmbedToolbarOptions(toolbarOptions.mediaEmbed.extraProviders)
                }
            }

            return toolbarOptions
        },

        normalizeMediaEmbedToolbarOptions(providers) {
            if (providers && Array.isArray(providers)) {
                for (let i = 0; i < providers.length; i++) {
                    const url = providers[i]?.url ?? null
                    const html = providers[i]?.html ?? null

                    if (Array.isArray(url)) {
                        const urls = url

                        for (let j = 0; j< urls.length; j++) {
                            urls[j] = RegexParser(urls[j])
                        }

                        providers[i].url = urls
                    }
                    else if (url) {
                        providers[i].url = RegexParser(url)
                    }

                    if (html) {
                        providers[i].html = (match) => eval('`' + html + '`')
                    }
                }
            }

            return providers
        },

        fill(formData) {
            formData.append(this.field.attribute, this.value || '')
        },

        handleChange(value) {
            this.value = value
        },

        handleEditorEvents(event, data) {
            if (['Tab', '/'].includes(data.key) || [191, 9].includes(data.keyCode)) {
                data.stopPropagation()
            }
        },

        handleEditorSync() {
            const editor = this.$options[this.editorName]

            if (editor) {
                this.handleChange(editor.getData())
            }
        },
    },
    created() {
        this.$options[this.editorUUID] = this.uuid()

        this.setInitialValue()
    },
    mounted() {
        const toolbarOptions = this.initToolbarOptions(this.field.toolbarOptions)
        const headings = toolbarOptions.headings

        // delete toolbarOptions.headings

        const config = {
            attribute: this.$options[this.editorUUID],
            imageBrowser: this.field.imageBrowser,
            videoBrowser: this.field.videoBrowser,
            snippetBrowser: this.field.snippetBrowser,
            isReadOnly: this.field.readonly,
            language: {
                ui: this.field.uiLanguage,
                content: this.field.contentLanguage,
                textPartLanguage: this.field.textPartLanguage
            },
            heading: {
                options: headings,
            },
            toolbar: {
                items: this.field.toolbar,
                shouldNotGroupWhenFull: this.field.shouldNotGroupWhenFull
            },
            ...toolbarOptions
        }

        CkEditor.create(this.$refs.editor, config)
            .then((editor) => {
                const {editing, model} = this.$options[this.editorName] = editor

                // prevent question-mark & slash from triggering nova search
                editing.view.document.on('keydown', this.handleEditorEvents, {
                    priority: 'highest'
                })

                // sync model changes to vue-model
                model.document.on('change', debounce(this.handleEditorSync, 100), {
                    priority: 'lowest'
                })

                // set the height of the editor when editing
                if (this.field.height > 1) {
                    editor.editing.view.change(writer => {
                        writer.setStyle('height', `${this.field.height}px`, editor.editing.view.document.getRoot());
                    });
                }

                if (this.field.readonly) {
                    editor.enableReadOnlyMode(this.$options[this.editorUUID]);
                }
            })
            .catch((e) => {
                this.$toasted.show(e.toString(), {type: 'error'})
            })
    },
    beforeUnmount() {
        if (this.$options[this.editorName]) {
            this.$options[this.editorName].destroy()
                .then(() => this.$options[this.editorName] = null)
                .catch((e) => this.$toasted.show(e.toString(), {type: 'error'}))
        }
    }
}
</script>

<style lang="sass">
.ck.ck-reset_all, .ck.ck-reset_all *
    // direction: ltr !important

.ck-content.ck-editor__editable
    resize: vertical

.ck.ck-reset.ck-editor
    .ck.ck-toolbar
        border-radius: 10px 10px 0 0

    .ck-editor__editable_inline
        border-radius: 0 0 10px 10px
        margin: 0
        padding: 0 10px
        @import "../../sass/field"

    .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused
        box-shadow: none
</style>

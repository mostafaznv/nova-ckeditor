<template>
    <default-field :field="currentField" :errors="errors" :full-width-content="true">
        <template #field>
            <textarea ref="editor" class="hidden" :id="currentField.attribute" :class="errorClasses" :value="value"/>

            <p v-if="currentField.helpText" v-html="currentField.helpText" class="help-text help-text mt-2"/>

            <media-browser
                @select="$options[editorName].execute('mediaBrowser', $event)"
                :field-key="$options[editorUUID] + '-media-browser'"
                :image-has-larupload-trait="currentField.imageHasLaruploadTrait"
                :video-has-larupload-trait="currentField.videoHasLaruploadTrait"
                :has-image-picker="currentField.imageBrowser"
                :has-video-picker="currentField.videoBrowser"
                :has-audio-picker="currentField.audioBrowser"
                :has-file-picker="currentField.fileBrowser"
                :multiple="true"
            />

            <snippet-browser
                :field-key="$options[editorUUID] + '-snippets-browser'"
                :snippets="currentField.snippetBrowser"
            />
        </template>
    </default-field>
</template>

<script>
import CkEditor from '../ckeditor/ckeditor'
import SnippetBrowser from "../components/snippet-browser/SnippetBrowser.vue"
import MediaBrowser from '../components/media-browser/MediaBrowser.vue'
import HasUUID from "../components/mixins/hasUUID"
import {DependentFormField, HandlesValidationErrors, PreventsFormAbandonment} from 'laravel-nova'
import debounce from 'lodash/debounce'
import RegexParser from 'regex-parser'

export default {
    mixins: [DependentFormField, HandlesValidationErrors, PreventsFormAbandonment, HasUUID],
    props: ['resourceName', 'resourceId', 'field', 'toolbar', 'formUniqueId'],
    components: {SnippetBrowser, MediaBrowser},
    data() {
        return {
            mounted: false,
            fieldHasChanged: false
        }
    },
    computed: {
        editorName() {
            const attribute = this.currentField.attribute.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

            return attribute + 'Editor' + this.formUniqueId;
        }
    },
    watch: {
        value(value) {
            this.emitFieldValueChange(this.currentField.attribute, value || '')
        },

        currentlyIsVisible(status) {
            if (status && this.mounted) {
                setTimeout(this.createCkEditor, 5)
            }
        }
    },
    methods: {
        createCkEditor() {
            const toolbarOptions = this.initToolbarOptions(this.currentField.toolbarOptions)
            const headings = toolbarOptions.headings
            const image = toolbarOptions.image ?? CkEditor.defaultConfig.image

            delete toolbarOptions.headings
            delete toolbarOptions.image

            const config = {
                attribute: this.$options[this.editorUUID],
                mediaBrowser: true,
                snippetBrowser: this.currentField.snippetBrowser,
                htmlSupport: this.normalizeHtmlSupportItems(this.currentField.htmlSupport),
                isReadOnly: this.currentField.readonly,
                image: image,
                language: {
                    ui: this.currentField.uiLanguage,
                    content: this.currentField.contentLanguage,
                    textPartLanguage: this.currentField.textPartLanguage
                },
                heading: {
                    options: headings,
                },
                toolbar: {
                    items: this.currentField.toolbar,
                    shouldNotGroupWhenFull: this.currentField.shouldNotGroupWhenFull
                },
                simpleUpload: {
                    ...CkEditor.defaultConfig.simpleUpload,

                    headers: {
                        ...CkEditor.defaultConfig.simpleUpload.headers,
                        'X-Toolbar': this.currentField.toolbarName
                    },
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

                    model.document.on('change:data', () => {
                        this.fieldHasChanged = true

                        if (this.currentField.alertBeforeUnsavedChanges) {
                            this.preventLeavingForm()
                        }
                    })

                    editor.editing.view.change((writer) => {
                        // set the height of the editor when editing
                        if (this.currentField.height > 1) {
                            writer.setStyle('height', `${this.currentField.height}px`, editor.editing.view.document.getRoot());
                        }

                        this.editorResizeFix(editor, writer)
                    });

                    this.syncDataOnSourceEditing()

                    if (this.currentField.readonly) {
                        editor.enableReadOnlyMode(this.$options[this.editorUUID]);
                    }


                    if (this.currentField.forcePasteAsPlainText) {
                        editor.editing.view.document.on('clipboardInput', (evt, data) => {
                            evt.stop()

                            const model = editor.model
                            const selection = model.document.selection
                            const selectedRange = selection.getFirstRange()
                            const content = data.dataTransfer.getData('text/plain')

                            model.change(writer => {
                                if (selectedRange.isCollapsed) {
                                    writer.insertText(
                                        content, selection.getFirstPosition()
                                    )
                                }
                                else {
                                    editor.execute('input', {
                                        text: content
                                    })
                                }
                            });
                        })
                    }
                })
                .catch((e) => {
                    console.log(e)
                    Nova.error(e.toString())
                })
        },

        destroyCkEditor() {
            if (this.$options[this.editorName]) {
                this.$options[this.editorName]
                    .destroy()
                    .then(() => this.$options[this.editorName] = null)
                    .catch((e) => Nova.error(e.toString()))
            }
        },

        setInitialValue() {
            this.value = this.currentField.value || ''
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

                        for (let j = 0; j < urls.length; j++) {
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

        normalizeHtmlSupportItems(htmlSupport) {
            if (htmlSupport) {
                if (htmlSupport.allow) {
                    htmlSupport.allow.map(item => {
                        if (item.name) {
                            item.name = this.stringToRegex(item.name)
                        }

                        return item
                    })
                }
                else {
                    htmlSupport.allow = []
                }

                if (htmlSupport.disallow) {
                    htmlSupport.disallow.map(item => {
                        if (item.name) {
                            item.name = this.stringToRegex(item.name)
                        }

                        return item
                    })
                }
                else {
                    htmlSupport.disallow = []
                }

                return htmlSupport
            }

            return {
                allow: [],
                disallow: []
            }
        },

        stringToRegex(string) {
            if (typeof string === 'string' && string.startsWith('/') && string.endsWith('/')) {
                const regexPattern = string.slice(1, -1)

                return new RegExp(regexPattern)
            }

            return string
        },

        syncDataOnSourceEditing() {
            const editor = this.$options[this.editorName]
            const sourceEditing = editor.plugins.get('SourceEditing')


            sourceEditing.on('change:isSourceEditingMode', (_eventInfo, _name, value) => {
                if (value) {
                    const sourceEditingTextarea = editor.editing.view.getDomRoot()?.nextSibling?.firstChild

                    if (!sourceEditingTextarea) {
                        throw new Error('This should not be possible')
                    }


                    sourceEditingTextarea.addEventListener('input', debounce(() => {
                        sourceEditing.updateEditorData()
                    }, 500))
                }
            })
        },

        fill(formData) {
            if (this.currentlyIsVisible) {
                formData.append(this.currentField.attribute, this.value || '')
            }
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

        // fix for keeping editor height on resize
        editorResizeFix(editor, writer) {
            const resizeObserver = new ResizeObserver(
                debounce((element) => {
                    const height = element[0].target.offsetHeight

                    if (height > 10) {
                        writer.setStyle('height', `${height}px`, editor.editing.view.document.getRoot())
                    }
                }, 100),
            )

            const innerEditor = editor.ui.view.element.getElementsByClassName('ck-editor__editable')

            if (innerEditor?.length) {
                resizeObserver.observe(innerEditor[0])
            }
        },
    },
    created() {
        this.$options[this.editorUUID] = this.uuid()

        this.setInitialValue()
    },
    mounted() {
        if (this.currentlyIsVisible) {
            this.createCkEditor()
        }

        this.mounted = true
    },
    beforeUnmount() {
        this.destroyCkEditor()
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

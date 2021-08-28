<template>
    <modal v-model="isVisible" ref="modal" :title="__('Snippets')">
        <div class="flex min-h-full">
            <div class="w-1/5">
                <div
                    v-for="(snippet, key) in snippets"
                    :key="key"
                    @click="selected = snippet.html"
                    class="snippet border-l-4 p-3 cursor-pointer"
                    :class="{'snippet-selected': selected === snippet.html}">
                    <strong>{{ __(snippet.name) }}</strong>
                </div>
            </div>

            <div class="w-4/5 bg-white min-h-full p-8 relative">
                <div v-html="selected" class="snippet-content" />
            </div>
        </div>

        <template v-slot:footer>
            <div class="flex p-2">
                <div>
                    <button :disabled="!selected" @click.prevent="insert(selected)" class="btn btn-default btn-primary items-center relative mr-3">
                        <span>{{ __('Insert Snippet') }}</span>
                    </button>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
import modal from './modal'

export default {
    name: "snippet-browser",
    components: {modal},
    props: {
        fieldKey: {default: () => 'content'},
        snippets: {default: () => ([])},
    },
    data: () => ({
        isVisible: false,
        selected: null,
    }),
    computed: {
        event() {
            return `ckeditor:snippets:${this.fieldKey}`
        }
    },
    methods: {
        insert(snippet) {
            Nova.$emit(`${this.event}:write`, snippet)
            this.isVisible = false
        },

        /**
         * Show the Modal
         */
        show() {
            const [{html}] = this.snippets
            this.selected = html || null
            this.isVisible = !this.isVisible
        },

        /**
         * Close the Modal
         * If the user focuses another instance of the editor, close the modal.
         */
        close(fieldKey) {
            if (fieldKey !== this.fieldKey) {
                this.isVisible = false
            }
        },
    },
    created() {
        Nova.$on(this.event, this.show)
        Nova.$on(`ckeditor:focused`, this.close)
    },
    beforeDestroy() {
        Nova.$off(this.event, this.show)
        Nova.$off(`ckeditor:focused`, this.close)
    }
}
</script>

<style lang="sass">
.snippet
    color: white
    border-color: gray
    font-size: 14px

    &:hover:not(.snippet-selected)
        background: rgba(100, 100, 100, 0.3)
        border-color: #5f5f5f

.snippet-content
    border-color: #999999
    @import "./../../sass/figures.sass"
    @import "./../../sass/blocks.sass"

.snippet-selected
    background: rgba(100, 100, 100, 0.3)
    border-color: #fff
</style>

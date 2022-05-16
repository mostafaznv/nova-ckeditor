<template>
    <modal v-model="isVisible" ref="modal" class="snippet-modal" :title="__('Snippets')" content-no-overflow>
        <div class="relative flex min-h-full bg-white max-h-full overflow-y-scroll">
            <div class="w-1/5 p-sticky top-0 min-h-full bg-gray-100">
                <div class="sidebar-group">
                    <div
                        v-for="(snippet, key) in snippets"
                        :key="key"
                        @click="selected = snippet.html"
                        class="sidebar-item"
                    >
                        <span
                            class="sidebar-item-title text-base	"
                            :class="{'inertia-link-active': selected === snippet.html}"
                        >
                            {{ __(snippet.name) }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="w-4/5 min-h-full p-8 relative">
                <div v-html="selected" class="snippet-content" />
                <br /><br />
            </div>
        </div>

        <template v-slot:footer>
            <div class="flex p-2">
                <div>
                    <button :disabled="!selected" @click.prevent="insert(selected)" class="bg h-9 shadow bg-primary-500 hover:bg-primary-400 mr-3 text-white dark:text-gray-900 rounded inline-flex items-center justify-center px-3 shadow">
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
.snippet-content
    border-color: #999999
    @import "./../../sass/figures.sass"
    @import "./../../sass/blocks.sass"

.snippet-selected
    background: rgba(100, 100, 100, 0.3)
    border-color: #fff
</style>

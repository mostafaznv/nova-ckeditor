<template>
    <modal v-model="modalStatus" class="snippet-browser" :title="__('Snippet Browser')" :content-no-overflow="true">
        <template #header>
            <span v-if="snippet"> - {{ __(snippet.name) }}</span>
        </template>


        <div class="flex h-full">
            <snippet-browser-type-list
                v-model="snippet"
                :snippets="snippets"
            />

            <div class="relative flex-grow flex flex-col justify-between">
                <div class="snippet-browser__main p-4">
                    <div
                        v-if="snippet"
                        v-html="snippet.html"
                        class="snippet-content"
                    />
                </div>

                <snippet-browser-footer
                    @pick="pick"
                    :snippet="snippet"
                />
            </div>
        </div>
    </modal>
</template>

<script setup>
import {computed, ref, onBeforeUnmount} from "vue"
import modal from "../modal"
import SnippetBrowserTypeList from "./SnippetBrowserTypeList.vue"
import SnippetBrowserFooter from "./SnippetBrowserFooter.vue"


// variables
const props = defineProps({
    snippets: {
        type: Array,
        default: () => ([])
    },
    fieldKey: {
        type: String,
        default: 'content'
    }
})

const modalStatus = ref(false)
const snippet = ref({})



// computed properties
const event = computed(() => {
    return `ckeditor:snippets:${props.fieldKey}`
})



// methods
function init() {
    Nova.$on(event.value, openModal)
    Nova.$on('ckeditor:focused', closeModal)
}

function openModal() {
    modalStatus.value = true
}

function closeModal() {
    modalStatus.value = false
}

function pick() {
    if (snippet.value) {
        Nova.$emit(`${event.value}:write`, snippet.value.html)

        closeModal()
    }
}


// hooks
onBeforeUnmount(() => {
    Nova.$off(event.value, openModal)
    Nova.$off('ckeditor:focused', closeModal)
})


init()
</script>

<style lang="scss" scoped>
.snippet-browser {
    z-index: 9999;

    &__main {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 48px);
        outline: none;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<style lang="scss">
.snippet-content {
    @import "../../../sass/figures";
    @import "../../../sass/blocks";
}
</style>

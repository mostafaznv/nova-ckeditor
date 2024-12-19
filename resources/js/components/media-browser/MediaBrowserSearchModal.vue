<template>
    <button @click.stop="modalStatus = true" v-bind="$attrs" type="button" class="media-browser-btn" :title="__('Search')">
        <Icon name="magnifying-glass" />
    </button>

    <modal v-model="modalStatus" class="search-modal" :content-no-overflow="true">
        <template #header>
            <div class="flex items-center gap-1">
                <Icon name="magnifying-glass" type="mini" :solid="true" />

                <input
                    @keydown.enter.stop.prevent="submit"
                    @select.stop.prevent
                    v-model="keyword"
                    class="search-modal__input flex-grow"
                    :placeholder="__('Search assets')"
                />
            </div>
        </template>


        <div class="p-3 overflow-x-hidden">
            <span class="search-modal__history--label text-gray-500 dark:text-gray-400">
                {{ __('Recent searches') }}:
            </span>

            <div
                v-for="(item, index) in reverseHistory"
                @click.stop="select(index)"
                class="search-modal__history--item flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800"
                :key="index"
            >
                <span class="text-gray-500 dark:text-gray-400">{{ item }}</span>

                <button
                    @click.stop="deleteItemFromHistory(index)"
                    type="button"
                    :title="__('Delete')"
                >
                    <Icon name="x-mark" />
                </button>
            </div>
        </div>
    </modal>
</template>

<script setup>
import {ref, computed, watch} from "vue"
import {Icon} from 'laravel-nova-ui'
import modal from "../modal"


// emits
const emit = defineEmits([
    'update:modelValue'
])


// variables
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const modalStatus = ref(false)
const keyword = ref('')
const history = ref([])
const storageKey = 'nova-ckeditor.keyword'


// computed properties
const reverseHistory = computed(() => {
    return history.value.slice().reverse()
})


// watchers
watch(
    () => props.modelValue,
    (value) => {
        keyword.value = value
    },
    {immediate: true}
)



// methods
function submit() {
    pushToHistory(keyword.value)

    emit('update:modelValue', keyword.value)

    close()
}

function pushToHistory(value) {
    if (value) {
        const items = history.value

        items.push(value)

        if (items.length > 6) {
            items.shift()
        }

        localStorage.setItem(storageKey, JSON.stringify(items))

        history.value = items
    }
}

function select(index) {
    keyword.value = reverseHistory.value[index]

    emit('update:modelValue', keyword.value)
    close()
}

function deleteItemFromHistory(index) {
    index = history.value.length - index - 1

    history.value.splice(index, 1)

    localStorage.setItem(storageKey, JSON.stringify(history.value))
}

function close() {
    modalStatus.value = false
}

function initHistory() {
    let items = localStorage.getItem(storageKey)

    if (items) {
        items = JSON.parse(items)
        items = Array.isArray(items) ? items : []
    }
    else {
        items = []
    }

    history.value = items
}

initHistory()
</script>

<style lang="scss" scoped>
::v-deep(.search-modal) {
    max-width: 600px;
    height: 300px !important;
    top: calc(50% - 150px) !important;
    left: calc(50% - 300px) !important;

    .search-modal__input {
        outline: none;
        //width: 300px;
        height: 30px;
        background: transparent;
    }

    .search-modal__history {
        &--label {
            display: block;
            font-size: 14px;
            margin-bottom: 12px;
        }

        &--item {
            height: 32px;
            cursor: pointer;
            transition: all 300ms;
            padding: 4px;
            border-radius: 6px;

            & > span {
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            & > button {
                color: rgba(var(--colors-gray-400));
                opacity: 0;
                transition: all 300ms;

                &:hover {
                    color: rgba(var(--colors-primary-400));
                }

                svg {
                    width: 16px;
                    height: 16px;
                }
            }

            &:hover {
                & > button {
                    opacity: 1;
                }
            }
        }
    }
}
</style>

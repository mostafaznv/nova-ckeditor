<template>
    <div class="browser-list" :class="{'is-extended': extended}">
        <div>
            <div
                v-if="hasImagePicker"
                @click="select('image')"
                class="browser-list__item"
                :class="{selected: modelValue === 'image'}"
                :title="__('Images')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>

                <span>{{ __('Images') }}</span>
            </div>

            <div
                v-if="hasVideoPicker"
                @click="select('video')"
                class="browser-list__item"
                :class="{selected: modelValue === 'video'}"
                :title="__('Videos')"
            >
                <video-icon />

                <span>{{ __('Videos') }}</span>
            </div>

            <div
                v-if="hasAudioPicker"
                @click="select('audio')"
                class="browser-list__item"
                :class="{selected: modelValue === 'audio'}"
                :title="__('Audios')"
            >
                <audio-icon />

                <span>{{ __('Audios') }}</span>
            </div>

            <div
                v-if="hasFilePicker"
                @click="select('file')"
                class="browser-list__item"
                :class="{selected: modelValue === 'file'}"
                :title="__('Files')"
            >
                <file-icon />

                <span>{{ __('Files') }}</span>
            </div>
        </div>

        <div class="browser-list__toggle-sidebar">
            <button type="button" @click.stop.prevent="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z"></path><path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z"></path></svg>
            </button>
        </div>

        <div class="browser-list__pick">
            <default-button
                @click.stop="pick"
                type="button"
                class="flex align-middle gap-2"
                size="sm"
                :class="{'opacity-50': selectedItems.length === 0}"
                :disabled="selectedItems.length === 0"
            >
                <Icon type="check" width="20" height="20" />
            </default-button>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import AudioIcon from "../icons/AudioIcon.vue"
import FileIcon from "../icons/FileIcon.vue"
import VideoIcon from "../icons/VideoIcon.vue"
import {selectedItemsProp} from "../../utils/picker-props"


const emit = defineEmits([
    'update:modelValue',
    'pick'
])


// variables
const props = defineProps({
    selectedItems: selectedItemsProp,
    modelValue: {
        type: String,
        required: true,
        validator(value) {
            return ['image', 'video', 'audio', 'file'].includes(value)
        }
    },
    hasImagePicker: {
        type: Boolean,
        default: true
    },
    hasVideoPicker: {
        type: Boolean,
        default: true
    },
    hasAudioPicker: {
        type: Boolean,
        default: true
    },
    hasFilePicker: {
        type: Boolean,
        default: false
    }
})

const localStorageKey = 'nova-ckeditor.left-sidebar-status'
const extended = ref(localStorage.getItem(localStorageKey) !== 'false')


// methods
function toggle() {
    extended.value = !extended.value

    localStorage.setItem(localStorageKey, extended.value ? 'true' : 'false')
}

function select(item) {
    emit('update:modelValue', item)
}

function pick() {
    emit('pick')
}
</script>

<style lang="scss" scoped>
.browser-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    border-right: solid 1px rgba(var(--colors-gray-100));

    &__item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        height: 48px;
        font-size: 14px;
        color: rgba(var(--colors-gray-500));
        padding: 0 16px;
        transition: all 300ms, border-left-width 100ms;
        cursor: pointer;

        svg {
            width: 18px;
            height: 18px;
            fill: rgba(var(--colors-gray-600));
            transition: all 300ms;
        }

        & > span {
            display: none;
        }

        &:hover {
            background: rgba(var(--colors-gray-300));
            color: rgba(var(--colors-gray-700));

            svg {
                fill: rgba(var(--colors-gray-800));
            }
        }

        &.selected {
            border-left: solid 4px rgba(var(--colors-primary-500));
        }
    }

    &__toggle-sidebar {
        display: flex;
        justify-content: center;
        padding: 8px 16px;

        @media (max-width: 800px) {
            display: none;
        }

        button {
            padding: 4px 5px 4px 4px;
            border-radius: 4px;
            transition: all 300ms;

            svg {
                width: 18px;
                height: 18px;
                fill: rgba(var(--colors-gray-600));
                transform: rotate(180deg);
                transition: all 100ms;
            }

            &:hover {
                background: rgba(var(--colors-gray-100));

                svg {
                    fill: rgba(var(--colors-gray-800));
                }
            }
        }
    }

    &__pick {
        display: none;

        @media (max-width: 800px) {
            display: block;
            text-align: center;
            padding-bottom: 4px;
        }
    }

    &.is-extended {
        @media (min-width: 801px) {
            min-width: 200px;

            .browser-list__item {
                justify-content: flex-start;

                & > span {
                    display: block;
                }
            }

            .browser-list__toggle-sidebar {
                justify-content: flex-end;

                svg {
                    transform: rotate(0);
                }
            }
        }
    }
}

[dir=rtl] {
    .browser-list {
        border-right: none;
        border-left: solid 1px rgba(var(--colors-gray-100));

        &__item {
            &.selected {
                border-left: none;
                border-right: solid 4px rgba(var(--colors-primary-500));
            }
        }
    }
}
</style>

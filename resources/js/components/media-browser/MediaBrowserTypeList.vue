<template>
    <div class="browser-list" :class="{'is-extended': extended}">
        <div>
            <div
                @click="select('image')"
                class="browser-list__item"
                :class="{selected: modelValue === 'image'}"
                :title="__('Images')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>

                <span>{{ __('Images') }}</span>
            </div>

            <div
                @click="select('video')"
                class="browser-list__item"
                :class="{selected: modelValue === 'video'}"
                :title="__('Videos')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>

                <span>{{ __('Videos') }}</span>
            </div>

            <div
                @click="select('audio')"
                class="browser-list__item"
                :class="{selected: modelValue === 'audio'}"
                :title="__('Audios')"
            >
                <audio-icon />

                <span>{{ __('Audios') }}</span>
            </div>
        </div>

        <div class="browser-list__toggle-sidebar">
            <button type="button" @click.stop.prevent="toggle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-testid="KeyboardDoubleArrowLeftOutlined-icon" class="ckbox-icon ckbox-icon--base ckbox-btn__icon"><path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z"></path><path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z"></path></svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import {defineEmits, ref} from 'vue'
import AudioIcon from "../AudioIcon.vue";


const emit = defineEmits([
    'update:modelValue'
])


// variables
const props = defineProps({
    modelValue: {
        type: String,
        default: 'image'
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

    &.is-extended {
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

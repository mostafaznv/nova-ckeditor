<template>
    <div v-click-outside="close" class="upload relative">
        <div>
            <default-button type="button" class="upload__button flex align-middle gap-2" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24" data-testid="FileUploadOutlined-icon" class="ckbox-icon ckbox-icon--medium ckbox-btn__icon"><path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"></path></svg>
                <span>{{ __('Upload') }}</span>

                <div @click.stop="toggle" class="upload__button--menu">
                    <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" width="24" height="24" fill="white" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                </div>
            </default-button>
        </div>

        <transition name="fade">
            <div v-if="status" class="absolute right-0 z-10 mt-2 select-none overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 px-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <nav class="py-1">
                    <button type="button" class="hover:bg-gray-50 dark:hover:bg-gray-800 block w-full text-left cursor-pointer py-2 px-3 focus:outline-none focus:ring rounded truncate whitespace-nowrap text-gray-500 active:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600">
                        {{ __('Upload') }}
                    </button>

                    <button type="button" class="hover:bg-gray-50 dark:hover:bg-gray-800 block w-full text-left cursor-pointer py-2 px-3 focus:outline-none focus:ring rounded truncate whitespace-nowrap text-gray-500 active:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600">
                        {{ __('Upload with Cover') }}
                    </button>
                </nav>
            </div>
        </transition>
    </div>
</template>

<script setup>
import {ref} from "vue"


// variables
const status = ref(false)


// methods
function toggle() {
    status.value = !status.value
}

function close() {
    status.value = false
}
</script>

<style lang="scss" scoped>
.upload {
    &__button {
        position: relative;
        padding-right: 36px;

        & > span {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            padding-right: 16px;

            &:after {
                position: absolute;
                content: "";
                width: 1px;
                height: 100%;
                background: rgba(var(--colors-gray-300));
                top: 0;
                right: 0;
                display: block;
                opacity: 0.7;
            }
        }

        &--menu {
            position: absolute;
            height: 100%;
            width: 36px;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>

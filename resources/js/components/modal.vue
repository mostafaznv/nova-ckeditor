<template>
    <transition name="editorModal" mode="out-in">
        <div
            v-if="modelValue"
            role="dialog"
            class="modal select-none fixed pin z-50 overflow-x-hidden overflow-y-auto flex flex-col bg-gray-100 dark:bg-gray-700"
            :class="{
                'full-screen-modal w-screen h-screen top-0 left-0 w-full': fullscreen,
                'centered-modal rounded-lg shadow-lg border': !fullscreen
            }"
        >
            <div class="flex-0 flex items-center px-3 py-2 bg-white border-b border-primary-10%">
                <div v-if="title" class="flex-0 text-gray-400 pl-2">
                    <h2 class="self-center text-primary-600 text-base font-semibold">{{ title }}</h2>
                </div>

                <div class="flex-1 px-1 items-center">
                    <slot name="header"/>
                </div>

                <div class="flex-0 flex items-center" :class="{'pr-2': title}">
                    <button @click.prevent="$emit('update:modelValue',false)" class="h-5 w-5 m-0 cursor-pointer text-primary-400">
                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-testid="CloseOutlined-icon" class="ckbox-icon ckbox-icon--base ckbox-btn__icon">
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div
                class="flex-1 w-full bg-grad-sidebar modal-content"
                :style="{'overflow-y': contentNoOverflow ? 'hidden' : 'scroll'}"
            >
                <slot name="default"/>
            </div>

            <div class="flex-0 w-full bg-logo border-t border-gray-300 p-2" v-if="hasSlot('footer')">
                <slot name="footer"/>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        title: {type: String, default: null},
        modelValue: {type: Boolean, default: false},
        scrollLock: {type: Boolean, default: true},
        fullscreen: {type: Boolean, default: false},
        contentNoOverflow: {type: Boolean, default: false},
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                if (value) {
                    if (this.scrollLock) {
                        document.documentElement.classList.add('modal-open')
                    }

                    document.addEventListener('keydown', this.onKeyDownEsc)
                }
                else {
                    if (this.scrollLock) {
                        document.documentElement.classList.remove('modal-open')
                    }

                    document.removeEventListener('keydown', this.onKeyDownEsc)
                }
            }
        },
    },
    methods: {
        onKeyDownEsc(event) {
            if (event.key === "Escape") {
                this.$emit('update:modelValue', false)
            }
        },

        hasSlot(slot) {
            return !!this.$slots[slot]
        }
    }
}
</script>

<style lang="scss">
.editorModal-enter-active,
.editorModal-leave-active {
    transition: all 120ms ease-in-out !important;
}

.editorModal-enter, .editorModal-leave-to {
    opacity: 0 !important;
    transform: scale(1.1) !important;
}

html.modal-open,
html.modal-open body {
    overflow: hidden !important;
}

.modal {
    z-index: 2000;

    &.centered-modal {
        position: fixed;
        width: 80%;
        height: 70%;
        left: 10%;
        top: 15%;
    }
}
</style>

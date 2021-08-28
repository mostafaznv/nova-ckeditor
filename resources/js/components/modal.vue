<template>
    <transition name="editorModal" mode="out-in">
        <div v-if="value" role="dialog" class="media-modal fixed pin z-50 flex flex-col shadow" :class="fullscreen ? 'w-screen h-screen' :  'max-w-2x max-h-2x'">
            <div class="flex-0 flex items-center border-b bg-logo pl-2 pr-2 py-2">
                <div v-if="title" class="flex-0 text-gray-400 pl-2">
                    <h3 class="self-center text-white">{{ title }}</h3>
                </div>

                <div class="flex-1 px-1 items-center">
                    <slot name="header"></slot>
                </div>

                <div class="flex-0 flex items-center" :class="{'pr-2': title}">
                    <button @click.prevent="$emit('input',false)" class="h-8 w-8 m-0 cursor-pointer text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill="currentColor" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex-1 w-full bg-grad-sidebar" style="overflow-y: scroll">
                <slot name="default"></slot>
            </div>

            <div class="flex-0 w-full bg-logo border-t p-2" v-if="hasSlot('footer')">
                <slot name="footer"></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        title: {type: String, default: null},
        value: {type: Boolean, default: false},
        scrollLock: {type: Boolean, default: true},
        fullscreen: {type: Boolean, default: false},
    },
    watch: {
        value: {
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
                this.$emit('input', false)
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
</style>

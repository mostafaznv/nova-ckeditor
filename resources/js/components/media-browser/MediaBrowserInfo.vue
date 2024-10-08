<template>
    <div v-if="item" class="info h-full nova-ckeditor-mobile-none bg-white dark:bg-gray-800 border-l border-gray-100 dark:border-gray-600">
        <div class="flex-grow overflow-y-auto overflow-x-hidden">
            <div class="info__header mb-2">
                <strong class="text-gray-500 dark:text-gray-200" :title="item.name">{{ item.name }}</strong>

                <button @click="close" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"></path>
                    </svg>
                </button>
            </div>

            <div class="info__preview">
                <img
                    v-if="type === 'image'"
                    :src="item.link"
                    :alt="item.name"
                />

                <video
                    v-else-if="type === 'video'"
                    ref="player"
                    :src="item.link"
                    controls
                />

                <audio
                    v-else-if="type === 'audio'"
                    ref="player"
                    :src="item.link"
                    controls
                />
            </div>

            <div class="info__data">
                <div v-for="item in info" :key="item.label" class="info__data--item text-gray-500 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                    <span class="info__data--item-label text-gray-600 dark:text-gray-500">
                        {{ __(item.label) }}
                    </span>

                    <div class="info__data--item-value">
                        <template v-if="item.label === 'Dominant Color'">
                            <span @click="copyToClipboard(item.value)" class="cursor-pointer">
                                {{ item.value }}
                            </span>

                            <span
                                class="info__data--item-color"
                                :style="{backgroundColor: item.value}"
                            />
                        </template>

                        <span v-else>{{ item.value }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useLocalization} from 'laravel-nova'
import {useClipboard} from "../../composables/useClipboard"
import {selectedItemsProp, typeProp} from "../../utils/picker-props"


// emits
const emit = defineEmits([
    'update:modelValue'
])


// exposes
defineExpose({
    play
})


// composables
const {__} = useLocalization()
const {copyToClipboard} = useClipboard()


// variables
const props = defineProps({
    selectedItems: selectedItemsProp,
    type: typeProp,
    modelValue: {
        type: Boolean,
        default: false
    }
})

const player = ref(null)


// computed properties
const item = computed(() => {
    return props.selectedItems.length === 1
        ? props.selectedItems[0]
        : null
})

const info = computed(() => {
    const info = []

    if (item.value.created_at) {
        info.push({
            label: 'Upload Date',
            value: (new Date(item.value.created_at)).toLocaleDateString()
        })
    }

    if (item.value.updated_at) {
        info.push({
            label: 'Modification Date',
            value: (new Date(item.value.updated_at)).toLocaleDateString()
        })
    }

    if (item.value.file?.meta) {
        info.push({
            label: 'Size',
            value: formatFileSize(item.value.file.meta.size)
        })

        info.push({
            label: 'Format',
            value: item.value.file.meta.format
        })

        if (props.type === 'image' || props.type === 'video') {
            info.push({
                label: 'Width',
                value: item.value.file.meta.width
            })

            info.push({
                label: 'Height',
                value: item.value.file.meta.height
            })

            info.push({
                label: 'Dominant Color',
                value: item.value.file.meta.dominant_color
            })
        }

        if (props.type === 'video' || props.type === 'audio') {
            info.push({
                label: 'Duration',
                value: secondsToHms(item.value.file.meta.duration)
            })
        }
    }
    else {
        if (item.value.size_original) {
            info.push({
                label: 'Size',
                value: formatFileSize(item.value.size_original)
            })
        }

        if (item.value.width) {
            info.push({
                label: 'Width',
                value: item.value.width
            })
        }

        if (item.value.height) {
            info.push({
                label: 'Height',
                value: item.value.height
            })
        }

        if (item.value.mime) {
            info.push({
                label: 'MimeType',
                value: item.value.mime
            })
        }
    }

    return info
})



// methods
function open() {
    emit('update:modelValue', true)
}

function close() {
    emit('update:modelValue', false)
}

function play() {
    player.value?.play()
}

function formatFileSize(bytes) {
    bytes = parseInt(bytes)

    if (bytes === 0) {
        return __('Zero')
    }

    const sizes = [
        __('Bytes'),
        __('KB'),
        __('MB'),
        __('GB'),
        __('TB')
    ];

    const i = Math.floor(Math.log(bytes) / Math.log(1024))

    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

function secondsToHms(seconds) {
    seconds = parseInt(seconds)

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    const hoursString = h.toString().padStart(2, '0') + ':'
    const minutesString = m.toString().padStart(2, '0') + ':'
    const secondsString = s.toString().padStart(2, '0')

    return hoursString + minutesString + secondsString;
}
</script>

<style lang="scss" scoped>
.info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 320px;
    padding: 8px 8px 0;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        strong {
            font-size: 18px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 10px;
        }

        button {
            padding: 4px;
            border-radius: 4px;
            transition: all 300ms;

            svg {
                width: 24px;
                height: 24px;
                fill: rgba(var(--colors-gray-600));
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

    &__data {
        display: flex;
        flex-direction: column;
        margin-top: 16px;
        padding-bottom: 14px;

        &--item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            height: 36px;

            &-label {
                font-weight: bold;
            }

            &-value {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }

            &-color {
                display: inline-block;
                width: 16px;
                height: 16px;
                border-radius: 6px;
            }

            &:last-of-type {
                border-bottom: none;
            }
        }
    }
}

[dir=rtl] {
    .info {
        &__header {
            button {
                svg {
                    transform: rotate(180deg);
                }
            }
        }
    }
}
</style>

<template>
    <div v-if="item" class="info h-full">
        <div class="flex-grow overflow-y-auto overflow-x-hidden">
            <div class="info__header mb-2">
                <strong>{{ item.name }}</strong>

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
                    :src="item.link"
                    controls
                />

                <audio
                    v-else-if="type === 'audio'"
                    :src="item.link"
                    controls
                />
            </div>

            <div class="info__data">
                <div v-for="item in info" :key="item.label" class="info__data--item">
                    <span class="info__data--item-label">{{ __(item.label) }}</span>

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
import {computed, defineEmits} from 'vue'
import {useLocalization} from 'laravel-nova'
import {useClipboard} from "../../composables/useClipboard"
import {selectedItemsProp, typeProp} from "../../utils/picker-props"


// emits
const emit = defineEmits([
    'update:modelValue'
])


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
    background: #fff;
    border-left: solid 1px rgba(var(--colors-gray-100));

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        strong {
            font-size: 18px;
            font-weight: 600;
            color: rgba(var(--colors-gray-500));
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

        &--item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            color: rgba(var(--colors-gray-500));
            border-bottom: solid 1px rgba(var(--colors-gray-100));
            height: 36px;

            &-label {
                font-weight: bold;
                color: rgba(var(--colors-gray-600));
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
</style>

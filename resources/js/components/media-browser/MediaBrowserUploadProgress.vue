<template>
    <div class="upload" :class="item.percent === 100 ? 'uploaded' : 'uploading'">
        <div class="flex items-center justify-between">
            <span class="upload__name">{{ item.name }}</span>

            <div class="flex items-center gap-2">
                <span class="upload__size">
                    {{ bytesToKiloBytes(item.loaded) }} {{ __('KB') }} {{ __('of') }} {{ bytesToKiloBytes(item.total) }} {{ __('KB') }}
                </span>

                <span class="upload__percent">{{ item.percent }}%</span>
            </div>
        </div>

        <div class="upload__progress">
            <span :style="{width: `${item.percent}%`}" />
        </div>
    </div>
</template>

<script setup>
import {defineProps} from "vue"


// variables
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})


// methods
function bytesToKiloBytes(bytes) {
    return Math.round(bytes / 1024)
}
</script>

<style lang="scss" scoped>
.upload {
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    background: rgba(var(--colors-gray-200));
    color: rgba(var(--colors-gray-700));

    &__percent {
        font-weight: bold;
        color: rgba(var(--colors-gray-800));
    }

    &__progress {
        height: 4px;
        background: rgba(var(--colors-gray-300));
        border-radius: 2px;
        margin-top: 10px;

        span {
            height: 100%;
            display: block;
            background: rgba(var(--colors-primary-700));
            border-radius: 2px;
            transition: all 300ms;
        }
    }

    &.uploaded {
        .upload__progress {
            span {
                background: rgba(var(--colors-teal-500));
            }
        }
    }
}
</style>

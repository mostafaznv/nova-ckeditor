<template>
    <div :class="{'opacity-75': disabled}">
        <input
            class="visually-hidden"
            @change.stop.prevent="handleChange"
            type="file"
            ref="fileInput"
            :multiple="multiple"
            :accept="acceptedTypes"
            :disabled="disabled"
        />

        <div class="space-y-4">
            <label @click.stop.prevent="handleClick" class="block cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-900 border-4 border-dashed hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded-lg">
                <div class="flex items-center space-x-4 pointer-events-none">
                    <p class="text-center pointer-events-none">
                        <default-button type="button">
                            {{ multiple ? __('Choose Files') : __('Choose File') }}
                        </default-button>
                    </p>

                    <p class="pointer-events-none text-center text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        {{ fileName ?? label ?? __('Click to choose') }}
                    </p>
                </div>
            </label>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'


// exposes
defineExpose({
    reset
})


// emits
const emit = defineEmits([
    'fileChanged', 'fileRemoved'
])


// variables
const props = defineProps({
    label: {
        type: String,
        default: undefined
    },
    multiple: {
        type: Boolean,
        default: false
    },
    acceptedTypes: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const fileInput = ref()
const demFiles = ref([])
const fileName = ref(undefined)


// methods
function handleClick() {
    fileInput.value.click()
}

function handleChange() {
    demFiles.value = props.multiple
        ? fileInput.value.files
        : [fileInput.value.files[0]]

    emit('fileChanged', demFiles.value)

    fileName.value = demFiles.value[0]?.name ?? undefined
    fileInput.value.files = null
}

function reset() {
    if (fileInput.value) {
        fileInput.value.value = null
    }
}
</script>

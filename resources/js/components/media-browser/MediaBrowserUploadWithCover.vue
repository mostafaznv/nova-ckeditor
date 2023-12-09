<template>
    <div>
        <file-input
            @file-changed="onOriginalChange"
            :label="__('Original File')"
            :accepted-types="acceptedTypes"
            :disabled="uploading"
        />

        <file-input
            @file-changed="onCoverChange"
            class="mt-3"
            :label="__('Cover')"
            accepted-types="image/*"
            :disabled="original === null || uploading"
        />
    </div>
</template>

<script setup>
import {ref, watch, computed, defineEmits, defineExpose} from "vue"
import {useLocalization} from 'laravel-nova'
import FileInput from "../FileInput.vue"
import axios from "axios"


// exposes
defineExpose({
    upload
})


// emits
const emit = defineEmits([
    'update:modelValue',
    'completed',
])


// composables
const {__} = useLocalization()


// variables
const props = defineProps({
    uploadApiUrl: {
        type: String,
        required: true
    },
    acceptedTypes: {
        type: String,
        required: true
    }
})

const original = ref(null)
const cover = ref(null)
const uploading = ref(false)
const percent = ref(0)


// computed properties
const file = computed(() => {
    return {
        isValid: !!original.value && !!cover.value,
        original: original.value,
        cover: cover.value,
        uploading: uploading.value,
        percent: percent.value
    }
})


// watchers
watch(
    () => file.value,
    (file) => {
        emit('update:modelValue', file)
    },
    {immediate: true}
)


// methods
function onOriginalChange(files) {
    original.value = files[0] ?? null
}

function onCoverChange(files) {
    cover.value = files[0] ?? null
}

async function upload() {
    if (uploading.value || !file.value.isValid) {
        return
    }

    uploading.value = true
    percent.value = 0

    let result = false
    const data = new FormData()

    data.append('name', file.value.original.name.split('.').slice(0, -1).join('.'))
    data.append('file[original]', file.value.original)
    data.append('file[cover]', file.value.cover)

    try {
        await axios.post(
            props.uploadApiUrl, data,
            {
                onUploadProgress: (e) => {
                    percent.value = Math.round((e.loaded * 100) / e.total)
                }
            }
        )

        Nova.success(__('Uploading process has been completed.'))
        result = true
    }
    catch (e) {
        Nova.error(
            e?.message ?? __(`Something went wrong while uploading the file[${file.value.original.name}].`)
        )
    }

    uploading.value = false

    return result
}
</script>
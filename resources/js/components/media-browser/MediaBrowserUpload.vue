<template>
    <div v-on-click-outside="close" class="upload relative">
        <div>
            <default-button @click.stop="pick" type="button" class="upload__button flex align-middle gap-2" size="sm" :class="{'with-menu': hasLaruploadTrait}">
                <Icon type="upload" width="20" height="20" />
                <span>{{ __('Upload') }}</span>

                <div v-if="hasLaruploadTrait" @click.stop="toggle" class="upload__button--menu">
                    <Icon type="chevron-down" class="-mr-1" width="18" height="18" />
                </div>
            </default-button>


            <input
                ref="input"
                @change="onSelectFiles"
                type="file"
                :accept="acceptedMimeTypes"
                multiple
            />
        </div>

        <transition name="fade">
            <div v-if="status" class="absolute right-0 z-10 mt-2 select-none overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 px-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <nav class="py-1">
                    <button @click.stop="pick" type="button" class="hover:bg-gray-50 dark:hover:bg-gray-800 block w-full text-left cursor-pointer py-2 px-3 focus:outline-none focus:ring rounded truncate whitespace-nowrap text-gray-500 active:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600">
                        {{ __('Upload') }}
                    </button>

                    <button @click.stop="openModal(true)" type="button" class="hover:bg-gray-50 dark:hover:bg-gray-800 block w-full text-left cursor-pointer py-2 px-3 focus:outline-none focus:ring rounded truncate whitespace-nowrap text-gray-500 active:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 dark:active:text-gray-600">
                        {{ __('Upload with Cover') }}
                    </button>
                </nav>
            </div>
        </transition>
    </div>

    <modal v-model="modalStatus" class="upload-modal" :class="{'large': hasLaruploadTrait}">
        <template #header>
            <div v-if="uploading" class="flex items-center gap-1">
                <span>{{ progress.percent }}%</span>
            </div>
        </template>

        <div class="p-3">
            <media-browser-upload-with-cover
                v-if="uploadWithCover"
                v-model="fileWithCover"
                ref="fileWithCoverRef"
                :upload-api-url="uploadApiUrl"
                :accepted-types="acceptedMimeTypes"
            />

            <template v-else>
                <media-browser-upload-progress
                    v-for="(item, index) in progress.items"
                    :item="item"
                    :key="`${counter}-${index}`"
                />
            </template>
        </div>

        <template v-if="hasLaruploadTrait" #footer>
            <default-button
                @click.stop="handleUploadWithCover"
                type="button"
                class="upload__button flex align-middle gap-2"
                size="sm"
                :class="{'opacity-50 disabled:cursor-not-allowed': uploadWithCoverIsDisabled}"
                :disabled="uploadWithCoverIsDisabled"
            >
                <span>{{ __('Upload') }}</span>
            </default-button>
        </template>
    </modal>
</template>

<script setup>
import {ref, computed, watch} from "vue"
import Modal from "../modal.vue"
import axios from "axios"
import {useLocalization} from 'laravel-nova'
import MediaBrowserUploadProgress from "./MediaBrowserUploadProgress.vue"
import MediaBrowserUploadWithCover from "./MediaBrowserUploadWithCover.vue"
import {hasLaruploadTraitProp, novaVideoIsLegacyProp, typeProp} from "../../utils/picker-props"
import {vOnClickOutside} from "@vueuse/components"


// emits
const emit = defineEmits([
    'uploaded',
])


// composables
const {__} = useLocalization()


// variables
const props = defineProps({
    hasLaruploadTrait: hasLaruploadTraitProp,
    novaVideoIsLegacy: novaVideoIsLegacyProp,
    type: typeProp
})

const status = ref(false)
const modalStatus = ref(false)
const uploadWithCover = ref(false)
const input = ref(null)
const counter = ref(0)
const uploading = ref(false)
const cover = ref(null)
const fileWithCoverRef = ref(null)
const fileWithCover = ref({
    isValid: false,
    original: null,
    cover: null,
    uploading: false,
    percent: 0
})

const progress = ref({
    loaded: 0,
    total: 0,
    percent: 0,
    items: []
})


// computed properties
const acceptedMimeTypes = computed(() => {
    if (props.type === 'image') {
        return 'image/*'
    }
    if (props.type === 'video') {
        return 'video/*'
    }

    return 'audio/*'
})

const resourceKey = computed(() => {
    if (props.type === 'image') {
        return 'images'
    }
    else if (props.type === 'video') {
        return 'videos'
    }

    return 'audio'
})

const uploadFileKey = computed(() => {
    if (props.type === 'video' && props.hasLaruploadTrait && props.novaVideoIsLegacy) {
        return 'file_field'
    }

    return props.hasLaruploadTrait ? 'file[original]' : 'file'
})

const uploadApiUrl = computed(() => {
    return `/nova-api/${resourceKey.value}`
})

const uploadWithCoverIsDisabled = computed(() => {
    if (props.type === 'video' && props.hasLaruploadTrait && props.novaVideoIsLegacy) {
        return true
    }

    return !props.hasLaruploadTrait || !fileWithCover.value.isValid || uploading.value
})


// watch
watch(
    () => fileWithCover.value,
    (file) => {
        uploading.value = file.uploading
        progress.value.percent = file.percent
    }
)


// methods
function toggle() {
    status.value = !status.value
}

function close() {
    status.value = false
}

function openModal(withCover = false) {
    uploadWithCover.value = withCover && props.hasLaruploadTrait
    modalStatus.value = true
}

function closeModal() {
    uploadWithCover.value = false
    modalStatus.value = false
}

function pick() {
    if (!uploading.value) {
        input.value?.click()
    }
}

async function onSelectFiles(e) {
    if (uploading.value) {
        return
    }

    uploading.value = true
    modalStatus.value = true
    uploadWithCover.value = false
    counter.value += 1

    let uploadCount = 0

    if (e.target?.files?.length) {
        const files = Array.from(e.target.files)

        prepareFiles(files)

        for (let i = 0; i < files.length; i++) {
            const res = await upload(files[i], i)

            if (res) {
                uploadCount += 1
            }
        }
    }

    uploading.value = false
    modalStatus.value = false

    if (uploadCount > 0) {
        Nova.success(__(':count file(s) uploaded successfully.', {count: uploadCount}))

        emit('uploaded')
    }
}

async function upload(file, index) {
    const data = new FormData()

    data.append('name', file.name.split('.').slice(0, -1).join('.'))
    data.append(uploadFileKey.value, file)

    try {
        await axios.post(
            uploadApiUrl.value, data,
            {
                onUploadProgress: (e) => {
                    calculateItemUploadedPercent(e, index)
                    calculateTotalUploadedPercent()
                }
            }
        )

        return true
    }
    catch (e) {
        Nova.error(
            e?.message ?? __(`Something went wrong while uploading the file[${file.name}].`)
        )

        return false
    }
}

async function handleUploadWithCover() {
    if (!uploadWithCoverIsDisabled.value) {
        const res = await fileWithCoverRef.value?.upload()

        if (res) {
            emit('uploaded')
        }

        closeModal()
    }
}

function prepareFiles(files) {
    progress.value = {
        loaded: 0,
        total: 0,
        percent: 0,
        items: []
    }

    files.forEach((file) => {
        progress.value.total += file.size

        progress.value.items.push({
            name: file.name,
            loaded: 0,
            total: file.size,
            percent: 0
        })
    })
}

function calculateTotalUploadedPercent() {
    progress.value.loaded = progress.value.items.reduce((acc, item) => {
        return acc + item.loaded
    }, 0)


    if (progress.value.loaded >= progress.value.total) {
        progress.value.percent = 100

        return
    }

    progress.value.percent = Math.round(
        (progress.value.loaded / progress.value.total) * 100
    )
}

function calculateItemUploadedPercent(progressEvent, index) {
    progress.value.items[index].loaded = progressEvent.loaded

    if (progress.value.items[index].loaded >= progress.value.items[index].total) {
        progress.value.items[index].percent = 100

        return
    }

    progress.value.items[index].percent = Math.round(
        (progress.value.items[index].loaded / progress.value.items[index].total) * 100
    )
}
</script>

<style lang="scss" scoped>
.upload {
    &__button {
        position: relative;

        & > span {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            padding-right: 8px;
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

        &.with-menu {
            padding-right: 36px;

            & > span {
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
        }
    }

    input {
        display: none;
    }
}

::v-deep(.upload-modal) {
    max-width: 600px;
    height: 400px !important;
    top: calc(50% - 200px) !important;
    left: calc(50% - 300px) !important;
    overflow: hidden;

    &.large {
        height: 500px !important;
        top: calc(50% - 250px) !important;
    }

    .modal-content {
        overflow-y: auto !important;
    }
}
</style>

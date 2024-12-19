<template>
    <div class="navbar bg-white dark:bg-gray-800">
        <div class="inline-flex items-center gap-1 nova-ckeditor-mobile-none">
            <button
                @click.stop="download"
                type="button"
                class="media-browser-btn"
                :disabled="!itemSelected"
            >
                <Icon name="arrow-down-tray"/>
                <span>{{ __('Download') }}</span>
            </button>

            <media-browser-delete
                @deleted="$emit('deleted')"
                :selected-items="selectedItems"
                :type="type"
            />

            <media-browser-rename-modal
                @update:model-value="$emit('updated')"
                :selected-items="selectedItems"
                :type="type"
                :disabled="!itemSelected"
            />

            <button @click.stop="copyUrl" type="button" class="media-browser-btn" :disabled="!itemSelected">
                <Icon name="clipboard"/>
                <span>{{ __('Copy URL') }}</span>
            </button>
        </div>

        <div class="inline-flex items-center gap-4">
            <button
                @click.stop="toggleInfoSidebar"
                type="button"
                class="media-browser-btn nova-ckeditor-mobile-none"
                :title="__('Properties')"
                :disabled="!itemSelected"
            >
                <Icon name="information-circle"/>
            </button>

            <media-browser-search-modal
                @update:model-value="$emit('update:keyword', $event)"
                :model-value="keyword"
                class="nova-ckeditor-mobile-none"
            />

            <media-browser-display-options
                v-model:order-by="orderBy"
                v-model:order-by-direction="orderByDirection"
                v-model:size="size"
                v-model:keep-aspect-ratio="keepAspectRatio"
                :type="type"
                :columns="columns"
                class="nova-ckeditor-mobile-none"
            />

            <media-browser-upload
                @uploaded="$emit('updated')"
                :type="type"
                :has-larupload-trait="hasLaruploadTrait"
            />
        </div>
    </div>
</template>

<script setup>
import {ref, computed, watch} from "vue"
import MediaBrowserUpload from "./MediaBrowserUpload.vue"
import {useClipboard} from "../../composables/useClipboard"
import {Icon} from 'laravel-nova-ui'
import MediaBrowserDisplayOptions from "./MediaBrowserDisplayOptions.vue"
import MediaBrowserSearchModal from "./MediaBrowserSearchModal.vue"
import MediaBrowserDelete from "./MediaBrowserDelete.vue"
import MediaBrowserRenameModal from "./MediaBrowserRenameModal.vue"
import {hasLaruploadTraitProp, selectedItemsProp, typeProp, keywordProp, sortProp, paginationProp, columnsProp} from "../../utils/picker-props"


// composables
const {copyToClipboard} = useClipboard()


// emits
const emit = defineEmits([
    'update:displayOptions',
    'update:keyword',
    'update:showInfoSidebar',
    'updated',
    'deleted',
])


// variables
const props = defineProps({
    hasLaruploadTrait: hasLaruploadTraitProp,
    selectedItems: selectedItemsProp,
    type: typeProp,
    keyword: keywordProp,
    sort: sortProp,
    pagination: paginationProp,
    columns: columnsProp,
    showInfoSidebar: {
        type: Boolean,
        default: false
    },
    displayOptions: {
        type: Object,
        default: () => ({
            orderBy: 'id',
            orderByDirection: 'desc',
            size: 180,
            keepAspectRatio: false
        })
    }
})

const orderBy = ref('id')
const orderByDirection = ref('desc')
const keepAspectRatio = ref(false)
const size = ref(180)


// computed properties
const itemSelected = computed(() => {
    return props.selectedItems.length === 1
})

const displayOptionsComputed = computed(() => {
    return {
        orderBy: orderBy.value,
        orderByDirection: orderByDirection.value,
        size: size.value,
        keepAspectRatio: keepAspectRatio.value
    }
})


// watchers
watch(
    () => props.displayOptions,
    (value, oldValue) => {
        if (value.orderBy === 'id' && value.orderBy === oldValue.orderBy) {
            orderBy.value = value.orderBy
        }
    },
    {deep: true}
)


watch(
    () => displayOptionsComputed.value,
    () => {
        emit('update:displayOptions', displayOptionsComputed.value)
    },
    {deep: true, immediate: true}
)

watch(
    () => itemSelected.value,
    (status) => {
        if (!status) {
            emit('update:showInfoSidebar', false)
        }
    },
)


// methods
function download() {
    if (itemSelected.value) {
        const item = props.selectedItems[0]
        const name = item.name + '.' + item.link.split('.').pop()
        const link = document.createElement('a')

        link.download = name
        link.href = item.link

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

function copyUrl() {
    if (itemSelected.value) {
        copyToClipboard(props.selectedItems[0].link)
    }
}

function toggleInfoSidebar() {
    emit('update:showInfoSidebar', !props.showInfoSidebar)
}

function init() {
    const gallerySize = localStorage.getItem('nova-ckeditor.gallery-size')
    const aspectRatio = localStorage.getItem('nova-ckeditor.keep-gallery-aspect-ratio')

    if (gallerySize) {
        size.value = parseInt(gallerySize)
    }

    if (aspectRatio) {
        keepAspectRatio.value = aspectRatio === 'true'
    }
}

init()
</script>

<style lang="scss" scoped>
.navbar {
    position: relative;
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: 0 0 6px rgba(46, 49, 56, 0.05);

    @media (max-width: 768px) {
        justify-content: flex-end;
    }
}
</style>

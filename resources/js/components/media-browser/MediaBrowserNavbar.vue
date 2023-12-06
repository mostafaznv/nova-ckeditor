<template>
    <div class="navbar">
        <div class="inline-flex items-center gap-4">
            <transition name="fade">
                <div>
                    <button
                        @click.stop="download"
                        type="button"
                        class="navbar__button"
                        :disabled="!itemSelected"
                    >
                        <Icon type="download" />
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

                    <button @click.stop="copyUrl" type="button" class="navbar__button" :disabled="!itemSelected">
                        <Icon type="clipboard" />
                        <span>{{ __('Copy URL') }}</span>
                    </button>
                </div>
            </transition>
        </div>

        <div class="inline-flex items-center gap-4">
            <button
                @click.stop="toggleInfoSidebar"
                type="button"
                class="navbar__button"
                :title="__('Properties')"
                :disabled="!itemSelected"
            >
                <Icon type="information-circle" />
            </button>

            <media-browser-search-modal
                @update:model-value="$emit('update:keyword', $event)"
            />

            <media-browser-display-options
                v-model:order-by="orderBy"
                v-model:order-by-direction="orderByDirection"
                v-model:size="size"
                v-model:keep-aspect-ratio="keepAspectRatio"
            />

            <media-browser-upload />
        </div>
    </div>
</template>

<script setup>
import {ref, computed, defineEmits, watch} from "vue"
import MediaBrowserUpload from "./MediaBrowserUpload.vue"
import {useClipboard} from "../../composables/useClipboard"
import MediaBrowserDisplayOptions from "./MediaBrowserDisplayOptions.vue";
import MediaBrowserSearchModal from "./MediaBrowserSearchModal.vue";
import MediaBrowserDelete from "./MediaBrowserDelete.vue";
import MediaBrowserRenameModal from "./MediaBrowserRenameModal.vue";


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
    selectedItems: {
        type: Array,
        default: () => []
    },
    keyword: {
        type: String,
        default: ''
    },
    showInfoSidebar: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['image', 'video', 'audio'].includes(value)
        }
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

const multipleItemsSelected = computed(() => {
    return props.selectedItems.length > 1
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
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: 0 0 6px rgba(46, 49, 56, 0.05);

    &__button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 300ms;
        cursor: pointer;

        svg {
            color: rgba(var(--colors-primary-600));
            width: 20px;
        }

        &:hover:not(:disabled) {
            background: rgba(var(--colors-gray-100));
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
}
</style>

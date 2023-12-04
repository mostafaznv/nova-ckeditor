<template>
    <modal v-model="modalStatus" class="media-browser" :title="__(title)" :content-no-overflow="true">
        <template #header>
            <span>{{ __('Media Browser') }}</span>
        </template>


        <div class="flex h-full">
            <media-browser-type-list v-model="type" />

            <div class="relative flex-grow flex flex-col justify-between">
                <media-browser-navbar
                    v-model:keyword="keyword"
                    v-model:display-options="displayOptions"
                    v-model:show-info-sidebar="withInfo"
                    :selected-items="selectedItems"
                />

                <div class="media-browser__list p-4">
                    <div v-if="keyword" class="text-gray-700 mb-3">
                        {{ __('Search results for') }} <b>{{ keyword }}:</b>
                    </div>

                    <div class="media-browser__list--main" :style="`--nova-ckeditor-gallery-size:${gallerySize}`">
                        <media-browser-list
                            v-if="type === 'image'"
                            ref="browserList"
                            v-model:pagination="pagination"
                            v-model:loading="loading"
                            v-model:selected-items="selectedItems"
                            type="image"
                            :page="page"
                            :has-larupload-trait="true"
                            :gallery-size="displayOptions?.size ?? 180"
                            :keep-aspect-ratio="displayOptions?.keepAspectRatio ?? false"
                            :order-by="displayOptions?.orderBy ?? 'id'"
                            :sort="displayOptions?.orderByDirection ?? 'desc'"
                            :keyword="keyword"
                        />

                        <media-browser-list
                            v-else-if="type === 'video'"
                            ref="browserList"
                            v-model:pagination="pagination"
                            v-model:loading="loading"
                            v-model:selected-items="selectedItems"
                            type="video"
                            :page="page"
                            :has-larupload-trait="true"
                            :gallery-size="displayOptions?.size ?? 180"
                            :keep-aspect-ratio="displayOptions?.keepAspectRatio ?? false"
                            :order-by="displayOptions?.orderBy ?? 'id'"
                            :sort="displayOptions?.orderByDirection ?? 'desc'"
                            :keyword="keyword"
                        />

                        <media-browser-list
                            v-else-if="type === 'audio'"
                            ref="browserList"
                            v-model:pagination="pagination"
                            v-model:loading="loading"
                            v-model:selected-items="selectedItems"
                            type="audio"
                            :page="page"
                            :has-larupload-trait="true"
                            :gallery-size="displayOptions?.size ?? 180"
                            :keep-aspect-ratio="displayOptions?.keepAspectRatio ?? false"
                            :order-by="displayOptions?.orderBy ?? 'id'"
                            :sort="displayOptions?.orderByDirection ?? 'desc'"
                            :keyword="keyword"
                        />
                    </div>
                </div>

                <media-browser-pagination
                    v-model="page"
                    :total="pagination.totalPages"
                    :loading="loading"
                />
            </div>

            <media-browser-info
                v-if="withInfo"
                v-model="withInfo"
                @updated="refresh"
                :selected-items="selectedItems"
                :type="type"
            />
        </div>
    </modal>

    <transition name="fade">
        <div v-if="modalStatus" class="overlay" />
    </transition>
</template>

<script setup>
import {computed, ref, watch} from "vue"
import modal from "../modal"
import MediaBrowserTypeList from "./MediaBrowserTypeList.vue"
import MediaBrowserInfo from "./MediaBrowserInfo.vue"
import MediaBrowserList from "./MediaBrowserList.vue"
import MediaBrowserPagination from "./MediaBrowserPagination.vue"
import MediaBrowserNavbar from "./MediaBrowserNavbar.vue";


// variables
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    fieldKey: {
        type: String,
        default: 'content'
    }
})

const type = ref('image')
const modalStatus = ref(false)
const browserList = ref(false)
const loading = ref(false)
const withInfo = ref(false)
const keyword = ref('')
const displayOptions = ref({})
const page = ref(1)
const selectedItems = ref([])
const pagination = ref({
    total: null,
    totalPages: 1,
    perPage: null,
    perPageOptions: [],
    hasNextPage: false,
    hasPrevPage: false
})



// computed properties
const event = computed(() => {
    return `ckeditor:media:${props.fieldKey}`
})

const gallerySize = computed(() => {
    const size = displayOptions.value?.size ?? 180

    return size + 'px'
})


// watchers
watch(() => type.value, reset)

watch(
    () => displayOptions.value,
    (value, oldValue) => {
        if (value.orderBy !== oldValue.orderBy || value.orderByDirection !== oldValue.orderByDirection) {
            reset()
        }
    },
    {deep: true}
)


// methods
function init() {
    Nova.$on(event.value, openModal)
    Nova.$on('ckeditor:focused', closeModal)
}

function openModal() {
    modalStatus.value = true
}

function closeModal() {
    modalStatus.value = false
}

function reset() {
    selectedItems.value = []
    page.value = 1
    pagination.value = {
        total: null,
        totalPages: 1,
        perPage: null,
        perPageOptions: [],
        hasNextPage: false,
        hasPrevPage: false
    }
}

function refresh() {
    browserList.value?.fetch(page.value)
}

init()
</script>

<style lang="scss" scoped>
.media-browser {
    z-index: 99999999;

    &__list {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 48px);

        &--main {
            display: grid;
            grid-gap: 14px;
            grid-template-columns: repeat(auto-fill, minmax(v-bind(gallerySize), 1fr));
            -webkit-user-select: none;
            user-select: none;
            outline: none;
        }
    }
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    margin: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

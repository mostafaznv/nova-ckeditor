<template>
    <modal v-model="modalStatus" class="media-browser" :title="__(title)" :content-no-overflow="true">
        <template #header>
            <span>{{ __('Media Browser') }}</span>
        </template>


        <div class="flex h-full">
            <media-browser-type-list
                v-model="type"
                @pick="pickItems"
                :selected-items="selectedItems"
            />

            <div class="relative flex-grow flex flex-col justify-between">
                <media-browser-navbar
                    v-model:keyword="keyword"
                    v-model:display-options="displayOptions"
                    v-model:show-info-sidebar="withInfo"
                    @deleted="refresh"
                    @updated="refresh"
                    :selected-items="selectedItems"
                    :type="type"
                    :has-larupload-trait="hasLaruploadTrait"
                />

                <div class="media-browser__list p-4">
                    <div v-if="keyword" class="text-gray-700 mb-3">
                        {{ __('Search results for') }} <b>{{ keyword }}:</b>
                    </div>

                    <div class="media-browser__list--main" :style="`--nova-ckeditor-gallery-size:${gallerySize}`">
                        <media-browser-list
                            v-if="type === 'image'"
                            ref="browserList"
                            @pick="pickItems"
                            @play="play"
                            v-model:pagination="pagination"
                            v-model:loading="loading"
                            v-model:selected-items="selectedItems"
                            v-bind="listComponentProps"
                            type="image"
                        />

                        <media-browser-list
                            v-else-if="type === 'video'"
                            ref="browserList"
                            @pick="pickItems"
                            @play="play"
                            v-model:pagination="pagination"
                            v-model:loading="loading"
                            v-model:selected-items="selectedItems"
                            v-bind="listComponentProps"
                            type="video"
                        />

                        <media-browser-list
                            v-else-if="type === 'audio'"
                            ref="browserList"
                            @pick="pickItems"
                            @play="play"
                            v-model:pagination="pagination"
                            v-model:loading="loading"
                            v-model:selected-items="selectedItems"
                            v-bind="listComponentProps"
                            type="audio"
                        />
                    </div>
                </div>

                <media-browser-pagination
                    v-model="page"
                    @pick="pickItems"
                    :total="pagination.totalPages"
                    :selected-items="selectedItems"
                    :loading="loading"
                />
            </div>

            <media-browser-info
                v-if="withInfo"
                v-model="withInfo"
                ref="info"
                :selected-items="selectedItems"
                :type="type"
            />
        </div>
    </modal>
</template>

<script setup>
import {computed, nextTick, ref, watch} from "vue"
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
        default: ''
    },
    imageHasLaruploadTrait: {
        type: Boolean,
        default: false
    },
    videoHasLaruploadTrait: {
        type: Boolean,
        default: false
    },
    fieldKey: {
        type: String,
        default: 'content'
    }
})

const type = ref('image')
const info = ref(null)
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

const hasLaruploadTrait = computed(() => {
    if (type.value === 'image') {
        return props.imageHasLaruploadTrait
    }
    else if (type.value === 'video') {
        return props.videoHasLaruploadTrait
    }

    return false
})

const listComponentProps = computed(() => {
    return {
        page: page.value,
        gallerySize: displayOptions.value?.size ?? 180,
        keepAspectRatio: displayOptions.value?.keepAspectRatio ?? false,
        orderBy: displayOptions.value?.orderBy ?? 'id',
        sort: displayOptions.value?.orderByDirection ?? 'desc',
        keyword: keyword.value,
        hasLaruploadTrait: hasLaruploadTrait.value
    }
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

function play() {
    withInfo.value = true

    nextTick(() => {
        info.value?.play()
    })
}

function pickItems(item = null) {
    let items = item ? [item] : selectedItems.value

    if (items.length) {
        items = items.map(item => {
            return {
                type: type.value,
                src: item.link,
                cover: item.file?.cover ?? null,
                name: item.name ?? (item.file?.meta?.name ?? null),
            }
        })

        Nova.$emit(`${event.value}:write`, items)

        selectedItems.value = []
        closeModal()
    }
}

init()
</script>

<style lang="scss" scoped>
.media-browser {
    z-index: 9999;

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

            @media (max-width: 800px) {
                grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
            }
        }
    }
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

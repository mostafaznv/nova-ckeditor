<template>
    <modal v-model="isVisible" ref="modal" class="image-browser-modal" :title="__(isImagePicker ? 'Image Picker' : 'Video Picker')" fullscreen scroll-lock>
        <template #header>
            <div class="pl-6 flex -mx-2">
                <div class="p-2">
                    <input
                        v-model="searchTerm"
                        type="search"
                        class="form-control form-input form-input-bordered"
                        @keydown.enter.prevent="fetch(1)"
                        :placeholder="__(isImagePicker ? 'Search Image ...' : 'Search Video ...')"
                    />
                </div>

                <div class="p-2">
                    <div class="flex relative">
                        <select v-model="orderBy" @change="fetch(1)" class="form-control form-select form-select-bordered">
                            <optgroup :label="__('Order By')">
                                <template v-if="isImagePicker">
                                    <option value="id">{{ __('ID') }}</option>
                                    <option value="name">{{ __('Name') }}</option>
                                    <option value="width">{{ __('Width') }}</option>
                                    <option value="height">{{ __('Height') }}</option>
                                    <option value="size">{{ __('Size') }}</option>
                                </template>

                                <template v-else>
                                    <option value="id">{{ __('ID') }}</option>
                                    <option value="name">{{ __('Name') }}</option>

                                    <template v-if="hasLaruploadTrait">
                                        <option value="file_file_size">{{ __('Size') }}</option>
                                        <option value="file_file_width">{{ __('Width') }}</option>
                                        <option value="file_file_height">{{ __('Height') }}</option>
                                        <option value="file_file_duration">{{ __('Duration') }}</option>
                                    </template>
                                </template>
                            </optgroup>
                        </select>

                        <svg class="flex-shrink-0 pointer-events-none form-select-arrow" xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6">
                            <path class="fill-current" d="M8.292893.292893c.390525-.390524 1.023689-.390524 1.414214 0 .390524.390525.390524 1.023689 0 1.414214l-4 4c-.390525.390524-1.023689.390524-1.414214 0l-4-4c-.390524-.390525-.390524-1.023689 0-1.414214.390525-.390524 1.023689-.390524 1.414214 0L5 3.585786 8.292893.292893z"></path>
                        </svg>
                    </div>
                </div>

                <div class="p-2">
                    <div class="flex relative">
                        <select v-model="sort" @change="fetch(1)" class="form-control form-input form-input-bordered">
                            <optgroup :label="__('Sort')">
                                <option value="asc">{{ __('Asc') }}</option>
                                <option value="desc">{{ __('Desc') }}</option>
                            </optgroup>
                        </select>

                        <svg class="flex-shrink-0 pointer-events-none form-select-arrow" xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6">
                            <path class="fill-current" d="M8.292893.292893c.390525-.390524 1.023689-.390524 1.414214 0 .390524.390525.390524 1.023689 0 1.414214l-4 4c-.390525.390524-1.023689.390524-1.414214 0l-4-4c-.390524-.390525-.390524-1.023689 0-1.414214.390525-.390524 1.023689-.390524 1.414214 0L5 3.585786 8.292893.292893z"></path>
                        </svg>
                    </div>
                </div>

                <div v-if="isLoading" class="inline-flex self-center items-center p-2">
                    <div class="relative" style="height: 24px">
                        <loading />
                    </div>
                </div>
            </div>
        </template>

        <transition name="image-loading" mode="out-in">
            <div v-if="isUploading" class="flex flex-col h-full text-primary-600 content-center justify-center text-center overflow-hidden">
                <div class="relative" style="height: 64px">
                    <loading />
                </div>

                <p>{{ __('Optimizing & Uploading to Storage...') }}</p>
            </div>

            <div v-else-if="items.length" ref="scrollable" @scroll="onScroll" @dragover.prevent="" @drop.prevent="handleUploads" class="h-full w-full overflow-y-scroll">
                <div class="flex flex-row flex-wrap justify-center content-center mb-12 mt-6 px-6">
                    <div v-for="item in items" :key="item.hash" @click="select(item)" class="media-container text-center p-1 cursor-pointer flex flex-col" :title="item.name" :class="{'w-1/6': isImagePicker, 'w-1/5': isVideoPicker}">
                        <v-lazy-image
                            v-if="isImagePicker"
                            class="image-preview rounded shadow bg-white self-center mx-auto"
                            :key="item.id"
                            :src="item.url"
                            :src-placeholder="$options.spinner"
                            :class="{'image-preview-selected': isSelected(item)}"
                        />

                        <video v-else class="video-player" :poster="item.urls.cover" :class="{'selected': isSelected(item)}">
                            <source :src="item.urls.video" type="video/mp4">
                        </video>

                        <strong class="media-name text-primary-600">{{ item.name }}</strong>
                    </div>
                </div>
            </div>

            <div v-else @drop.prevent="handleUploads" @dragover.prevent="" class="flex flex-col h-full text-primary-600 content-center justify-center text-center">
                <p>{{ __(isLoading ? 'Loading...' : 'No Results.') }}</p>
            </div>
        </transition>

        <template #footer>
            <div class="flex p-2">
                <div>
                    <button @click.prevent="insert" :disabled="!selected.length" class="bg h-9 shadow bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded inline-flex items-center justify-center px-3 shadow relative">
                        <span v-if="selected.length < 2">{{ __(isImagePicker ? 'Choose Image' : 'Choose Video') }}</span>
                        <span v-else-if="isImagePicker">{{ __('Insert :count Images', {count: selected.length}) }}</span>
                        <span v-else>{{ __('Insert :count Videos', {count: selected.length}) }}</span>
                    </button>
                </div>

                <div class="inline-flex flex-grow text-primary-600 self-center items-center ml-3" v-if="selected.length > 1">
                    <span>{{ __(':count Items Selected', {count: selected.length}) }}</span>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
import modal from './modal'
import loading from './loading'
import spinner from './../assets/spinner'
import interactsWithResources from "./mixins/interactsWithResources"
import VLazyImage from "v-lazy-image"

export default {
    name: "MediaBrowser",
    mixins: [interactsWithResources],
    components: {
        loading, modal, VLazyImage
    },
    props: {
        fieldKey: {default: () => 'content'},
        multiple: {default: () => true},
        hasLaruploadTrait: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'image',
            validator: (value) => {
                return ['image', 'video'].includes(value)
            }
        }
    },
    data: () => ({
        items: [],
        selected: [],
        isVisible: false,
        isLoading: false,
        isUploading: false,
        searchTerm: '',
        orderBy: 'id',
        sort: 'desc',
        perPage: 100,
        page: 1,
    }),
    computed: {
        isImagePicker() {
            return this.type === 'image'
        },

        isVideoPicker() {
            return !this.isImagePicker
        },

        resourceKey() {
            return this.isImagePicker ? 'images' : 'videos'
        },

        event() {
            return `ckeditor:media:${this.fieldKey}`
        }
    },
    methods: {
        /**
         * Fetch Resource
         *
         * @param page Number
         */
        async fetch(page = 0) {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true
            const newPage = (page ? page : this.page + 1)
            const params = {
                orderByDirection: this.sort,
                search: this.searchTerm,
                orderBy: this.orderBy,
                perPage: this.perPage,
                page: newPage,
                ckeditor: 'media',
            }

            return await this.fetchResourceCollection(this.resourceKey, params)
                .then((entities) => {
                    this.items = newPage > 1 ? this.items.concat(entities) : entities

                    if (this.isVideoPicker) {
                        this.items.map((item) => {
                            if (this.hasLaruploadTrait) {
                                item.url = item.file_field.cover
                                item.urls = {
                                    cover: item.file_field.cover,
                                    video: item.file_field.original,
                                }
                            }
                            else {
                                item.urls = {
                                    cover: null,
                                    video: item.url,
                                }
                            }

                            return item
                        })
                    }

                    if (entities.length) {
                        this.page = newPage
                    }
                })
                .finally(() => {
                    this.isLoading = false
                })
        },

        /**
         * Handle Dropped File Uploads
         *
         * @param dataTransfer {DataTransfer}
         */
        handleUploads({dataTransfer}) {
            if (this.isUploading) {
                return;
            }

            this.isUploading = true

            const uploads = []
            const requests = ([...dataTransfer.files]).map(file => {
                const data = {}

                if (this.isImagePicker) {
                    data.file = file
                    data.name = file.name.split('.').slice(0, -1).join('.')
                }
                else {
                    if (this.hasLaruploadTrait) {
                        data.file_field = file
                    }
                    else {
                        data.file = file
                    }
                }

                return this.uploadResource(this.resourceKey, data)
                    .then((item) => {
                        if (item && item.name) {
                            Nova.success(this.__('File uploaded: :file', {
                                file: item.name
                            }))

                            uploads.push(item)
                        }
                    })
            })

            Promise.all(requests)
                .then(() => this.fetch(1))
                .then(() => {
                    this.items
                        .filter((item) => uploads.includes(item))
                        .forEach(this.select.bind(this))
                })
                .finally(() => {
                    this.isUploading = false
                })
        },

        /**
         * Emit Write Event to Field Component
         */
        insert() {
            Nova.$emit(`${this.event}:write`, this.multiple ? this.selected : this.selected[0])
            this.selected = []
            this.isVisible = false
        },

        /**
         * Select One or Many Items
         *
         * @param item
         * @return {*[]}
         */
        select(item) {
            if (this.multiple) {
                if (this.isSelected(item)) {
                    this.deselect(item)
                }
                else {
                    this.selected.push(item)
                }
            }
            else {
                this.selected = [item]
            }
        },

        /**
         * Deselect Item
         *
         * @param item
         * @return {*[]}
         */
        deselect(item) {
            this.selected = this.selected.filter(entry => entry !== item)
        },

        /**
         * Check if item is selected
         *
         * @param item
         * @return {boolean}
         */
        isSelected(item) {
            return this.selected.find((entry) => item === entry)
        },

        /**
         * Handle Infinite Scrolling
         *
         * @param target EventTarget
         */
        onScroll({target}) {
            if ((target.scrollHeight - target.scrollTop) <= target.clientHeight + 200) {
                this.fetch()
            }
        },

        /**
         * Show the Modal
         */
        show() {
            this.isVisible = true
            this.fetch(1)
        },

        /**
         * Close the Modal
         * If the user focuses another instance of the editor, close the modal.
         */
        close(fieldKey) {
            if (fieldKey !== this.fieldKey) {
                this.isVisible = false
            }
        },
    },
    created() {
        this.$options.spinner = spinner
        Nova.$on(this.event, this.show)
        Nova.$on(`ckeditor:focused`, this.close)
    },
    beforeDestroy() {
        Nova.$off(this.event, this.show)
        Nova.$off(`ckeditor:focused`, this.close)
    }
}
</script>

<style lang="scss" scoped>
.media-container {
    position: relative;

    .image-preview {
        border: 3px solid transparent;
        transition: all 120ms ease-in-out;
        height: 11rem;

        &:hover {
            border-color: var(--primary);
        }

        &.image-preview-selected {
            outline-color: rgb(var(--colors-green-500));
            border: 3px solid rgb(var(--colors-green-500)) !important;
        }

        &.v-lazy-image {
            opacity: 0;
            transition: all 120ms ease-in-out !important;
        }

        &.v-lazy-image-loaded {
            width: 100%;
            opacity: 1;
        }
    }

    .video-player {
        width: 100%;
        max-width: 100%;
        height: 11rem;
        display: block;
        object-fit: cover;
        transition: all 200ms;
        pointer-events: none;

        &.selected {
            outline-color: rgb(var(--colors-green-500));
            border: 3px solid rgb(var(--colors-green-500)) !important;
        }
    }

    .media-name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 12px;
        display: block;
        margin-top: 8px;
        margin-bottom: 4px;
    }
}
</style>

<style lang="scss">
.image-browser-modal {
    .bg-grad-sidebar {
        overflow-y: hidden !important;
    }
}
</style>

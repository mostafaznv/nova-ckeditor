<template>
    <modal v-model="isVisible" ref="modal" class="image-browser-modal" :title="__(title)" fullscreen scroll-lock>
        <template #header>
            <div class="pl-6 flex -mx-2">
                <div class="p-2">
                    <input
                        v-model="searchTerm"
                        type="search"
                        class="form-control form-input form-input-bordered"
                        @keydown.enter.prevent="fetch(1)"
                        :placeholder="__(searchPlaceholder)"
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

                                    <template v-if="isAudioPicker">
                                        <option value="size">{{ __('Size') }}</option>
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

                <div v-if="isLoading" class="inline-flex self-center items-center">
                    <div class="relative">
                        <loading />
                    </div>
                </div>
            </div>
        </template>

        <transition name="image-loading" mode="out-in">
            <div @drop.prevent="handleUploads" @dragover.prevent="" @dragenter="dragCounter++" @dragleave="dragCounter--" class="media-main h-full overflow-hidden" :class="{active: dragCounter > 0}">
                <div v-if="isUploading" class="flex flex-col h-full text-primary-600 content-center justify-center text-center overflow-hidden">
                    <div class="flex items-center justify-center" style="height: 64px">
                        <loading />
                    </div>

                    <p>{{ __('Optimizing & Uploading to Storage...') }}</p>
                </div>

                <div v-else-if="items.length" ref="scrollable" @scroll="onScroll" class="h-full w-full overflow-y-scroll">
                    <div class="grid nc-grid-cols-6 gap-4 mb-12 mt-6 px-6">
                        <div v-for="(item, key) in items" :key="item.hash" @click="select(item)" class="media-container text-center p-1 cursor-pointer" :title="item.name">
                            <div class="content-container" :class="{'selected': isSelected(item)}">
                                <div @click.stop.prevent="directSelect(item)" class="direct-select" :title="__('Direct Select')">
                                    <Icon type="plus" />
                                </div>

                                <v-lazy-image
                                    v-if="isImagePicker"
                                    class="image-preview bg-white mx-auto"
                                    :key="item.id ?? key"
                                    :src="item.url"
                                    :src-placeholder="$options.spinner"
                                />

                                <v-lazy-image
                                    v-else-if="isVideoPicker"
                                    class="image-preview bg-white mx-auto"
                                    :key="item.id ?? key"
                                    :src="item.urls.cover"
                                    :src-placeholder="$options.spinner"
                                />

                                <div v-else class="audio-placeholder">
                                    <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="256" height="256" fill="#e7ebef"/>
                                        <path d="M128 97.0625C109.35 97.0625 93.9687 111.02 91.7187 129.055C93.3711 128.387 95.1641 128 97.0625 128C101.721 128 105.5 131.779 105.5 136.438V158.938C105.5 163.596 101.721 167.375 97.0625 167.375C89.293 167.375 83 161.082 83 153.312V150.5V142.062V133.625C83 108.77 103.145 88.625 128 88.625C152.855 88.625 173 108.77 173 133.625V142.062V150.5V153.312C173 161.082 166.707 167.375 158.938 167.375C154.279 167.375 150.5 163.596 150.5 158.938V136.438C150.5 131.779 154.279 128 158.938 128C160.836 128 162.629 128.369 164.281 129.055C162.031 111.02 146.65 97.0625 128 97.0625Z" fill="#64748B"/>
                                    </svg>
                                </div>
                            </div>

                            <strong class="media-name text-primary-600">{{ item.name }}</strong>
                        </div>
                    </div>
                </div>

                <div v-else class="flex flex-col h-full text-primary-600 content-center justify-center text-center">
                    <p>{{ __('No Results.') }}</p>
                    <span class="block">{{ __('Drop your files here') }}</span>
                </div>
            </div>
        </transition>

        <template #footer>
            <div class="flex justify-between p-2">
                <div class="flex">
                    <div>
                        <button @click.prevent="insert" :disabled="!selected.length" class="bg h-9 shadow bg-primary-500 hover:bg-primary-400 text-white dark:text-gray-900 cursor-pointer rounded inline-flex items-center justify-center px-3 shadow relative">
                            <span v-if="selected.length < 2">{{ __(pickerLabel) }}</span>
                            <span v-else-if="isImagePicker">{{ __('Insert :count Images', {count: selected.length}) }}</span>
                            <span v-else-if="isVideoPicker">{{ __('Insert :count Videos', {count: selected.length}) }}</span>
                            <span v-else>{{ __('Insert :count Audios', {count: selected.length}) }}</span>
                        </button>
                    </div>

                    <div class="inline-flex flex-grow text-primary-600 self-center items-center ml-3" v-if="selected.length > 1">
                        <span>{{ __(':count Items Selected', {count: selected.length}) }}</span>
                    </div>
                </div>

                <div class="file-input">
                    <input
                        @change="onSelectFiles"
                        type="file"
                        :id="fileInputId"
                        :accept="acceptedMimeTypes"
                        multiple
                    />

                    <label :for="fileInputId" class="focus:outline-none focus:ring rounded border-2 border-primary-300 dark:border-gray-500 hover:border-primary-500 active:border-primary-400 dark:hover:border-gray-400 dark:active:border-gray-300 bg-white dark:bg-transparent text-primary-500 dark:text-gray-400 px-3 h-9 inline-flex items-center font-bold">
                        <span>{{ __('Choose Files') }}</span>
                    </label>
                </div>
            </div>
        </template>
    </modal>
</template>

<script>
import modal from './modal'
import loading from './loading'
import spinner from './../assets/spinner'
import interactsWithResources from './mixins/interactsWithResources'
import VLazyImage from "v-lazy-image"
import debounce from 'lodash/debounce'

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
                return ['image', 'video', 'audio'].includes(value)
            }
        }
    },
    data() {
        const introKey = 'nova-ckeditor-uploader-intro-' + this.type

        return {
            items: [],
            selected: [],
            dragCounter: 0,
            introKey: introKey,
            intro: localStorage.getItem(introKey) === 'true',
            fileInputId: `${this.type}-input-` + Date.now(),
            isVisible: false,
            isLoading: false,
            isUploading: false,
            searchTerm: '',
            orderBy: 'id',
            sort: 'desc',
            perPage: 100,
            page: 1,
        }
    },
    computed: {
        isImagePicker() {
            return this.type === 'image'
        },

        isVideoPicker() {
            return this.type === 'video'
        },

        isAudioPicker() {
            return this.type === 'audio'
        },

        title() {
            if (this.isImagePicker) {
                return 'Image Picker'
            }
            if (this.isVideoPicker) {
                return 'Video Picker'
            }

            return 'Audio Picker'
        },

        searchPlaceholder() {
            if (this.isImagePicker) {
                return 'Search Image ...'
            }
            if (this.isVideoPicker) {
                return 'Search Video ...'
            }

            return 'Search Audio ...'
        },

        pickerLabel() {
            if (this.isImagePicker) {
                return 'Insert Image'
            }
            if (this.isVideoPicker) {
                return 'Insert Video'
            }

            return 'Insert Audio'
        },

        acceptedMimeTypes() {
            if (this.isImagePicker) {
                return 'image/*'
            }
            if (this.isVideoPicker) {
                return 'video/*'
            }

            return 'audio/*'
        },

        resourceKey() {
            if (this.isImagePicker) {
                return 'images'
            }
            else if (this.isVideoPicker) {
                return 'videos'
            }

            return 'audio'
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
         * Handle File Selection
         *
         * @param e {Event}
         */
        onSelectFiles(e) {
            if (e.target?.files?.length) {
                const data = {
                    dataTransfer: {
                        files: e.target.files
                    }
                }

                this.handleUploads(data)
            }
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
            this.dragCounter = 0

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
         * Direct Select an Item
         */
        directSelect(item) {
            this.selected = [item]

            this.insert()
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
        onScroll: debounce(function({target}) {
            if ((target.scrollHeight - target.scrollTop) <= target.clientHeight + 200) {
                this.fetch()
            }
        }, 300),

        /**
         * Show the Modal
         */
        show() {
            this.isVisible = true
            this.displayIntro()
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

        /**
         * Display Intro Toast
         */
        displayIntro() {
            if (!this.intro) {
                localStorage.setItem(this.introKey, 'true')

                const icon = '<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
                const content = this.__('You can upload your files by dragging them here')

                Nova.$toasted.info(icon + ' ' + content, {
                    duration: 15000,
                    keepOnHover: true
                })
            }
        }
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
        height: 11rem;
        object-fit: cover;

        &:hover {
            border-color: var(--primary);
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

    .video-player, .audio-player {
        width: 100%;
        max-width: 100%;
        height: 11rem;
        display: block;
        object-fit: cover;
        pointer-events: none;
    }

    .audio-placeholder {
        width: 100%;
        max-width: 100%;
        object-fit: cover;
        pointer-events: none;

        svg {
            width: 100%;
            height: auto;
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

    .content-container {
        position: relative;
        transition: all 300ms;
        border: solid 3px transparent;

        &:after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            content: "";
            transition: all 300ms;
        }

        &.selected {
            outline-color: rgb(var(--colors-primary-400));
            border: 3px solid rgb(var(--colors-primary-400)) !important;

            &:after {
                background: rgba(0, 0, 0, 0.3);
            }
        }

        .direct-select {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgb(var(--colors-gray-100));
            color: rgb(var(--colors-primary-600));
            border-radius: 1px;
            opacity: 0;
            transition: all 300ms;
            z-index: 1;
        }

        &:hover {
            .direct-select {
                opacity: 1;
            }
        }
    }
}

.media-main {
    position: relative;
    border: dashed 2px transparent;
    transition: all 300ms;

    &.active {
        border-color: rgba(var(--colors-primary-400));
    }
}

.file-input {
    position: relative;
    z-index: 1;

    input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        width: 0;
        height: 0;
        z-index: -1;
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

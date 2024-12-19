<template>
    <div @dblclick.stop="pick" @click.stop="select(true)" class="item bg-white dark:bg-gray-800" :class="{selected: isSelected}">
        <figure class="item__preview">
            <figcaption class="item__preview--format">{{ format }}</figcaption>

            <div class="item__preview--content">
                <audio-icon
                    v-if="type === 'audio'"
                    width="32"
                    height="32"
                />

                <picture v-else-if="cover || (type === 'image' && src)">
                    <template v-if="item.file?.meta?.format === 'gif'">
                        <source :src="src" :srcset="src">
                        <img alt="onion" :src="src">
                    </template>

                    <template v-else>
                        <source :src="src" :srcset="cover || src">
                        <img alt="onion" :src="cover || src">
                    </template>
                </picture>

                <video
                    v-else-if="type === 'video'"
                    :src="src"
                    muted
                />

                <file-icon
                    v-else-if="type === 'file'"
                    width="32"
                    height="32"
                />
            </div>

            <figcaption @click.stop="play" class="item__preview--play nova-ckeditor-mobile-none" :title="__('Preview')">
                <Icon name="eye" />
            </figcaption>
        </figure>

        <div class="item__details border-t border-gray-200 dark:border-gray-700">
            <span class="item__details--name" :title="item.name">{{ item.name }}</span>

            <button @click.stop.prevent="select(false)" type="button" class="item__details--select">
                <Icon name="check" />
            </button>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue"
import AudioIcon from "../icons/AudioIcon.vue"
import FileIcon from "../icons/FileIcon.vue"
import {Icon} from 'laravel-nova-ui'
import {typeProp, selectedItemsProp, keepAspectRatioProp, gallerySizeProp} from "../../utils/picker-props"


// emits
const emits = defineEmits([
    'select',
    'selectOne',
    'pick',
    'play'
])


// variables
const props = defineProps({
    type: typeProp,
    selectedItems: selectedItemsProp,
    keepAspectRatio: keepAspectRatioProp,
    gallerySize: gallerySizeProp,
    item: {
        type: Object,
        required: true
    }
})


// computed properties
const src = computed(() => {
    if (props.item?.file?.original) {
        return props.item.file.original
    }

    return props.item.url ?? null
})

const cover = computed(() => {
    if (props.item?.file?.cover) {
        return props.item.file.cover
    }

    return null
})

const format = computed(() => {
    if (props.item?.file?.meta?.format) {
        return props.item.file.meta.format
    }

    return src.value?.split('.').pop()
})

const isSelected = computed(() => {
    return props.selectedItems.findIndex(item => item.id === props.item.id) !== -1
})

const gallerySizePx = computed(() => {
    return props.gallerySize + 'px'
})

const objectFit = computed(() => {
    if (props.keepAspectRatio) {
        return 'contain'
    }

    return 'cover'
})


// methods
function select(one = false) {
    const item = props.item
    item.link = src.value

    emits(one === true ? 'selectOne' : 'select', item)
}

function pick() {
    const item = props.item
    item.link = src.value

    emits('pick', item)
}

function play() {
    const item = props.item
    item.link = src.value

    emits('play', item)
}
</script>

<style lang="scss" scoped>
.item {
    position: relative;
    display: block;
    box-shadow: 0 0 4px 2px rgba(46, 49, 56, 0.15);
    border: 1px solid transparent;
    overflow: hidden;
    transition: all 300ms;

    &__preview {
        position: relative;
        cursor: pointer;
        height: v-bind(gallerySizePx);
        margin: 0;
        overflow: hidden;

        &--format, &--play {
            position: absolute;
            top: 0;
            left: 0;
            height: 24px;
            background-color: rgb(23, 25, 28);
            color: white;
            font-size: 12px;
            padding: 2px 4px;
            text-transform: uppercase;
            z-index: 1;
            transition: all 300ms;
        }

        &--play {
            left: auto;
            right: 0;
            opacity: 0;

            &:hover {
                background-color: rgb(69, 72, 79);
            }

            svg {
                width: 16px;
                height: 16px;
                margin-bottom: 2px;
            }
        }

        &--content {
            position: relative;
            display: flex;
            height: calc(100% + 1px);
            width: calc(100% + 1px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: -1px;

            picture {
                width: 100%;
                height: 100%;
            }

            img, video {
                object-fit: v-bind(objectFit);
                width: 100%;
                height: 100%;
            }

            video {
                pointer-events: none;
            }
        }
    }

    &__details {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        padding: 4px 8px;
        cursor: pointer;

        &--name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &--select {
            padding: 4px;
            border-radius: 4px;
            transition: all 300ms;
            opacity: 0;

            svg {
                width: 16px;
                height: 16px;
                color: rgba(var(--colors-gray-600));
                transition: all 300ms;
            }

            &:hover:not(:disabled) {
                background: rgba(var(--colors-gray-100));

                svg {
                    color: rgba(var(--colors-gray-800));
                }
            }
        }
    }

    &:hover {
        .item__details {
            .item__details--select {
                opacity: 1;
            }
        }

        .item__preview--play {
            opacity: 1;
        }
    }

    &.selected {
        border-color: rgba(var(--colors-primary-400));


        .item__details {
            .item__details--select {
                opacity: 1;

                svg {
                    color: rgba(var(--colors-primary-600));
                }
            }
        }
    }
}
</style>

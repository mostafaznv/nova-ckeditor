<template>
    <div @click="select(true)" class="item" :class="{selected: isSelected}">
        <figure class="item__preview">
            <figcaption class="item__preview--format">{{ format }}</figcaption>

            <div class="item__preview--content">
                <audio-icon
                    v-if="type === 'audio'"
                    width="32"
                    height="32"
                />

                <picture v-else-if="cover || src">
                    <source :srcset="cover || src">
                    <img alt="onion" :src="cover || src">
                </picture>
            </div>
        </figure>

        <div class="item__details">
            <span class="item__details--name" :title="item.name">{{ item.name }}</span>

            <button @click.stop.prevent="select(false)" type="button" class="item__details--select">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import {computed, defineEmits} from "vue"
import AudioIcon from "../AudioIcon.vue"


// emits
const emits = defineEmits([
    'select',
    'selectOne'
])


// variables
const props = defineProps({
    item: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['image', 'video', 'audio'].includes(value)
        }
    },
    selectedItems: {
        type: Array,
        default: () => []
    },
    gallerySize: {
        type: Number,
        default: 180
    },
    keepAspectRatio: {
        type: Boolean,
        default: false
    },
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

const gallerySize = computed(() => {
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
</script>

<style lang="scss" scoped>
.item {
    position: relative;
    display: block;
    background-color: white;
    box-shadow: 0 0 4px 2px rgba(46, 49, 56, 0.15);
    border: 1px solid transparent;
    overflow: hidden;
    transition: all 300ms;

    &__preview {
        position: relative;
        cursor: pointer;
        height: v-bind(gallerySize);
        margin: 0;
        overflow: hidden;

        &--format {
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgb(23, 25, 28);
            color: white;
            font-size: 12px;
            padding: 2px 4px;
            text-transform: uppercase;
            z-index: 1;
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

            img {
                object-fit: v-bind(objectFit);
                width: 100%;
                height: 100%;
            }
        }
    }

    &__details {
        border-top: 1px solid rgba(46, 49, 56, 0.15);
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
                fill: rgba(var(--colors-gray-600));
                transition: all 300ms;
            }

            &:hover:not(:disabled) {
                background: rgba(var(--colors-gray-100));

                svg {
                    fill: rgba(var(--colors-gray-800));
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
    }

    &.selected {
        border-color: rgba(var(--colors-primary-400));


        .item__details {
            .item__details--select {
                svg {
                    fill: rgba(var(--colors-primary-600));
                }
            }
        }
    }
}
</style>

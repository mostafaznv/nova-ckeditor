<template>
    <transition name="fade">
        <div v-if="loading" class="loading bg-white/75 dark:bg-gray-800/75" />
    </transition>


    <template v-if="items.length">
        <media-browser-item
            v-for="item in items"
            @select="selected"
            @select-one="selectedOne"
            @pick="pick"
            @play="play"
            :type="type"
            :item="item"
            :selected-items="selectedItems"
            :gallery-size="gallerySize"
            :keep-aspect-ratio="keepAspectRatio"
            :key="item.id"
        />
    </template>

    <div v-else class="flex flex-col items-center justify-center h-full">
        <p class="text-gray-500 text-center">{{ __('No Results') }}</p>
    </div>


    <transition name="fade">
        <div v-if="selectedItems.length" class="selected-items">
            {{ __(':count file selected', {count: selectedItems.length}) }}
        </div>
    </transition>
</template>

<script setup>
import {ref, computed, watch} from "vue"
import useResourceRequest from "../../composables/useResourceRequest"
import {paginationProp, sortProp, keepAspectRatioProp, typeProp, gallerySizeProp, selectedItemsProp, loadingProp, keywordProp, hasLaruploadTraitProp, orderByProp, columnsProp} from "../../utils/picker-props"
import MediaBrowserItem from "./MediaBrowserItem.vue"
import {guessResourceKey} from "../../utils/helpers"


// exposes
defineExpose({
    fetch
})


// emits
const emits = defineEmits([
    'update:pagination',
    'update:loading',
    'update:selectedItems',
    'update:columns',
    'pick',
    'play'
])


// composables
const {fetchResourceList, pagination} = useResourceRequest(emits)


// variables
const props = defineProps({
    keepAspectRatio: keepAspectRatioProp,
    type: typeProp,
    gallerySize: gallerySizeProp,
    selectedItems: selectedItemsProp,
    loading: loadingProp,
    keyword: keywordProp,
    hasLaruploadTrait: hasLaruploadTraitProp,
    orderBy: orderByProp,
    sort: sortProp,
    pagination: paginationProp,
    columns: columnsProp,
    page: {
        type: Number,
        default: 1
    }
})

const items = ref([])


// computed properties
const resourceKey = computed(() => {
    return guessResourceKey(props.type)
})

const filters = computed(() => {
    return {
        keyword: props.keyword,
        orderBy: props.orderBy,
        orderByDirection: props.sort
    }
})


// watchers
watch(
    () => props.page,
    async (page) => {
        await fetch(page)
    }
)

watch(
    () => filters.value,
    async () => {
        await fetch(1)
    }
)


// methods
async function fetch(page = 1) {
    emits('update:loading', true)

    const params = {
        orderByDirection: props.sort,
        search: props.keyword,
        orderBy: props.orderBy,
        page: page,
        ckeditor: 'media'
    }

    return await fetchResourceList(resourceKey.value, params)
        .then((entities) => {
            items.value = entities


            emits(
                'update:columns',
                items.value.length ? Object.keys(items.value[0]) : []
            )
        })
        .finally(() => {
            emits('update:loading', false)
        })
}

function selected(item) {
    let items = props.selectedItems
    const isSelected = items.findIndex(i => i.id === item.id) !== -1

    if (isSelected) {
        items = items.filter(i => i.id !== item.id)
    }
    else {
        items.push(item)
    }

    emits('update:selectedItems', items)
}


function selectedOne(item) {
    emits('update:selectedItems', [item])
}

function pick(item) {
    emits('pick', item)
}

function play(item) {
    selectedOne(item)

    emits('play')
}


fetch(props.page)
</script>

<style lang="scss" scoped>
.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}

.selected-items {
    position: absolute;
    bottom: 46px;
    left: 0;
    background-color: rgba(23, 25, 28, 0.85);
    color: white;
    font-size: 14px;
    padding: 4px 8px;
    z-index: 5;
    transition: all 300ms;
}

[dir=rtl] {
    .selected-items {
        right: 0;
        left: auto;
    }
}
</style>

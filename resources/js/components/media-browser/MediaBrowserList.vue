<template>
    <media-browser-item
        v-for="item in items"
        @select="selected"
        @select-one="selectedOne"
        :type="type"
        :item="item"
        :selected-items="selectedItems"
        :gallery-size="gallerySize"
        :keep-aspect-ratio="keepAspectRatio"
        :key="item.id"
    />
</template>

<script setup>
import {ref, computed, watch, defineEmits, defineExpose} from "vue"
import useResourceRequest from "../../composables/useResourceRequest"
import defaultProps from "../../utils/picker-props"
import MediaBrowserItem from "./MediaBrowserItem.vue"


// exposes
defineExpose({
    fetch
})


// emits
const emits = defineEmits([
    'update:pagination',
    'update:loading',
    'update:selectedItems'
])


// composables
const {fetchResourceList, pagination} = useResourceRequest(emits)


// variables
const props = defineProps({
    ...defaultProps,
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
    loading: {
        type: Boolean,
        default: false
    }
})

const items = ref([])



// computed properties
const resourceKey = computed(() => {
    if (props.type === 'image') {
        return 'images'
    }
    else if (props.type === 'video') {
        return 'videos'
    }

    return 'audio'
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


fetch(props.page)
</script>

<style lang="scss" scoped>

</style>

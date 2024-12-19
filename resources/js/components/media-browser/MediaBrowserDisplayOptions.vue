<template>
    <div v-on-click-outside="close" class="options relative">
        <div>
            <button @click.stop="toggle" type="button" class="media-browser-btn" :title="__('Display Options')">
                <Icon name="adjustments-horizontal" />
            </button>
        </div>

        <transition name="fade">
            <div v-if="status" class="options__menu absolute right-0 z-10 mt-2 select-none overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 px-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <nav class="py-1">
                    <label class="options__heading">{{ __('Assets') }}</label>

                    <SelectControl
                        @change="onOrderByChange"
                        class="w-full"
                        :options="orderByItems"
                        :selected="orderBy"
                        :aria-label="__('Order By')"
                    >
                        <option value="" disabled selected>{{ __('Order By') }}</option>
                    </SelectControl>

                    <div class="mt-2">
                        <radio-input
                            @change="onOrderByDirectionChange"
                            name="orderByDirection"
                            :checked="orderByDirection"
                            :options="orderByDirectionItems"
                        />
                    </div>


                    <label class="options__heading mt-3">{{ __('Thumbnails') }}</label>

                    <label class="options__label">{{ __('Size') }}</label>
                    <input
                        @change="onSizeChange"
                        type="range"
                        class="nova-ckeditor-range"
                        min="180"
                        max="380"
                        step="50"
                        :value="size"
                    />

                    <div class="flex items-center justify-between mt-3">
                        <label class="options__label">{{ __('Keep aspect ratio') }}</label>

                        <switch-input
                            @change="onKeepAspectRatioChange"
                            :model-value="keepAspectRatio"
                        />
                    </div>
                </nav>
            </div>
        </transition>
    </div>
</template>

<script setup>
import {ref, computed} from "vue"
import {useLocalization} from 'laravel-nova'
import { Icon } from 'laravel-nova-ui'
import SwitchInput from "../SwitchInput.vue"
import RadioInput from "../RadioInput.vue"
import {orderByProp, keepAspectRatioProp, columnsProp, typeProp} from "../../utils/picker-props"
import {vOnClickOutside} from "@vueuse/components"


// composables
const {__} = useLocalization()


// emits
const emits = defineEmits([
    'update:orderBy',
    'update:orderByDirection',
    'update:size',
    'update:keepAspectRatio'
])


// variables
const props = defineProps({
    orderBy: orderByProp,
    keepAspectRatio: keepAspectRatioProp,
    type: typeProp,
    columns: columnsProp,
    orderByDirection: {
        type: String,
        default: 'desc',
        validator(value) {
            return ['asc', 'desc'].includes(value)
        }
    },
    size: {
        type: Number,
        default: 180
    }
})


const status = ref(false)

const orderByDirectionItems = ref([
    {value: 'asc', label: __('Ascending')},
    {value: 'desc', label: __('Descending')}
])


// computed properties
const orderByItems = computed(() => {
    const items = [
        {value: 'id', label: __('ID'), type: null},
        {value: 'name', label: __('Name'), type: null},
        {value: 'file_file_width', label: __('Width'), type: ['image', 'video']},
        {value: 'file_file_height', label: __('Height'), type: ['image', 'video']},
        {value: 'width', label: __('Width'), type: ['image', 'video']},
        {value: 'height', label: __('Height'), type: ['image', 'video']},
        {value: 'file_file_size', label: __('Size'), type: null},
        {value: 'size', label: __('Size'), type: null},
        {value: 'file_file_duration', label: __('Duration'), type: ['video', 'audio']},
        {value: 'created_at', label: __('Created At'), type: null},
        {value: 'updated_at', label: __('Updated At'), type: null},
    ]

    return items.filter(item => {
        const exists = props.columns.includes(item.value)

        if (item.type === null) {
            return exists
        }

        return item.type.includes(props.type) && exists
    })
})


// methods
function toggle() {
    status.value = !status.value
}

function close() {
    status.value = false
}

function onOrderByChange(value) {
    if (value?.target?.value) {
        value = value.target.value
    }

    emits('update:orderBy', value)
}

function onOrderByDirectionChange(e) {
    emits('update:orderByDirection', e.target.value)
}

function onSizeChange(e) {
    localStorage.setItem('nova-ckeditor.gallery-size', e.target.value)

    emits('update:size', e.target.value)
}

function onKeepAspectRatioChange(e) {
    localStorage.setItem('nova-ckeditor.keep-gallery-aspect-ratio', e.target.checked)

    emits('update:keepAspectRatio', e.target.checked)
}
</script>

<style lang="scss" scoped>
.options {
    &__menu {
        min-width: 200px;
        padding: 0 0.75rem 0.5rem;
    }

    &__heading {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: rgba(var(--colors-gray-400));
        padding: 0.5rem 0;
    }

    &__label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: rgba(var(--colors-gray-600));
    }
}
</style>

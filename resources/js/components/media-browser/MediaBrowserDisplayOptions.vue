<template>
    <div v-click-outside="close" class="options relative">
        <div>
            <button @click.stop="toggle" type="button" class="options__button" :title="__('Display Options')">
                <Icon type="adjustments" />
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
import {ref, defineProps, defineEmits} from "vue"
import {useLocalization} from 'laravel-nova'
import SwitchInput from "../SwitchInput.vue"
import RadioInput from "../RadioInput.vue"


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
    orderBy: {
        type: String,
        default: 'id',
        validator(value) {
            return ['id', 'name', 'width', 'height', 'size', 'duration', 'created_at', 'updated_at'].includes(value)
        }
    },
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
    },
    keepAspectRatio: {
        type: Boolean,
        default: false
    }
})


const status = ref(false)

const orderByDirectionItems = ref([
    {value: 'asc', label: __('Ascending')},
    {value: 'desc', label: __('Descending')}
])

const orderByItems = [
    // todo - some of these should be disabled on different types of picker
    {value: 'id', label: __('ID')},
    {value: 'name', label: __('Name')},
    {value: 'width', label: __('Width')},
    {value: 'height', label: __('Height')},
    {value: 'size', label: __('Size')},
    {value: 'duration', label: __('Duration')},
    {value: 'created_at', label: __('Created At')},
    {value: 'updated_at', label: __('Updated At')},
]


// methods
function toggle() {
    status.value = !status.value
}

function close() {
    status.value = false
}

function onOrderByChange(value) {
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

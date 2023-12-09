<template>
    <button @click.stop="open" type="button" class="media-browser-btn" :disabled="disabled">
        <Icon type="pencil" />
        <span>{{ __('Rename') }}</span>
    </button>

    <modal v-model="modalStatus" class="rename-modal" :content-no-overflow="true">
        <template #header>
            <div class="flex items-center gap-1">
                <Icon type="pencil" :solid="true" />

                <input
                    @keydown.enter.stop.prevent="submit"
                    v-model="name"
                    ref="input"
                    class="rename-modal__input flex-grow"
                />
            </div>
        </template>

        <template #header-right>
            <div class="flex items-center gap-2">
                <basic-button @click.stop="close" type="button" size="sm">
                    {{ __('Cancel') }}
                </basic-button>

                <default-button @click.stop="submit" type="button" size="sm">
                    {{ __('Submit') }}
                </default-button>
            </div>
        </template>
    </modal>
</template>

<script setup>
import {ref, computed, watch, defineEmits, nextTick} from "vue"
import modal from "../modal"
import {useLocalization} from 'laravel-nova'


// emits
const emit = defineEmits([
    'update:modelValue'
])


// composables
const {__} = useLocalization()


// variables
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    selectedItems: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        required: true,
        validator(value) {
            return ['image', 'video', 'audio'].includes(value)
        }
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const modalStatus = ref(false)
const name = ref(props.selectedItems[0]?.name ?? '')
const input = ref(null)



// computed properties
const item = computed(() => {
    return props.selectedItems.length === 1
        ? props.selectedItems[0]
        : null
})



// watchers
watch(
    () => item.value,
    (value) => {
        name.value = value?.name ?? ''
    }
)


// methods
function submit() {
    if (item.value && name.value) {
        const payload = {
            id: item.value.id,
            name: name.value,
            type: props.type
        }


        Nova.request()
            .put('/nova-vendor/nova-ckeditor/update-name', payload)
            .then(() => {
                Nova.success(__('Name updated successfully'))

                emit('update:modelValue', name.value)
                close()
            })
    }
}

function open() {
    modalStatus.value = true

    nextTick(() => {
        input.value?.focus()
    })
}

function close() {
    modalStatus.value = false
}
</script>

<style lang="scss" scoped>
::v-deep(.rename-modal) {
    max-width: 600px;
    height: 80px !important;
    top: calc(50% - 40px) !important;
    left: calc(50% - 300px) !important;
    overflow: hidden;

    .rename-modal__input {
        outline: none;
        //width: 300px;
        height: 62px;
    }

    .modal__header {
        border-bottom: none;
    }
}
</style>

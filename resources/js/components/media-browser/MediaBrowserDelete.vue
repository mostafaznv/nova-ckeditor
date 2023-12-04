<template>
    <button @click.stop="open" type="button" class="delete-button">
        <Icon type="trash" />
        <span>{{ __('Delete') }}</span>
    </button>

    <modal v-model="modalStatus" class="delete-modal" :content-no-overflow="true">
        <template #header>
            <div class="flex items-center gap-1">
                <Icon type="trash" :solid="true" />
                <span>{{ __('Remove assets') }}</span>
            </div>
        </template>


        <div class="p-3 overflow-x-hidden">
            <span v-if="selectedItems.length > 1">
                {{ __('Are you sure you want to delete :count files?', {count: selectedItems.length}) }}
            </span>

            <span v-else>
                {{ __('Are you sure you want to delete ":name" file?', {name: selectedItems[0].name}) }}
            </span>
        </div>

        <template #footer>
            <default-button @click.stop="submit" type="button" class="bg-red-500" size="sm">
                {{ __('Delete') }}
            </default-button>

            <basic-button @click.stop="close" type="button" size="sm">
                {{ __('Cancel') }}
            </basic-button>
        </template>
    </modal>

    <transition name="fade">
        <div v-if="modalStatus" class="overlay" />
    </transition>
</template>

<script setup>
import {ref, defineEmits} from "vue"
import modal from "../modal"
import {useLocalization} from 'laravel-nova'


// emits
const emit = defineEmits([
    'deleted'
])


// composables
const {__} = useLocalization()


// variables
const props = defineProps({
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
    }
})

const modalStatus = ref(false)



// methods
function open() {
    if (props.selectedItems.length) {
        modalStatus.value = true
    }
}

function close() {
    modalStatus.value = false
}

function submit() {
    if (props.selectedItems.length) {
        const payload = {
            id: props.selectedItems.map(item => item.id),
            type: props.type
        }


        Nova.request()
            .post('/nova-vendor/nova-ckeditor/delete-assets', payload)
            .then(() => {
                Nova.success(__('Assets have been deleted successfully.'))

                emit('deleted')
            })
            .catch((e) => {
                Nova.error(
                    e?.response?.data?.message
                        ? e.response.data.message
                        : __('Something went wrong! Please try again.')
                )
            })
            .finally(() => {
                close()
            })
    }
}
</script>

<style lang="scss" scoped>
.delete-modal {
    z-index: 99999;
    max-width: 400px;
    height: 180px;
    top: calc(50% - 90px);
    left: calc(50% - 200px);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    margin: 0 !important;
}

.bg-red-500 {
    &:hover {
        background: rgba(var(--colors-red-400));
    }
}

.delete-button {
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
</style>

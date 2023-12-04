<template>
    <div class="pagination">
        <div v-if="loading" class="loading">
            <div class="indeterminate"></div>
        </div>


        <button
            @click="updatePage(1)"
            type="button"
            :title="__('First Page')"
            :disabled="total === 1 || modelValue === 1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z"></path></svg>
        </button>

        <button
            @click="updatePage(modelValue - 1)"
            type="button"
            :title="__('Previous Page')"
            :disabled="modelValue === 1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"></path></svg>
        </button>


        <form @submit.prevent.stop="onChangeInput">
            <input
                v-model.number="inputPage"
                type="number"
                :title="__('Enter Page Number')"
                min="1"
                :max="total"
            >
        </form>


        <span class="inline-block mr-2">{{ __('of') }} {{ total }}</span>

        <button
            @click="updatePage(modelValue + 1)"
            type="button"
            :title="__('Next Page')"
            :disabled="modelValue === total"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path></svg>
        </button>

        <button
            @click="updatePage(total)"
            type="button"
            :title="__('Last Page')"
            :disabled="total === 1 || modelValue === total"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z"></path></svg>
        </button>
    </div>
</template>

<script setup>
import {defineEmits, ref, watch} from 'vue'

const emit = defineEmits([
    'update:modelValue'
])


// variables
const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    loading: {
        type: Boolean,
        required: false
    }
})

const inputPage = ref(props.modelValue)


// watchers
watch(
    () => props.modelValue,
    () => {
        inputPage.value = props.modelValue
    }
)


// methods
function onChangeInput() {
    if (Number.isInteger(inputPage.value)) {
        updatePage(inputPage.value)
    }
}

function updatePage(value) {
    emit('update:modelValue', parseInt(value))
}
</script>

<style lang="scss" scoped>
.pagination {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    height: 50px;
    box-shadow: 0 0 6px rgba(46, 49, 56, 0.05);

    button {
        padding: 4px;
        border-radius: 4px;
        transition: all 300ms;

        svg {
            width: 24px;
            height: 24px;
            fill: rgba(var(--colors-gray-600));
            transition: all 300ms;
        }

        &:hover:not(:disabled) {
            background: rgba(var(--colors-gray-100));

            svg {
                fill: rgba(var(--colors-gray-800));
            }
        }

        &:disabled {
            opacity: 0.5;
        }
    }

    input[type=number] {
        padding: 4px 0;
        text-align: center;
        width: 32px;
        outline: none;
        border: none;
        appearance: textfield;
        border-bottom: solid 1px rgba(var(--colors-gray-200));
        margin-bottom: -2px;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    .loading {
        position: absolute;
        width: 100%;
        height: 3px;
        overflow: hidden;
        background-color: rgba(var(--colors-primary-600));
        margin: 0;
        top: 0;

        .indeterminate {
            position: relative;
            width: 100%;
            height: 100%;

            &:before {
                content: '';
                position: absolute;
                height: 100%;
                background-color: rgba(var(--colors-primary-400));
                animation: indeterminateFirst 1.5s infinite ease-out;
            }

            &:after {
                position: absolute;
                content: '';
                height: 100%;
                background-color: rgba(var(--colors-primary-400));
                animation: indeterminateSecond 1.5s infinite ease-in;
            }
        }

        @keyframes indeterminateFirst {
            0% {
                left: -100%;
                width: 100%;
            }
            100% {
                left: 100%;
                width: 10%;
            }
        }

        @keyframes indeterminateSecond {
            0% {
                left: -150%;
                width: 100%;
            }
            100% {
                left: 100%;
                width: 10%;
            }
        }
    }
}
</style>

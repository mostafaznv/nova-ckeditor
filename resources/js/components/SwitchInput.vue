<template>
    <div class="switch">
        <input
            @change="onChange"
            type="checkbox"
            :id="id"
            :checked="modelValue"
        />

        <label :for="id">Toggle</label>
    </div>
</template>

<script lang="js" setup>
import {defineEmits, defineProps} from 'vue'


// emits
const emit = defineEmits([
    'update:modelValue'
])


// variables
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    id: {
        type: [Number, String],
        default() {
            return Math.random().toString(36).slice(2, 11)
        }
    }
})


// methods
function onChange(e) {
    emit('update:modelValue', e.target.checked)
}
</script>

<style lang="scss" scoped>
.switch {
    display: flex;
    align-items: center;


    input[type=checkbox] {
        height: 0;
        width: 0;
        visibility: hidden;

        &:checked + label {
            background: rgba(var(--colors-primary-500));
        }

        &:checked + label:after {
            left: calc(100% - 2px);
            transform: translateX(-100%);
        }
    }

    label {
        cursor: pointer;
        text-indent: -9999px;
        width: 35px;
        height: 20px;
        background: rgba(var(--colors-gray-300));
        display: block;
        border-radius: 25px;
        position: relative;

        &:after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            transition: 0.3s;
        }

        /*&:active:after {
            width: 50px;
        }*/
    }
}
</style>

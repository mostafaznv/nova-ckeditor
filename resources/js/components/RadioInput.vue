<template>
    <div class="radio-container">
        <label v-for="option in options" class="radio text-gray-600 dark:text-gray-500" :key="option.value">
            {{ option.label }}

            <input
                @change="onChange"
                type="radio"
                :name="name"
                :value="option.value"
                :checked="option.value === checked"
            >

            <span class="check"></span>
        </label>
    </div>
</template>

<script lang="js" setup>
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
    name: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    checked: {
        type: String,
        default: ''
    }
})


// methods
function onChange(e) {
    emit('update:modelValue', e.target.value)
}
</script>

<style lang="scss" scoped>
.radio-container {
    .radio {
        display: flex;
        position: relative;
        align-items: center;
        padding-left: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        user-select: none;

        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;

            &:checked ~ .check {
                background-color: rgba(var(--colors-primary-500));

                &:after {
                    display: block;
                }
            }
        }

        .check {
            position: absolute;
            top: 0;
            left: 0;
            height: 16px;
            width: 16px;
            background-color: rgba(var(--colors-gray-300));
            border-radius: 50%;
            transition: all 300ms;

            &:after {
                position: absolute;
                display: none;
                top: 5px;
                left: 5px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: white;
                content: "";
            }
        }

        &:hover input:not(:checked) ~ .check {
            background-color: rgba(var(--colors-gray-200));
        }
    }
}

[dir=rtl] {
    .radio {
        padding-right: 20px;
        padding-left: 0;

        .check {
            right: 0;
            left: auto;
        }
    }
}
</style>

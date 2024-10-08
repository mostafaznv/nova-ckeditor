<template>
    <div class="browser-list bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-600">
        <div
            v-for="(snippet, key) in snippets"
            @click="select(key)"
            class="browser-list__item text-gray-500 dark:text-gray-200"
            :class="{selected: modelValue.name === snippet.name}"
            :key="snippet.name"
        >
                <span class="browser-list__item--icon bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    {{ snippet.name.split(' ').map(name => name[0]).join('') }}
                </span>

            <span class="browser-list__item--name">{{ __(snippet.name) }}</span>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from "vue"


// emits
const emit = defineEmits([
    'update:modelValue',
])


// variables
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    },
    snippets: {
        type: Array,
        default: () => ([])
    },
})

const selected = ref(0)



// watchers
watch(
    () => selected.value,
    (value) => {
        emit('update:modelValue', props.snippets[value])
    },
    {immediate: true}
)



// methods
function select(key) {
   selected.value = key
}
</script>

<style lang="scss" scoped>
.browser-list {
    min-width: 200px;

    &__item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 14px;
        height: 48px;
        font-size: 14px;
        padding: 0 16px;
        transition: all 300ms, border-left-width 100ms;
        cursor: pointer;

        &--icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            font-weight: 600;
            transition: all 300ms;
        }

        &:hover {
            background: rgba(var(--colors-gray-300));
            color: rgba(var(--colors-gray-700));

            svg {
                fill: rgba(var(--colors-gray-800));
            }
        }

        &.selected {
            .browser-list__item--icon {
                background: rgba(var(--colors-primary-500));
                color: rgba(var(--colors-white));
            }
        }
    }

    @media (max-width: 800px) {
        min-width: 66px;
        max-width: 66px;

        &__item {
            &--name {
                display: none;
            }
        }
    }
}

[dir=rtl] {
    .browser-list {
        border-right: none;
        border-left: solid 1px rgba(var(--colors-gray-100));

        &__item {
            &.selected {
                border-left: none;
                border-right: solid 4px rgba(var(--colors-primary-500));
            }
        }
    }
}
</style>

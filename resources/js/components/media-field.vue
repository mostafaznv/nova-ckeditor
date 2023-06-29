<template>
    <default-field :field="field" :errors="errors">
        <template #field>
            <template v-if="preview">
                <v-lazy-image
                    class="shadow-md rounded mb-4 block"
                    :src="preview"
                    :src-placeholder="$options.spinner"
                    :style="{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: `${field.form_width}px`,
                        maxHeight: `${field.form_height}px`
                    }"
                />

                <button type="button" class="btn btn-default btn-primary inline-flex items-center relative" @click.prevent="clearSelected">
                    <span>{{ __('Remove') }}</span>
                </button>
            </template>

            <button v-else type="button" @click.prevent="openBrowser" class="btn btn-default btn-primary inline-flex items-center relative">
                <span>{{ __('Select') }}</span>
            </button>

            <p v-if="hasError" class="my-2 text-danger">{{ firstError }}</p>

            <media-browser :field-key="$options.uuid" :multiple="false" />
        </template>
    </default-field>
</template>

<script>
import spinner from './../assets/spinner'
import MediaBrowser from "./media-browser"
import HasUUID from "./mixins/hasUUID"
import interactsWithResources from "./mixins/interactsWithResources"
import {FormField, HandlesValidationErrors} from 'laravel-nova'
import VLazyImage from "v-lazy-image"

export default {
    mixins: [FormField, HandlesValidationErrors, interactsWithResources, HasUUID],
    props: ['resourceName', 'resourceId', 'field'],
    components: {
        MediaBrowser,
        VLazyImage
    },
    data: () => ({
        preview: null
    }),
    computed: {
        event() {
            return `ckeditor:media:${this.$options.uuid}`
        }
    },
    methods: {
        setInitialValue() {
            this.value = this.field.value || null

            if (this.field.value) {
                this.fetchResourceEntity('media', this.field.value).then(({url}) => {
                    this.preview = url
                })
            }
        },

        fill(formData) {
            formData.append(this.field.attribute, this.value || '')
        },

        handleChange(selected) {
            this.value = selected.id
            this.preview = selected.url
        },

        clearSelected() {
            this.value = null
            this.preview = null
        },

        openBrowser() {
            Nova.$emit(this.event)
        },
    },
    created() {
        this.$options.spinner = spinner
        this.$options.uuid = this.uuid()
        Nova.$on(`${this.event}:write`, this.handleChange)
    },
    beforeDestroy() {
        Nova.$off(`${this.event}:write`, this.handleChange)
    }
}
</script>

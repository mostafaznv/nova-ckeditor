<template>
    <div>
        <v-lazy-image
            v-if="preview"
            class="shadow-md rounded m-2 block"
            :src="preview"
            :src-placeholder="$options.spinner"
            :style="{
                width: 'auto',
                height: 'auto',
                maxWidth: `${field.index_width}px`,
                maxHeight: `${field.index_height}px`
            }"
        />
    </div>
</template>

<script>
import spinner from './../assets/spinner'
import interactsWithResources from "./mixins/interactsWithResources"
import VLazyImage from "v-lazy-image"

export default {
    mixins: [interactsWithResources],
    props: ['resourceName', 'field'],
    components: {
        VLazyImage
    },
    data: () => ({
        preview: null
    }),
    beforeCreate() {
        this.$options.spinner = spinner
    },
    created() {
        if (this.field.value) {
            this.fetchResourceEntity('media', this.field.value).then(({url}) => {
                this.preview = url
            })
        }
    },
}
</script>

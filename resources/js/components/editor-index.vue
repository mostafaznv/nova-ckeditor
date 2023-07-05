<template>
    <div v-html="value"></div>
</template>

<script>
export default {
    props: ['resourceName', 'field'],
    computed: {
        value() {
            if (this.field.value) {
                let value = this.field.value
                    .replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ')
                    .replace(/(<([^>]+)>)/gi, '')

                if (value.length <= this.field.indexLimit) {
                    return value
                }

                return value.substring(0, this.field.indexLimit) + '...'
            }

            return ''
        }
    }
}
</script>

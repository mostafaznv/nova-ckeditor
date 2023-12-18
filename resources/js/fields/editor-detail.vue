<template>
    <panel-item :field="field">
        <template #value>
            <div class="ckeditor_content">
                <excerpt :content="field.value" :should-show="field.shouldShow" :plain-text="false"/>
            </div>
        </template>
    </panel-item>
</template>

<script>
export default {
    props: ['resource', 'resourceName', 'resourceId', 'field']
}
</script>

<style lang="sass">
.ckeditor_content
    @import "./../../sass/figures.sass"
    @import "./../../sass/blocks.sass"
</style>


export const hasLaruploadTraitProp = {
    type: Boolean,
    required: true
}

export const keywordProp = {
    type: String,
    default: ''
}

export const orderByProp = {
    type: String,
    default: 'id',
    validator(value) {
        return ['id', 'name', 'width', 'height', 'size', 'duration', 'created_at', 'updated_at'].includes(value)
    }
}

export const sortProp = {
    type: String,
    default: 'desc',
    validator(value) {
        return ['asc', 'desc'].includes(value)
    }
}

export const paginationProp = {
    type: Object,
    default: {}
}

export const keepAspectRatioProp = {
    type: Boolean,
    default: false
}

export const typeProp = {
    type: String,
    required: true,
    validator(value) {
        return ['image', 'video', 'audio'].includes(value)
    }
}

export const selectedItemsProp = {
    type: Array,
    default: () => []
}

export const gallerySizeProp = {
    type: Number,
    default: 180
}

export const loadingProp = {
    type: Boolean,
    default: false
}

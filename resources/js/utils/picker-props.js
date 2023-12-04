const props = {
    page: {
        type: Number,
        default: 1
    },
    hasLaruploadTrait: {
        type: Boolean,
        required: true
    },
    keyword: {
        type: String,
        default: ''
    },
    orderBy: {
        type: String,
        default: 'id',
        validator(value) {
            return ['id', 'name', 'width', 'height', 'size'].includes(value)
        }
    },
    sort: {
        type: String,
        default: 'desc',
        validator(value) {
            return ['asc', 'desc'].includes(value)
        }
    },
    pagination: {
        type: Object,
        default: {}
    }
}

export default props

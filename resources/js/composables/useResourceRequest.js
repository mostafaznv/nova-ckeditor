import {ref, watch} from "vue"
import {useLocalization} from 'laravel-nova'
import {resourceToObject} from "../utils/helpers"


export default function useResourceRequest(emits) {
    // composables
    const {__} = useLocalization()


    // variables
    const pagination = ref({
        total: null,
        totalPages: 1,
        perPage: null,
        perPageOptions: [],
        hasNextPage: false,
        hasPrevPage: false
    })


    // watchers
    watch(
        () => pagination.value,
        (pagination) => {
            emits('update:pagination', pagination)
        },
        {immediate: true}
    )


    /**
     * Fetch Resource List
     * @param resourceKey {String}
     * @param params {Object}
     * @return {Promise<Array>}
     */
    async function fetchResourceList(resourceKey, params) {
        return await Nova.request()
            .get(`/nova-api/${resourceKey}`, {params})
            .then(({data}) => {
                const items = data.resources.map((resource) => resourceToObject(resource))

                pagination.value = {
                    total: data.total,
                    totalPages: Math.ceil(data.total / data.per_page),
                    perPage: data.per_page,
                    perPageOptions: data.per_page_options,
                    hasNextPage: !!data.next_page_url,
                    hasPrevPage: !!data.prev_page_url
                }

                return items
            })
            .catch(error)
    }


    /**
     * Toast Error Message
     * @param error {Error}
     * @return void
     */
    function error(error) {
        Nova.error(__(':message', {message: error}))
    }


    return {
        pagination, fetchResourceList
    }
}





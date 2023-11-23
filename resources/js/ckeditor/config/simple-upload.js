export default {
    simpleUpload: {
        withCredentials: true,

        uploadUrl: '/nova-vendor/nova-ckeditor/image',

        headers: {
            'X-CSRF-TOKEN': Nova.request().defaults.headers.common['X-CSRF-TOKEN']
        }
    }
}

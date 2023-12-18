import {useLocalization} from 'laravel-nova'


export function useClipboard() {
    const {__} = useLocalization()


    async function copyToClipboard(text) {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text)

            Nova.success(__('Copied to clipboard'))
        }
        else {
            Nova.error(__('Clipboard is not available'))
        }
    }

    async function readClipboard() {
        if (navigator.clipboard) {
            return await navigator.clipboard.readText()
        }
        else {
            Nova.error(__('Clipboard is not available'))
        }
    }


    return {
        copyToClipboard,
        readClipboard
    }
}

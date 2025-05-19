// Imports
import {
    toasts,
    ToastContainer as ToastContainerAny,
    FlatToast as FlatToastAny
} from 'svelte-toasts';
import { theme } from "$lib/stores/store.svelte"

// Functions
const showToast = (title: string, body: string, duration: number, type: string) => {
    const toast = toasts.add({
        title: title,
        description: body,
        duration: duration,
        placement: 'bottom-right',
        //@ts-ignore
        type: 'info',
        //@ts-ignore
        placement: 'bottom-right',
        showProgress: true,
        //@ts-ignore
        type: type,
        //@ts-ignore
        theme: theme.value ? "light" : "dark",
        onClick: () => { },
        onRemove: () => { }
    });
};

export { showToast };

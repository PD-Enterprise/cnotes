// Imports
import {
    toasts,
    ToastContainer as ToastContainerAny,
    FlatToast as FlatToastAny
} from 'svelte-toasts';
import { theme } from "$lib/stores/theme"

// Functions
const showToast = (title: string, body: string, duration: number, type: string) => {
    theme.subscribe((value) => {
        const toast = toasts.add({
            title: title,
            description: body,
            duration: duration,
            placement: 'bottom-right',
            //@ts-ignore
            type: 'info',
            theme: 'dark',
            //@ts-ignore
            placement: 'bottom-right',
            showProgress: true,
            //@ts-ignore
            type: type,
            //@ts-ignore
            theme: value ? "light" : "dark",
            onClick: () => { },
            onRemove: () => { }
        });
    });
};

export { showToast };

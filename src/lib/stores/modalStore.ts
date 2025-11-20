
import { writable } from 'svelte/store';

interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

const initialModalState: ModalState = {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
};

function createModalStore() {
    const { subscribe, set, update } = writable<ModalState>(initialModalState);

    return {
        subscribe,
        open: (title: string, message: string, onConfirm: () => void) => {
            set({ isOpen: true, title, message, onConfirm });
        },
        close: () => {
            set(initialModalState);
        },
    };
}

export const modalStore = createModalStore();

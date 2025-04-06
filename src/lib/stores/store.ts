import { writable } from 'svelte/store';
import type { note, userType } from '../../routes/types';

export let theme = writable(false);
export let showModal = writable(false);
export const notesStore = writable<note[]>([]);
export let isChanged = writable(false);
export let autoLogin = writable(false);

// Auth
export const auth0Client = writable(null);
export const isAuthenticated = writable(false);
export const user = writable({});
export const popupOpen = writable(false);
export const error = writable();
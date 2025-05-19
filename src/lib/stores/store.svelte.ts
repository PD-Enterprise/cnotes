import { writable } from 'svelte/store';
import type { note, userType } from '../../routes/types';

// Theme and UI state
export const theme = $state({ value: false });
export const showModal = $state(false);
export const notesStore = $state<{ value: note[] }>({ value: [] });
export const isChanged = $state({ value: false });
export const autoLogin = $state({ value: false });

// Auth state
export const auth0Client = writable(null)
export const isAuthenticated = writable(null)
export const user = $state({ value: {} });
export const popupOpen = $state({ value: false });
export const error = $state(null);
import { writable } from 'svelte/store';
import type { note, userType } from '../../routes/types';
import type { Auth0Client } from '@auth0/auth0-spa-js';

// Theme and UI state
export const theme = $state({ value: false });
export const showModal = $state(false);
export const notesStore = $state<{ value: note[] }>({ value: [] });
export const isChanged = $state({ value: false });
export const autoLogin = $state({ value: false });

// Auth state
export const isAuthenticated = $state({ value: false });
export const error = $state(null);

export const sync = writable(false);
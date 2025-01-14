import { writable } from 'svelte/store';
import type { note } from '../../routes/types';

export const notesStore = writable<note[]>([]);

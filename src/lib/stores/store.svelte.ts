
import { writable } from 'svelte/store';
import type { Editor } from '@tiptap/core';
import type { note } from 'src/routes/types';

export const editor = writable<Editor>();

export const EditorNoteData = writable({
	content: ''
});


export const notesStore = writable<note[]>([]);

export const isStudyModeActive = writable(false);

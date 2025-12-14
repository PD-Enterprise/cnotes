import { writable } from 'svelte/store';
import type { note, searchResult } from '../../routes/types';
import { Editor } from '@tiptap/core';

// Theme and UI state
export const theme = $state({ value: false });
export const showModal = $state(false);
export const notesStore = $state<{ value: note[] }>({ value: [] });
export const isChanged = $state({ value: false });
export const autoLogin = $state({ value: false });

// Search and Filter state
export const searchQuery = $state({ value: '' });
export const selectedAcademicLevel = $state({ value: 'all' });
export const selectedTopic = $state({ value: 'all' });
export const selectedSort = $state({ value: 'title' });
export const searchResults = $state<{ value: searchResult[] }>({ value: [] });

// Auth state
export const isAuthenticated = $state({ value: false });
export const error = $state(null);
export const sync = writable(false);

// Editor state
export const editorState = $state<{ editor: Editor | null }>({ editor: null });
export const EditorNoteData = $state<{ value: note }>({
	value: {
		title: '',
		dateCreated: '',
		academicLevel: undefined,
		topic: '',
		content: '',
		slug: '',
		type: '',
		visibility: '',
		year: '',
		language: '',
		keywords: ''
	}
});

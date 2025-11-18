import { notebooksStore, type Notebook } from '$lib/stores/store.svelte';
import { notesStore } from '$lib/stores/store.svelte';

const NOTEBOOKS_STORAGE_KEY = 'cnotes-notebooks';

export function loadNotebooksFromLocalStorage() {
	if (typeof window !== 'undefined') {
		const storedNotebooks = localStorage.getItem(NOTEBOOKS_STORAGE_KEY);
		if (storedNotebooks) {
			notebooksStore.value = JSON.parse(storedNotebooks);
		}
	}
}

function saveNotebooksToLocalStorage() {
	if (typeof window !== 'undefined') {
		localStorage.setItem(NOTEBOOKS_STORAGE_KEY, JSON.stringify(notebooksStore.value));
	}
}

export function createNotebook(name: string) {
	const newNotebook: Notebook = {
		id: crypto.randomUUID(),
		name,
		noteSlugs: []
	};
	notebooksStore.value = [...notebooksStore.value, newNotebook];
	saveNotebooksToLocalStorage();
}

export function renameNotebook(notebookId: string, newName: string) {
	const notebook = notebooksStore.value.find((nb) => nb.id === notebookId);
	if (notebook) {
		notebook.name = newName;
		notebooksStore.value = [...notebooksStore.value]; // Trigger reactivity
		saveNotebooksToLocalStorage();
	}
}

export function deleteNotebook(notebookId: string) {
	notebooksStore.value = notebooksStore.value.filter((nb) => nb.id !== notebookId);
	saveNotebooksToLocalStorage();
}

export function removeNoteFromNotebooks(noteSlug: string) {
	notebooksStore.value.forEach((nb) => {
		nb.noteSlugs = nb.noteSlugs.filter((slug) => slug !== noteSlug);
	});
	notebooksStore.value = [...notebooksStore.value]; // Trigger reactivity
	saveNotebooksToLocalStorage();
}

export function addNoteToNotebook(noteSlug: string, notebookId: string) {
	const notebook = notebooksStore.value.find((nb) => nb.id === notebookId);
	if (notebook && !notebook.noteSlugs.includes(noteSlug)) {
		// Remove from any other notebook first
		notebooksStore.value.forEach((nb) => {
			nb.noteSlugs = nb.noteSlugs.filter((slug) => slug !== noteSlug);
		});

		// Add to the new notebook
		notebook.noteSlugs.push(noteSlug);
		notebooksStore.value = [...notebooksStore.value]; // Trigger reactivity
		saveNotebooksToLocalStorage();
	}
}

export function getNotebookNotes(notebookId: string) {
	const notebook = notebooksStore.value.find((nb) => nb.id === notebookId);
	return notebook ? notesStore.value.filter((note) => notebook.noteSlugs.includes(note.slug)) : [];
}
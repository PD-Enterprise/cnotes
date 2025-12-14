<script lang="ts">
	// Imports
	import { onDestroy, onMount } from 'svelte';
	import type { note, searchResult } from './types';
	import { notesStore } from '$lib/stores/store.svelte';
	import Note from './components/note.svelte';
	import { getFilteredAndSortedNotes } from '$lib/utils/getFilteredAndSortedNotes';

	// Variables
	let errorMessage: string = $state('');
	let loadingTimeout;
	let localNotes: note[] = [];
	let hasLocalNotes = false;
	let data = $props();

	// Functions
	async function getNotesFromLocalStorage() {
		let tempNotes: note[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith('note:')) {
				hasLocalNotes = true;
				const encodedData = localStorage.getItem(key);
				let noteData: any;
				try {
					const decodedString = atob(encodedData || '');
					const uint8Array = new Uint8Array([...decodedString].map((c) => c.charCodeAt(0)));
					noteData = JSON.parse(new TextDecoder().decode(uint8Array));
				} catch (e) {
					try {
						noteData = JSON.parse(encodedData || '{}');
					} catch {
						continue;
					}
				}
				tempNotes.push(noteData);
			}
		}
		// Sort notes by date (latest first)
		localNotes = tempNotes.sort((a, b) => {
			const dateA = new Date(a.dateCreated || 0).getTime();
			const dateB = new Date(b.dateCreated || 0).getTime();
			return dateB - dateA;
		});
		if (hasLocalNotes) {
			notesStore.value = localNotes;
		}
	}
	async function getNotes() {
		const response = await fetch('/', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();

		// Remove notes from localStorage that are not present in the server version
		if (result.data && Array.isArray(result.data)) {
			const serverSlugs = new Set(result.data.map((note) => note.slug));
			let changed = false;
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key?.startsWith('note:')) {
					const slug = key.slice(5);
					if (!serverSlugs.has(slug)) {
						localStorage.removeItem(key);
						changed = true;
					}
				}
			}
			// Update notesStore to immediately reflect the change
			if (changed) {
				const updatedNotes = notesStore.value.filter((note) => serverSlugs.has(note.slug));
				notesStore.value = updatedNotes;
			}
		}

		if (result.status == 401) {
			errorMessage = 'You are not logged in. Please login to continue.';
			return;
		}

		if (result.data && result.data != undefined && result.data.length > 0) {
			const serverNotes: note[] = result.data.sort((a, b) => {
				const dateA = new Date(a.dateCreated || 0).getTime();
				const dateB = new Date(b.dateCreated || 0).getTime();
				return dateB - dateA;
			});
			notesStore.value = serverNotes;
			persistNotesInLocalStorage();
		}
	}
	async function persistNotesInLocalStorage() {
		for (const note of notesStore.value) {
			const encryptedNote = btoa(
				String.fromCharCode(...new TextEncoder().encode(JSON.stringify(note)))
			);
			localStorage.setItem(`note:${note.slug}`, encryptedNote);
		}
	}
	onMount(() => {
		if (data.data.session) {
			getNotesFromLocalStorage();
			getNotes();
		}
	});
	onDestroy(() => {
		clearTimeout(loadingTimeout);
	});
</script>

<div class="main">
	<div class="notes overflow-y-scroll p-3">
		{#if notesStore.value && notesStore.value.length > 0}
			<div class="notes-grid mb-17">
				{#each getFilteredAndSortedNotes(notesStore) as note}
					<Note {note} auth={data.data.session} />
				{/each}
			</div>
		{:else if errorMessage}
			<p class="errorMessage">{errorMessage}</p>
		{:else}
			<p class="loadingNotes">No notes found.</p>
		{/if}
	</div>
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	.notes {
		height: 100%;
	}
	.notes-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
	}
	@media (max-width: 600px) {
		.notes-grid {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
		}
	}
</style>

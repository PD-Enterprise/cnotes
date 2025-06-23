<script lang="ts">
	// Imports
	import { onMount, onDestroy } from 'svelte';
	import type { note, searchResult } from '../types';
	import Note from '../components/note.svelte';
	import { notesStore, user } from '../../lib/stores/store.svelte';
	import config from '$lib/utils/apiConfig';
	import { isAuthenticated } from '../../lib/stores/store.svelte';

	// Variables
	let error: string = $state('');
	let searchQuery: string = $state('');
	let searchResults: searchResult[] = $state();
	let shouldShowSearchResults: boolean = $state(false);
	let isDataInconsistent: boolean = $state(false);
	let loadingTimeout;
	// let userEmail: string;

	// Functions
	/**
	 * Fetches notes from localStorage and, if a user is present, synchronizes with the server.
	 * Documents each line of code for clarity.
	 */
	async function getNotes() {
		// Initialize a flag to check if any notes exist in localStorage
		let hasNotes = false;
		// Create an array to store notes loaded from localStorage
		const notes = [];
		// Iterate over all keys in localStorage
		for (let i = 0; i < localStorage.length; i++) {
			// Get the key at the current index
			const key = localStorage.key(i);
			// Check if the key starts with 'note:'
			if (key?.startsWith('note:')) {
				// Set the flag to true since a note was found
				hasNotes = true;
				const encodedData = localStorage.getItem(key);
				let noteData;
				try {
					// Decode using the same method as server notes
					const decodedString = atob(encodedData || '');
					const uint8Array = new Uint8Array([...decodedString].map((c) => c.charCodeAt(0)));
					noteData = JSON.parse(new TextDecoder().decode(uint8Array));
				} catch (e) {
					// Fallback for any notes that might be stored in the old format
					noteData = JSON.parse(encodedData || '{}');
				}
				// Add the note data to the notes array
				notes.push(noteData);
			}
		}
		// If any notes were found in localStorage
		if (hasNotes) {
			// Update the notesStore with the loaded notes
			notesStore.value = notes;
			// // console.log('notes:', notes);
		}
		// // console.log(JSON.parse(atob(localStorage.getItem('user'))));
		// Check if a user is present in localStorage
		if (JSON.parse(atob(localStorage.getItem('user')))) {
			// console.log(user.value);
			try {
				// Send a POST request to the server to fetch notes for the user
				const request = await fetch(`${config.apiUrl}notes/notes`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					// Include the user's email in the request body
					body: JSON.stringify({
						email: JSON.parse(atob(localStorage.getItem('user'))).email
					})
				});
				// Parse the server's response as JSON
				const result = await request.json();
				// console.log(result);
				// If the server responded with a success status
				if (result.status == 200) {
					// Extract the notes array from the server response
					const serverNotes: note[] = result.data;
					// // console.log(serverNotes);
					// Create a set of slugs from the server notes
					const serverNoteSlugs = new Set(serverNotes.map((n) => n.slug));
					// Create a set of slugs from the local notes
					const localNoteSlugs = new Set(notesStore.value.map((n) => n.slug));

					// Check if the sets of slugs are equal (same notes on server and local)
					const areEqual =
						serverNoteSlugs.size === localNoteSlugs.size &&
						[...serverNoteSlugs].every((slug) => localNoteSlugs.has(slug));

					// If the sets are not equal, there is data inconsistency
					if (!areEqual) {
						// Set the inconsistency flag to true
						isDataInconsistent = true;
						// Remove local notes that are not present on the server
						for (const slug of localNoteSlugs) {
							if (!serverNoteSlugs.has(slug)) {
								localStorage.removeItem(`note:${slug}`);
							}
						}
					}
					// For each note from the server
					for (let i = 0; i < serverNotes.length; i++) {
						// // console.log(serverNotes[i]);
						// Encrypt the note as a base64 string
						const encryptedNote = btoa(
							String.fromCharCode(...new TextEncoder().encode(JSON.stringify(serverNotes[i])))
						);
						// // console.log(encryptedNote);
						// Create an object with the key and value for localStorage
						const storableNote: { key: string; value: string } = {
							key: `note:${serverNotes[i].slug}`,
							value: encryptedNote
						};
						// Store the encrypted note in localStorage
						localStorage.setItem(storableNote.key, storableNote.value);
					}

					// Reload notes from localStorage after updating
					const notes = [];
					for (let i = 0; i < localStorage.length; i++) {
						// Get the key at the current index
						const key = localStorage.key(i);
						// Check if the key starts with 'note:'
						if (key?.startsWith('note:')) {
							// Set the flag to true since a note was found
							hasNotes = true;
							const encodedData = localStorage.getItem(key);
							let noteData;
							try {
								// Decode using the same method as server notes
								const decodedString = atob(encodedData || '');
								const uint8Array = new Uint8Array([...decodedString].map((c) => c.charCodeAt(0)));
								noteData = JSON.parse(new TextDecoder().decode(uint8Array));
							} catch (e) {
								// Fallback for any notes that might be stored in the old format
								noteData = JSON.parse(encodedData || '{}');
							}
							// Add the note data to the notes array
							notes.push(noteData);
						}
					}
					// If any notes were found after syncing
					if (hasNotes) {
						// Update the notesStore with the refreshed notes
						notesStore.value = notes;
					}
					// // console.log('notesStore: ', notesStore.value);
				} else {
					// Log an error if the server did not return a success status
					console.error('Fetch call returned with status:', result.status);
				}
			} catch (error) {
				// Log any errors that occurred during the fetch or processing
				console.error('There was an error.', error);
			}
		}
	}
	onMount(() => {
		// 	userEmail = JSON.parse(atob(localStorage.getItem('user'))).email;
		// console.log(userEmail);
		getNotes();
		// Add click event listener to document to hide search results when clicking outside
		document.addEventListener('click', (event) => {
			const searchBar = document.querySelector('.search-bar');
			if (searchBar && !searchBar.contains(event.target as Node)) {
				shouldShowSearchResults = false;
			}
		});
		loadingTimeout = setTimeout(() => {
			if (!notesStore.value || notesStore.value.length === 0) {
				if (!localStorage.getItem('hasReloaded')) {
					localStorage.setItem('hasReloaded', 'true');
					location.reload();
				} else {
					error = `No notes found. Try reloading the page.`;
					localStorage.removeItem('hasReloaded');
				}
			}
		}, 5000);
	});
	onDestroy(() => {
		clearTimeout(loadingTimeout);
	});
	function search() {
		// console.log(searchQuery);
		if (searchQuery.length > 0 && notesStore.value) {
			shouldShowSearchResults = true;
			setTimeout(() => {
				const matches = notesStore.value
					.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
					.map((note) => ({
						title: note.title,
						slug: note.slug
					}));
				searchResults = matches;
				console.log(searchResults);
			}, 500);
		} else {
			shouldShowSearchResults = false;
			searchResults = [];
		}
	}
	$effect(() => {
		search();
	});
</script>

<div class="main p-2">
	<div class="header flex gap-3 p-1">
		<div class="search-bar grow rounded-md bg-base-200 p-2">
			<label class="flex items-center gap-2 rounded-md border border-base-content p-1">
				<input
					type="text"
					class="search-input grow rounded-md bg-transparent"
					placeholder="Search for a note"
					bind:value={searchQuery}
				/>

				<button
					onclick={search}
					class="search-button btn btn-circle border border-base-content bg-base-100 hover:bg-base-300"
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-7"
					>
						<path
							fill-rule="evenodd"
							d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</label>
			{#if shouldShowSearchResults}
				<div class="search-results mt-2 flex flex-col gap-2 rounded-md bg-base-100 p-2">
					{#if searchResults.length > 0}
						{#each searchResults as searchResult}
							<a
								href={`#${searchResult.slug}`}
								tabindex="0"
								onclick={() => {
									event.preventDefault();
									document.getElementById(searchResult.slug).focus();
								}}
							>
								<p class="text-lg font-bold">
									{searchResult.title}
								</p>
							</a>
							{#if searchResults.length > 1}
								<hr />
							{/if}
						{/each}
					{:else}
						<p>No notes found.</p>
					{/if}
				</div>
			{/if}
		</div>
		<div class="add-note">
			<a class="addNoteButton btn border border-base-content bg-accent" href="/home/new-note"
				>New Note</a
			>
		</div>
	</div>
	<div class="notes h-auto p-5">
		{#if error}
			<p class="error">{error}</p>
		{:else if notesStore.value && notesStore.value.length > 0}
			<div class="notes-grid">
				{#each notesStore.value as note}
					<Note {note} />
				{/each}
			</div>
		{:else}
			<p class="loadingNotes">Loading your Notes...</p>
		{/if}
	</div>
</div>

<style>
	.header {
		justify-content: space-between;
		align-items: center;
	}
	.search-bar {
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-bar:hover {
		box-shadow: 0 6px 15px rgba(77, 96, 116, 0.5);
		transform: translateY(-2px);
	}
	.search-input {
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}
	.search-button {
		border-radius: 6px;
		cursor: pointer;
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-button:hover {
		transform: scale(1.05);
	}
	.search-results {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-results a:hover {
		transform: translateY(-3px);
	}
	.notes-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
	}
	/* Add Note button styles moved to the left for cleaner layout */
	.addNoteButton {
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.addNoteButton:hover {
		transform: translateY(-1px) scale(1.025);
	}
</style>

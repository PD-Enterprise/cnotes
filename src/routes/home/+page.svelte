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
				// Decode and parse the note data from localStorage
				const noteData = JSON.parse(atob(localStorage.getItem(key)) || '{}');
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
							// Decode and parse the note data from localStorage
							const noteData = JSON.parse(atob(localStorage.getItem(key)) || '{}');
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
		// 	if (searchQuery.length > 0 && notes.value) {
		// 		shouldShowSearchResults = true;
		// 		const matches = notes.value
		// 			.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
		// 			.map((note) => ({
		// 				title: note.title,
		// 				slug: note.slug
		// 			}));
		// 		searchResults = matches;
		// 	} else {
		// 		shouldShowSearchResults = false;
		// 		searchResults = [];
		// 	}
	}
	function handleKeyDown(event: any) {
		search();
	}
</script>

<div class="main">
	<div class="header gap-3 p-1">
		<div class="search-bar grow">
			<label class="input-bordered input flex items-center gap-2 p-2">
				<input
					type="text"
					class="search-input grow"
					placeholder="Search for a note"
					onkeydown={handleKeyDown}
					bind:value={searchQuery}
				/>

				<button onclick={search} class="search-button btn btn-ghost btn-circle" aria-label="Search">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70"
					>
						<path
							fill-rule="evenodd"
							d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</label>
			<!--
			{#if shouldShowSearchResults}
				<div class="search-results mt-2 p-2">
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
							<hr />
						{/each}
					{:else}
						<p>No notes found.</p>
					{/if}
				</div>
			{/if}
			-->
		</div>
		<div class="add-note">
			<a class="addNoteButton btn bg-accent" href="/home/new-note">New Note</a>
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
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	/* Search bar styles with gradient and smooth animations */
	.search-bar {
		border-radius: 10px;
		transition:
			box-shadow 0.4s ease,
			transform 0.4s ease;
	}
	.search-bar:hover {
		box-shadow: 0 6px 15px rgba(77, 96, 116, 0.5);
		transform: translateY(-2px);
	}
	/* Input styles */
	.search-input {
		width: 100%;
		padding: 10px;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		color: #fff;
		outline: none;
		transition: background 0.3s ease;
	}
	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}
	/* Button styles with simpler gradient and animations */
	.search-button {
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
		transition:
			transform 0.4s ease,
			background-color 0.4s ease;
	}
	.search-button:hover {
		transform: scale(1.05);
	}
	.notes-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
	}
	/* Add Note button styles moved to the left for cleaner layout */
	.addNoteButton {
		border: none;
		border-radius: 8px;
		padding: 12px 20px;
		font-size: 16px;
		cursor: pointer;
		transition:
			transform 0.4s ease,
			background 0.4s ease;
		margin-right: 10px;
	}
	.addNoteButton:hover {
		transform: translateY(-3px);
		background-color: var(--fallback-a, oklch(var(--a) / var(--tw-bg-opacity, 1)));
	}
	/* Search results container with smoother animations */
	/* .search-results {
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 10px;
		margin-top: 10px;
		transform: translateY(-5px);
	} 
	*/
</style>

<script lang="ts">
	// Imports
	import { onMount, onDestroy } from 'svelte';
	import type { note, searchResult } from '../types';
	import Note from '../components/note.svelte';
	import { notesStore } from '../../lib/stores/store.svelte';

	// Variables
	let error: string = $state('');
	let searchQuery: string = $state('');
	let searchResults: searchResult[] = $state();
	let shouldShowSearchResults: boolean = $state(false);
	let loadingTimeout;
	// let userEmail: string;

	// Functions
	async function getNotes() {
		let hasNotes = false;
		const notes = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith('note:')) {
				hasNotes = true;
				const noteData = JSON.parse(atob(localStorage.getItem(key)) || '{}');
				notes.push(noteData);
			}
		}
		if (hasNotes) {
			notesStore.value = notes;
			console.log(notes);
		}
		// 	// console.log(isAuthenticated.value);
		// 	if (!$isAuthenticated) {
		// 		return;
		// 	}
		// 	try {
		// 		// console.log('Fetching from server...');
		// 		const request = await fetch(`${config.apiUrl}notes/notes`, {
		// 			method: 'POST',
		// 			headers: {
		// 				'Content-Type': 'application/json'
		// 			},
		// 			body: JSON.stringify({
		// 				email: userEmail
		// 			})
		// 		});
		// 		const result = await request.json();
		// 		if (result.status != 200) {
		// 			error = result.message;
		// 			console.error('Server error:', result.message);
		// 			return;
		// 		}
		// 		// console.log('Server response:', result.data);
		// 		const serverNotes = result.data;
		// 		// Only update if server notes is not empty and different from local
		// 		if (serverNotes.length > 0) {
		// 			// console.log('Updating with server notes:', serverNotes);
		// 			// Update individual note caches
		// 			serverNotes.forEach((note) => {
		// 				localStorage.setItem(`note_${note.slug}`, JSON.stringify(note));
		// 			});
		// 			// Update the index
		// 			localStorage.setItem('notesIndex', JSON.stringify(serverNotes));
		// 			notesStore.value = serverNotes;
		// 		}
		// 	} catch (error) {
		// 		console.error('Error:', error);
		// 		// Fallback to local index
		// 		const localNotesIndex = localStorage.getItem('notesIndex');
		// 		if (localNotesIndex) {
		// 			const parsedNotes = JSON.parse(localNotesIndex);
		// 			const loadedNotes = parsedNotes.map((note) => {
		// 				const cachedNote = localStorage.getItem(`note_${note.slug}`);
		// 				return cachedNote ? JSON.parse(cachedNote) : note;
		// 			});
		// 			notesStore.value = loadedNotes;
		// 		}
		// 	}
	}
	onMount(() => {
		// 	userEmail = JSON.parse(atob(localStorage.getItem('user'))).email;
		// 	// console.log(userEmail);
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
				error = 'No notes found.';
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
			<label class="input input-bordered flex items-center gap-2 p-2">
				<input
					type="text"
					class="search-input grow"
					placeholder="Search for a note"
					onkeydown={handleKeyDown}
					bind:value={searchQuery}
				/>

				<button onclick={search} class="search-button btn btn-circle btn-ghost" aria-label="Search">
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
	<div class="notes p-5">
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
		color: white;
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
	.search-results {
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 10px;
		margin-top: 10px;
		transform: translateY(-5px);
	}
</style>

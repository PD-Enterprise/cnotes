<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { onMount } from 'svelte';
	import SvelteToast from '../components/svelteToast.svelte';
	import type { note, searchResult } from '../types';
	import Note from '../components/note.svelte';
	import { notesStore } from '$lib/stores/noteStore'; // Import the store
	import { onDestroy } from 'svelte';

	// Variables
	let error: string = '';
	let notes: note[] = [];
	let searchQuery: string = '';
	let searchResults: searchResult[];
	let shouldShowSearchResults: boolean = false;
	let loadingTimeout;

	// Subscribe to the store
	notesStore.subscribe((value) => {
		notes = value; // Update local notes variable when store changes
	});

	// Functions
	async function getNotes(userEmail: string) {
		if (userEmail) {
			try {
				// First check and use local storage for the notes list
				const localNotesIndex = localStorage.getItem('notesIndex');
				if (localNotesIndex) {
					const parsedNotes = JSON.parse(localNotesIndex);
					// Load each note from its individual cache
					const loadedNotes = parsedNotes.map((note) => {
						const cachedNote = localStorage.getItem(`note_${note.slug}`);
						return cachedNote ? JSON.parse(cachedNote) : note;
					});
					notesStore.set(loadedNotes);
					notes = loadedNotes;
					console.log('Set notes from localStorage:', loadedNotes);
				}

				// Then fetch from server
				console.log('Fetching from server...');
				const request = await fetch('/api/notes', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						Email: userEmail
					})
				});
				const result = await request.json();
				console.log('Server response:', result);

				if (result.status === 'success') {
					const serverNotes = result.response;
					// Only update if server notes is not empty and different from local
					if (
						serverNotes.length > 0 &&
						JSON.stringify(serverNotes) !== localStorage.getItem('notesIndex')
					) {
						console.log('Updating with server notes:', serverNotes);

						// Update individual note caches
						serverNotes.forEach((note) => {
							localStorage.setItem(`note_${note.slug}`, JSON.stringify(note));
						});

						// Update the index
						localStorage.setItem('notesIndex', JSON.stringify(serverNotes));

						notesStore.set(serverNotes);
						notes = serverNotes;
					}
				} else {
					error = result.message;
					console.error('Server error:', result.message);
				}
			} catch (error) {
				console.error('Error:', error);
				// Fallback to local index
				const localNotesIndex = localStorage.getItem('notesIndex');
				if (localNotesIndex) {
					const parsedNotes = JSON.parse(localNotesIndex);
					const loadedNotes = parsedNotes.map((note) => {
						const cachedNote = localStorage.getItem(`note_${note.slug}`);
						return cachedNote ? JSON.parse(cachedNote) : note;
					});
					notesStore.set(loadedNotes);
					notes = loadedNotes;
				}
			}
		} else {
			showToast('error', 'Please login to view your notes.', 2000, 'error');
		}
	}
	onMount(() => {
		const userEmail = localStorage.getItem('Email');

		// Immediately load from localStorage
		const localNotes = localStorage.getItem('notes');
		if (localNotes) {
			const parsedNotes = JSON.parse(localNotes);
			notesStore.set(parsedNotes);
			notes = parsedNotes;
		}

		// Then fetch updates from server
		getNotes(userEmail);

		// Add click event listener to document to hide search results when clicking outside
		document.addEventListener('click', (event) => {
			const searchBar = document.querySelector('.search-bar');
			if (searchBar && !searchBar.contains(event.target as Node)) {
				shouldShowSearchResults = false;
			}
		});

		loadingTimeout = setTimeout(() => {
			if (notes.length === 0) {
				error = 'No notes found.';
			}
		}, 5000);
	});
	onDestroy(() => {
		clearTimeout(loadingTimeout);
	});
	function search() {
		if (searchQuery.length > 0) {
			shouldShowSearchResults = true;
			// Use filter and map for better performance
			const matches = notes
				.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))
				.map((note) => ({
					title: note.title,
					slug: note.slug
				}));

			searchResults = matches.map((match) => ({
				title: match.title,
				slug: match.slug
			}));
		} else {
			shouldShowSearchResults = false;
			searchResults = null;
		}
	}
	function handleKeyDown(event: any) {
		search();
	}
</script>

<SvelteToast />

<div class="main">
	<div class="header">
		<div class="search-bar mb-5 mt-5 grow pl-5 pr-5">
			<label class="input input-bordered flex items-center gap-2">
				<input
					type="text"
					class="search-input grow"
					placeholder="Search for a note"
					on:keydown={handleKeyDown}
					bind:value={searchQuery}
				/>

				<button
					on:click={search}
					class="search-button btn btn-circle btn-ghost"
					aria-label="Search"
				>
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
			{#if shouldShowSearchResults}
				<div class="search-results mt-2 p-2">
					{#if searchResults.length > 0}
						{#each searchResults as searchResult}
							<a
								href={`#${searchResult.slug}`}
								tabindex="0"
								on:click={() => {
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
		</div>
		<div class="add-note">
			<a class="addNoteButton btn bg-accent" href="/home/add-new-note">New Note</a>
		</div>
	</div>
	<div class="notes p-5">
		{#if error}
			<p class="error">{error}</p>
		{:else if notes.length > 0}
			<div class="notes-grid">
				{#each notes as note}
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
		gap: 15px;
	}
	/* Search bar styles with gradient and smooth animations */
	.search-bar {
		border-radius: 12px;
		padding: 12px;
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

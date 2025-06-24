<script lang="ts">
	// Imports
	import { onMount, onDestroy } from 'svelte';
	import type { note, searchResult } from '../types';
	import Note from '../components/note.svelte';
	import { notesStore, user } from '../../lib/stores/store.svelte';
	import config from '$lib/utils/apiConfig';
	import { isAuthenticated } from '../../lib/stores/store.svelte';
	import Icon from '@iconify/svelte';

	// Variables
	let error: string = $state('');
	let searchQuery: string = $state('');
	let shouldShowSearchResults: boolean = $state(false);
	let searchResults: searchResult[] = $state();
	let shouldShowFilterMenu: boolean = $state(false);
	let isDataInconsistent: boolean = $state(false);
	let loadingTimeout;
	let selectedGrade = $state('all');
	let selectedSubject = $state('all');
	let selectedSort = $state('title');

	// Functions
	/**
	 * Loads notes from localStorage, then tries to sync with cloud.
	 * If cloud fails, falls back to localStorage.
	 * If cloud is out of sync with local, updates localStorage.
	 */
	async function getNotes() {
		let localNotes: note[] = [];
		let hasLocalNotes = false;

		// 1. Load from localStorage first
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith('note:')) {
				hasLocalNotes = true;
				const encodedData = localStorage.getItem(key);
				let noteData;
				try {
					const decodedString = atob(encodedData || '');
					const uint8Array = new Uint8Array([...decodedString].map((c) => c.charCodeAt(0)));
					noteData = JSON.parse(new TextDecoder().decode(uint8Array));
				} catch (e) {
					try {
						noteData = JSON.parse(encodedData || '{}');
					} catch {
						continue; // skip corrupted note
					}
				}
				localNotes.push(noteData);
			}
		}
		if (hasLocalNotes) {
			notesStore.value = localNotes;
		}

		// 2. Try to load from cloud/server
		let userData;
		try {
			userData = JSON.parse(atob(localStorage.getItem('user')));
		} catch {
			userData = null;
		}
		if (!userData) return; // No user, skip cloud sync

		try {
			const response = await fetch(`${config.apiUrl}notes/notes`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: userData.email })
			});
			const result = await response.json();

			if (result.status === 200) {
				const serverNotes: note[] = result.data;
				const serverNoteSlugs = new Set(serverNotes.map((n) => n.slug));
				const localNoteSlugs = new Set(localNotes.map((n) => n.slug));

				const areEqual =
					serverNoteSlugs.size === localNoteSlugs.size &&
					[...serverNoteSlugs].every((slug) => localNoteSlugs.has(slug));

				if (!areEqual) {
					// Out of sync: update localStorage with cloud data
					isDataInconsistent = true;
					// Remove local notes not on server
					for (const slug of localNoteSlugs) {
						if (!serverNoteSlugs.has(slug)) {
							localStorage.removeItem(`note:${slug}`);
						}
					}
					// Add/update notes from server
					for (const note of serverNotes) {
						const encryptedNote = btoa(
							String.fromCharCode(...new TextEncoder().encode(JSON.stringify(note)))
						);
						localStorage.setItem(`note:${note.slug}`, encryptedNote);
					}
					// Reload notes from localStorage
					const updatedNotes: note[] = [];
					for (let i = 0; i < localStorage.length; i++) {
						const key = localStorage.key(i);
						if (key?.startsWith('note:')) {
							const encodedData = localStorage.getItem(key);
							let noteData;
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
							updatedNotes.push(noteData);
						}
					}
					notesStore.value = updatedNotes;
				} else {
					// Already in sync, just use localNotes
					notesStore.value = localNotes;
				}
			} else {
				// Server error, fallback to localStorage
				console.error('Cloud fetch error, using local notes. Status:', result.status);
				notesStore.value = localNotes;
			}
		} catch (err) {
			// Network or parsing error, fallback to localStorage
			console.error('Cloud fetch failed, using local notes.', err);
			notesStore.value = localNotes;
			if (!hasLocalNotes) {
				error = 'Failed to load notes from cloud and no local notes found.';
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
	function filter() {
		shouldShowFilterMenu = !shouldShowFilterMenu;
	}
	$effect(() => {
		search();
	});
	function getFilteredAndSortedNotes() {
		let filtered = notesStore.value;

		// Filter by grade
		if (selectedGrade && selectedGrade !== 'all' && selectedGrade !== '') {
			filtered = filtered.filter((note) => note.grade === Number(selectedGrade));
		}
		// Filter by subject
		if (selectedSubject && selectedSubject !== 'all' && selectedSubject !== '') {
			filtered = filtered.filter((note) => note.subject === selectedSubject);
		}

		// Sort
		switch (selectedSort) {
			case 'grade':
				filtered = filtered.slice().sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0));
				break;
			case 'subject':
				filtered = filtered
					.slice()
					.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
				break;
		}
		return filtered;
	}
</script>

<div class="main">
	<div class="header flex gap-3 p-2">
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
					title="Search"
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

				<button
					title="Filter Notes"
					class="filter-notes btn btn-circle border border-base-content bg-base-100 hover:bg-base-300"
					onclick={filter}
				>
					<Icon icon="fa6-solid:filter" />
				</button>
			</label>
			{#if shouldShowFilterMenu}
				<div
					class="filter-menu search-results mt-2 flex flex-row gap-16 rounded-md bg-base-100 p-3 shadow"
				>
					<div class="filter-section mb-2">
						<label class="mb-1 block font-bold">Grade:</label>
						<div class="flex flex-col gap-1">
							{#each Array.from(new Set(notesStore.value.map((note) => note.grade))) as grade, i}
								<label class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-base-200">
									<input
										type="radio"
										name="grade-filter"
										value={grade}
										class="radio radio-sm"
										bind:group={selectedGrade}
									/>
									<span class="text-base">{grade}</span>
								</label>
							{/each}
							<label class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-base-200">
								<input
									type="radio"
									name="grade-filter"
									value="all"
									class="radio radio-sm"
									checked
									bind:group={selectedGrade}
								/>
								<span class="text-base">All Grades</span>
							</label>
						</div>
					</div>
					<div class="filter-section mb-2">
						<label class="mb-1 block font-bold">Subject:</label>
						<div class="flex flex-col gap-1">
							{#each Array.from(new Set(notesStore.value.map((note) => note.subject))) as subject, i}
								<label class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-base-200">
									<input
										type="radio"
										name="subject-filter"
										value={subject}
										class="radio radio-sm"
										bind:group={selectedSubject}
									/>
									<span class="text-base">{subject}</span>
								</label>
							{/each}
							<label class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-base-200">
								<input
									type="radio"
									name="subject-filter"
									value="all"
									class="radio radio-sm"
									checked
									bind:group={selectedSubject}
								/>
								<span class="text-base">All Subjects</span>
							</label>
						</div>
					</div>
				</div>
			{/if}
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
			<a
				class="addNoteButton btn border border-base-content bg-accent text-accent-content"
				href="/home/new-note">New Note</a
			>
		</div>
	</div>
	<div class="notes h-auto p-4">
		{#if error}
			<p class="error">{error}</p>
		{:else if notesStore.value && notesStore.value.length > 0}
			<div class="notes-grid">
				{#each getFilteredAndSortedNotes() as note}
					<Note {note} />
				{/each}
			</div>
		{:else}
			<p class="loadingNotes">Loading your Notes...</p>
		{/if}
	</div>
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
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
		min-width: 100px;
		max-width: 100%;
	}
	.search-button,
	.filter-notes {
		border-radius: 6px;
		cursor: pointer;
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-button:hover,
	.filter-notes:hover {
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
	@media (max-width: 600px) {
		.search-input {
			width: 50%;
		}
		.notes-grid {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
		}
	}
	/* Add Note button styles moved to the left for cleaner layout */
	.addNoteButton {
		border-radius: 6px;
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

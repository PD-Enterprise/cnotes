<script lang="ts">
	// Imports
	import { onMount, onDestroy } from 'svelte';
	import type { note, searchResult } from '../types';
	import Note from '../components/note.svelte';
	import { notesStore } from '../../lib/stores/store.svelte';
	import Icon from '@iconify/svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { navigating } from '$app/stores';

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
	let localNotes: note[] = [];
	let hasLocalNotes = false;

	// Functions
	async function getNotes() {
		// console.log('Getting Notes From Server');
		const response = await fetch('/home', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		// console.log(result);

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
	async function getNotesFromLocalStorage() {
		let tempNotes: note[] = [];
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
						continue;
					}
				}
				tempNotes.push(noteData);
			}
		}
		// Sort notes by date (latest first)
		localNotes = tempNotes.sort((a, b) => {
			const dateA = new Date(a.dateCreated || a.dateCreated || 0).getTime();
			const dateB = new Date(b.dateCreated || b.dateCreated || 0).getTime();
			return dateB - dateA;
		});
		if (hasLocalNotes) {
			notesStore.value = localNotes;
		}
	}
	async function persistNotesInLocalStorage() {
		// console.log('Persisting Notes In Local Storage');
		for (const note of notesStore.value) {
			// console.log(note);
			const encryptedNote = btoa(
				String.fromCharCode(...new TextEncoder().encode(JSON.stringify(note)))
			);
			// console.log('encryptednote', encryptedNote);
			localStorage.setItem(`note:${note.slug}`, encryptedNote);
		}
	}
	onMount(() => {
		getNotesFromLocalStorage();
		getNotes();
		// Add click event listener to document to hide search results when clicking outside
		document.addEventListener('click', (event) => {
			const searchBar = document.querySelector('.search-bar');
			if (searchBar && !searchBar.contains(event.target as Node)) {
				shouldShowSearchResults = false;
			}
		});
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
	<div class="header flex gap-3 bg-base-300 p-2">
		<div class="search-bar grow rounded-md p-1">
			<label class="flex items-center gap-2 rounded-md p-1">
				<input
					type="text"
					class="search-input grow rounded-md bg-transparent"
					placeholder="Search for a note"
					bind:value={searchQuery}
					onkeydown={(e) => {
						if (e.key === 'Enter' && searchResults && searchResults.length === 1) {
							// Automatically select the only result
							const onlyResult = searchResults[0];
							if (onlyResult && onlyResult.slug) {
								document.getElementById(onlyResult.slug).focus();
							}
						}
					}}
				/>
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
						<span class="mb-1 block font-bold">Grade:</span>
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
						<span class="mb-1 block font-bold">Subject:</span>
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

<div class="search-button hidden"></div>

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
		transform: scale(1.015);
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

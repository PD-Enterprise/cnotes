<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { onMount } from 'svelte';
	import SvelteToast from '../components/svelteToast.svelte';
	import type { note, searchResult } from '../types';
	import Note from '../components/note.svelte';

	// Variables
	let error: string = '';
	let notes: note[] = [];
	let searchQuery: string = '';
	let searchResults: searchResult[];
	let shouldShowSearchResults: boolean = false;
	// @ts-expect-error
	let newNote: note[] = [{}];
	let conf = {
		height: 700,
		menubar: false,
		shortcuts: false,
		skin: 'oxide-dark',
		content_css: 'dark',
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'preview',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | blocks | ' +
			'bold italic forecolor underline | alignleft aligncenter alignright alignjustify | bullist numlist | ' +
			'table tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
			'bullist numlist outdent indent | ' +
			' help',
		a11y_advanced_options: true,
		file_picker_types: 'image'
	};

	// Functions
	async function getNotes(userEmail: string) {
		if (userEmail) {
			try {
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
				// console.log('Result:', result);
				if (result.status === 'success') {
					notes = result.response;
					localStorage.setItem('notes', JSON.stringify(notes));
				} else {
					error = result.message;
				}
			} catch (error) {
				console.error('Error:', error);
			}
		} else {
			showToast('error', 'Please login to view your notes.', 2000, 'error');
		}
	}
	async function deleteNote(note: note) {
		console.log(note);
		showToast('Deleting...', 'Deleting feature coming soon...', 2500, 'info');
	}
	async function addNewNote() {
		console.log(newNote);
		showToast('Saving...', 'Saving feature coming soon...', 2500, 'info');
	}
	onMount(() => {
		const userEmail = sessionStorage.getItem('Email');
		getNotes(userEmail);

		// Add click event listener to document to hide search results when clicking outside
		document.addEventListener('click', (event) => {
			const searchBar = document.querySelector('.search-bar');
			if (searchBar && !searchBar.contains(event.target as Node)) {
				shouldShowSearchResults = false;
			}
		});
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
					class="grow"
					placeholder="Search for a note"
					on:keydown={handleKeyDown}
					bind:value={searchQuery}
				/>

				<button on:click={search} class="btn btn-circle btn-ghost" aria-label="Search">
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
							<a href={`#${searchResult.slug}`}>
								<p class="text-lg font-bold">
									{searchResult.title}
								</p>
							</a>
							<hr />
						{/each}
					{:else}
						<p>No note found.</p>
					{/if}
				</div>
			{/if}
		</div>
		<div class="add-note">
			<button
				class="addNoteButton btn bg-accent"
				on:click={() => {
					const my_modal_3 = document.getElementById('my_modal_3') as HTMLDialogElement;
					my_modal_3.showModal();
				}}>New Note</button
			>
			<dialog id="my_modal_3" class="modal">
				<div class="modal-box">
					<form method="dialog">
						<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
					</form>
					<div class="header-box">
						<h2 class="mb-2 text-3xl">Add a New Note</h2>
						<div class="new-note-data">
							<label class="form-control w-full max-w-xs">
								<div class="label">
									<span class="label-text">Title:</span>
								</div>
								<input
									type="text"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[0].title}
								/>
							</label>
							<label class="form-control w-full max-w-xs">
								<div class="label">
									<span class="label-text">Board:</span>
								</div>
								<input
									type="text"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[0].board}
								/>
							</label>
							<label class="form-control w-full max-w-xs">
								<div class="label">
									<span class="label-text">Date Created:</span>
								</div>
								<input
									type="date"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[0].date_created}
								/>
							</label>
							<label class="form-control w-full max-w-xs">
								<div class="label">
									<span class="label-text">Grade:</span>
								</div>
								<input
									type="text"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[0].grade}
								/>
							</label>
							<label class="form-control w-full max-w-xs">
								<div class="label">
									<span class="label-text">School:</span>
								</div>
								<input
									type="text"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[0].school}
								/>
							</label>
							<label class="form-control w-full max-w-xs">
								<div class="label">
									<span class="label-text">Subject:</span>
								</div>
								<input
									type="text"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[0].subject}
								/>
							</label>
							<label class="form-control">
								<div class="label">
									<span class="label-text">Note Content</span>
								</div>
								<textarea
									class="textarea textarea-bordered h-24"
									bind:value={newNote[0].note_content}
								></textarea>
							</label>
						</div>
						<br /><br />
					</div>
					<button class="btn btn-outline btn-primary" on:click={addNewNote}>Add Note</button>
				</div>
			</dialog>
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
	}
	.search-results {
		display: flex;
		flex-direction: column;
		gap: 1px;
		background-color: color-mix(in srgb, currentColor 10%, transparent);
		border-radius: 5px;
	}
	.addNoteButton {
		color: #000;
		transform: all 0.3s ease;
	}
	.addNoteButton:hover {
		transform: scale(1.05);
		background-color: var(--fallback-a, oklch(var(--a) / var(--tw-bg-opacity, 1)));
	}
	.notes-grid {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 20px;
	}
	.loadingNotes,
	.error {
		text-align: center;
	}
</style>

<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { onMount } from 'svelte';
	import SvelteToast from '../components/svelteToast.svelte';
	import type { note, searchResult } from '../types';

	// Variables
	let error: string = '';
	let notes: note[] = [];
	let searchQuery: string = '';
	let searchResults: searchResult[];
	let shouldShowSearchResults: boolean = false;

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
	}
	async function addNewNote() {
		console.log('New note data');
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
							<h1>Coming Soon...</h1>
							<!-- 
							<label>
								Title:<br />
								<input
									type="text"
									placeholder="Title"
									class="edit-title text-lg font-bold"
									bind:value={newNote.title}
								/>
							</label><br />
							<label>
								Board:<br />
								<input type="text" placeholder="Board" bind:value={newNote.board} />
							</label><br />
							<label>
								Date Created:<br />
								<input type="date" bind:value={newNote.date_created} />
							</label><br />
							<label>
								Grade:<br />
								<input type="text" placeholder="Grade" bind:value={newNote.grade} />
							</label><br />
							<label>
								School:<br />
								<input type="text" placeholder="School" bind:value={newNote.school} />
							</label><br />
							<label>
								Subject:<br />
								<input type="text" placeholder="Subject" bind:value={newNote.subject} />
							</label><br />
							<label>
								Content:<br />
								<textarea placeholder="Content" bind:value={newNote.note_content}></textarea>
							</label>
							-->
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
					<div
						role="button"
						tabindex="0"
						class="note card flex w-96 bg-base-200 shadow-xl"
						id={note.slug}
					>
						<div class="card-options">
							<details class="dropdown dropdown-end">
								<summary class="btn btn-circle btn-ghost m-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-6"
										type="button"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
										/>
									</svg>
								</summary>
								<ul
									class="options menu dropdown-content z-[1] w-20 rounded-box bg-base-100 p-2 shadow"
								>
									<li>
										<button
											class="btn btn-error"
											on:click={() => {
												delete_modal.showModal();
											}}
											>Delete
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-6"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
												/>
											</svg>
										</button>
									</li>
								</ul>
							</details>
							<dialog id="delete_modal" class="modal">
								<div class="modal-box">
									<form method="dialog">
										<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button
										>
									</form>
									<h1 class="text-2xl">Delete Note</h1>
									<p class="py-4">Are you sure you want to delete this note?</p>
									<div class="modal-action">
										<button
											class="btn btn-info"
											on:click={() => {
												delete_modal.close();
											}}>Cancel</button
										>
										<button
											class="btn btn-error"
											on:click={() => {
												deleteNote(note);
											}}
											on:click={() => {
												delete_modal.close();
											}}
											>Delete
										</button>
									</div>
								</div>
							</dialog>
						</div>
						<div class="card-body">
							<a class="note-title card-title" href="/home/{note.slug}">{note.title}</a>
							<div class="note-meta card-actions justify-end">
								<div class="badge badge-outline">{note.grade}th grade</div>
								<div class="badge badge-outline">{note.subject}</div>
								<div class="badge badge-outline">
									{new Date(note.date_created)
										.toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'numeric',
											year: '2-digit'
										})
										.split('/')
										.reverse()
										.join('/')}
								</div>
							</div>
							<p class="note-content">
								{@html note.note_content}
							</p>
						</div>
					</div>
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
	.note {
		flex-direction: column;
		gap: 10px;
		border: 0.1em solid #ccc;
		width: 20em;
		height: 15em;
		overflow-y: hidden;
		cursor: pointer;
	}
	.note:hover {
		border: 2px solid #4a90e2;
	}
	.note-meta {
		margin-top: 10px;
		font-size: 0.9rem;
		color: #a0a0a0;
	}
	.card-options {
		margin-left: auto;
	}
	.card-body {
		margin-top: -85px;
	}
	.loadingNotes,
	.error {
		text-align: center;
	}
</style>

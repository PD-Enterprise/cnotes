<script lang="ts">
	// Your existing script remains unchanged
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
		// Existing implementation
	}
	async function deleteNote(note: note) {
		// Existing implementation
	}
	async function addNewNote() {
		// Existing implementation
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
		// Existing implementation
	}
	function handleKeyDown(event: any) {
		search();
	}
</script>

<SvelteToast />

<div class="background">
	<div class="stars"></div>
	<div class="twinkling"></div>
	<div class="main">
		<div class="header">
			<div class="search-bar mb-5 mt-5 grow pl-5 pr-5">
				<label class="input input-bordered flex items-center gap-2">
					<input
						type="text"
						class="grow color-changing-search"
						placeholder="Search for a note"
						on:keydown={handleKeyDown}
						bind:value={searchQuery}
					/>

					<button on:click={search} class="btn vibrant-button btn-circle btn-ghost" aria-label="Search">
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
					class="addNoteButton vibrant-button btn bg-accent"
					on:click={() => {
						my_modal_3.showModal();
					}}>New Note</button
				>
				<dialog id="my_modal_3" class="modal animated-modal">
					<div class="modal-box">
						<form method="dialog">
							<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
						</form>
						<div class="header-box">
							<h2 class="mb-2 text-3xl">Add a New Note</h2>
							<div class="new-note-data">
								<h1>Coming Soon...</h1>
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
							class="note card flex w-96 bg-base-200 shadow-xl hover-animate"
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
											</button>
										</li>
									</ul>
								</details>
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
</div>


<style>
	
	@keyframes moveStars {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-2000px);
		}
	}

	/* Search Bar Gradient Animation */
	.search-bar {
		position: relative;
		background: linear-gradient(90deg, #ff7eb3, #ff758c, #ff6f6b, #ffa07a);
		background-size: 300% 300%;
		animation: gradientAnimation 5s infinite;
		border-radius: 8px;
		padding: 0.5rem;
		box-shadow: 0px 4px 15px rgba(255, 105, 180, 0.2);
	}

	@keyframes gradientAnimation {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	/* Vibrant Button */
	.vibrant-button {
		background: linear-gradient(45deg, #ff6f61, #ff5f6d);
		color: #fff;
		border: none;
		box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.vibrant-button:hover {
		transform: scale(1.1);
		box-shadow: 0 8px 30px rgba(255, 105, 180, 0.4);
	}

	/* Card and Modal Animations */
	.note {
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.note:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
	}

	.modal-box {
		animation: modalAppear 0.4s ease;
	}

	@keyframes modalAppear {
		0% {
			transform: scale(0.8);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>

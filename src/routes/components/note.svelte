<script lang="ts">
	import type { note } from '../types';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import SvelteToast from './svelteToast.svelte';
	import { onMount } from 'svelte';
	import config from '$lib/utils/apiConfig';
	import { notesStore } from '$lib/stores/store.svelte';

	let notes = $props();

	// console.log(notes.note);

	async function deleteNote(note: note) {
		try {
			localStorage.removeItem(`note:${notes.note.slug}`);
			for (let i = 0; i < notesStore.value.length; i++) {
				if (notesStore.value[i].slug == notes.note.slug) {
					notesStore.value = notesStore.value.filter((note) => note.slug !== notes.note.slug);
				}
			}
			const user = JSON.parse(atob(localStorage.getItem('user') || '{}'));
			if (!user.email) {
				showToast('Error', 'You must be logged in to delete a note', 3000, 'error');
				return;
			}
			const request = await fetch(`${config.apiUrl}notes/note/${note.slug}/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: user.email })
			});

			const result = await request.json();

			if (result.status !== 200) {
				showToast('Error deleting note', result.message, 3000, 'error');
				return;
			}
			showToast('Success', 'Note deleted successfully', 2500, 'success');
		} catch (error) {
			showToast('Error deleting note', 'There was an error deleting your note', 3000, 'error');
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	class="note card flex bg-base-200 p-2 shadow-xl"
	id={notes.note.slug}
>
	<div class="card-options">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-circle m-1 hover:bg-base-100">
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
			</div>
			<ul
				class="z-1 dropdown-content menu absolute right-3 flex flex-col gap-2 rounded-box bg-base-100 p-2 shadow-sm"
			>
				<li>
					<a class="btn btn-success" href={`/home/${notes.note.slug}`}>
						Edit
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
					</a>
				</li>
				<li>
					<button
						class="btn btn-error"
						onclick={() => {
							const delete_modal = document.getElementById(
								`delete_modal_${notes.note.slug}`
							) as HTMLDialogElement;
							delete_modal.showModal();
						}}
					>
						Delete
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
		</div>
	</div>
	<div class="card-body flex flex-col p-2">
		<a class="note-title card-title" href="/home/{notes.note.slug}/sharing">{notes.note.title}</a>
		<div class="note-meta card-actions mt-1 justify-end">
			<div class="badge badge-outline p-3">{notes.note.grade}th grade</div>
			<div class="badge badge-outline p-3">{notes.note.subject}</div>
			<div class="badge badge-outline p-3">
				{new Date(notes.note.dateCreated)
					.toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'numeric',
						year: '2-digit'
					})
					.split('/')
					.join('/')}
			</div>
		</div>
		<p class="note-content">
			{@html notes.note.notescontent}
		</p>
	</div>
</div>

<dialog id="delete_modal_{notes.note.slug}" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">✕</button>
		</form>
		<h1 class="text-2xl">Delete Note</h1>
		<p class="py-4">Are you sure you want to delete this note?</p>
		<div class="modal-action">
			<button
				class="btn btn-info"
				onclick={() => {
					const delete_modal = document.getElementById(
						`delete_modal_${notes.note.slug}`
					) as HTMLDialogElement;
					delete_modal.close();
				}}>Cancel</button
			>
			<button
				class="btn btn-error"
				onclick={() => {
					deleteNote(notes.note);
					const delete_modal = document.getElementById(
						`delete_modal_${notes.note.slug}`
					) as HTMLDialogElement;
					delete_modal.close();
				}}
				>Delete
			</button>
		</div>
	</div>
</dialog>

<style>
	.note {
		--note-width: 20em;
		--note-height: 15em;
		width: var(--note-width);
		height: var(--note-height);
		font-size: 1rem; /* Base font size */
		flex-direction: column;
		gap: 10px;
		border: 1px solid #ccc;
		overflow-y: hidden;
		cursor: pointer;
		box-shadow: 0 10px 8px rgba(0, 0, 0, 0.1);
	}
	.note:hover {
		border: 2px solid #4a90e2;
	}
	.note:focus {
		border: 2px solid #007bff;
	}
	.note-meta {
		font-size: 0.9rem;
		color: #aaaaaa;
	}
	.note-title {
		width: 11.2em;
	}
	.card-options {
		margin-left: auto;
	}
	.card-body {
		margin-top: -58px;
	}
	@media (max-width: 768px) {
		.note {
			--note-width: 18em;
			--note-height: 12em;
			font-size: 0.95rem;
		}
	}
	@media (max-width: 635px) {
		.note {
			--note-width: 16em;
			--note-height: 11em;
			font-size: 0.9rem;
		}
		.card-body {
			padding-left: 18px;
		}
	}
	@media (max-width: 475px) {
		.note {
			/* This sets the width of the note to be between 8em and 13em, 
			adjusting dynamically based on the viewport width (5vw + 6em). 
			This ensures the note width is responsive and scales with the viewport. */
			--note-width: clamp(13em, 5vw + 6em, 13em);
			--note-height: 10em;
		}
		.card-body {
			padding-left: 15px;
		}
		.note-meta {
			display: none;
		}
		.note-content {
			display: none;
		}
	}
	@media (max-width: 445px) {
		.note {
			width: 12em;
		}
	}
	@media (max-width: 411px) {
		.note {
			width: 11em;
		}
	}
	@media (max-width: 380px) {
		.note {
			width: 10em;
		}
	}
	@media (max-width: 349px) {
		.note {
			width: 9em;
		}
	}
	@media (max-width: 318px) {
		.note {
			width: 8.9em;
		}
	}
</style>

<script lang="ts">
	import type { note } from '../types';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import SvelteToast from './svelteToast.svelte';
	import { notesStore } from '$lib/stores/noteStore';

	let notes = $props();

	async function deleteNote(note: note) {
		showToast('Deleting...', 'Deleting your note...', 2500, 'info');
		const response = await fetch(`/api/notes/note/delete-note`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ noteSlug: note.slug })
		});
		const result = await response.json();
		if (result.status === 'success') {
			showToast('Success', 'Note deleted successfully', 2500, 'success');
			notesStore.update((currentNotes) => currentNotes.filter((n) => n.slug !== note.slug));
		} else {
			showToast('Error', 'Error deleting note', 2500, 'error');
		}
	}
</script>

<SvelteToast />

<div
	role="button"
	tabindex="0"
	class="note card flex w-96 bg-base-200 shadow-xl"
	id={notes.note.slug}
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
			<ul class="options menu dropdown-content z-[1] w-20 rounded-box bg-base-100 p-2 shadow">
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
		</details>
		<dialog id="delete_modal_{notes.note.slug}" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
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
	</div>
	<div class="card-body">
		<a class="note-title card-title" href="/home/{notes.note.slug}">{notes.note.title}</a>
		<div class="note-meta card-actions justify-end">
			<div class="badge badge-outline">{notes.note.grade}th grade</div>
			<div class="badge badge-outline">{notes.note.subject}</div>
			<div class="badge badge-outline">
				{new Date(notes.note.date_created)
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
			{@html notes.note.note_content}
		</p>
	</div>
</div>

<style>
	.note {
		flex-direction: column;
		gap: 10px;
		border: 1px solid #ccc;
		width: 20em;
		height: 15em;
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
</style>

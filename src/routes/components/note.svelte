<script lang="ts">
	import type { note } from '../types';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import SvelteToast from './svelteToast.svelte';
	import { onMount } from 'svelte';
	import config from '$lib/utils/apiConfig';
	import { notesStore } from '$lib/stores/store.svelte';
	import Icon from '@iconify/svelte';

	let notes = $props();

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
				showToast(
					'Error deleting note',
					'There was an error deleting your note from the database.',
					3000,
					'error'
				);
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
	class="note card flex border border-base-content p-1 shadow-2xl"
	id={notes.note.slug}
>
	<div class="card-body flex flex-col bg-base-300 p-1">
		<div class="title-and-options flex flex-row justify-between gap-1">
			<a class="note-title card-title w-full" href="/home/{notes.note.slug}/sharing"
				>{notes.note.title}</a
			>
			<div class="card-options">
				<div class="dropdown">
					<div
						tabindex="0"
						role="button"
						class="btn btn-circle m-1 border border-base-content hover:bg-base-300"
					>
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
						class="menu dropdown-content absolute right-8 top-8 flex flex-col gap-2 rounded-box bg-base-100 p-2 shadow-sm"
					>
						<li>
							<a class="btn btn-success" href={`/home/${notes.note.slug}`}>
								Edit
								<svg
									viewBox="0 0 24 24"
									fill="none"
									class="size-5"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
										stroke="#000000"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
										stroke="#000000"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
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
		</div>
		<div class="note-meta card-actions">
			<div class="badge badge-outline border border-base-content p-2">
				{notes.note.grade}th grade
			</div>
			<div class="badge badge-outline border-base-content p-2">{notes.note.subject}</div>
			<div class="badge badge-outline border-base-content p-2">
				{(() => {
					const d = new Date(notes.note.dateCreated);
					const day = String(d.getDate()).padStart(2, '0');
					const month = String(d.getMonth() + 1).padStart(2, '0');
					const year = String(d.getFullYear()).slice(-2);
					return `${month}/${day}/${year}`;
				})()}
			</div>
		</div>
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

<div class="note-content hidden"></div>

<style>
	.note {
		--note-width: 16em;
		--note-height: 11em;
		width: var(--note-width);
		height: var(--note-height);
		font-size: 1rem;
		flex-direction: column;
		gap: 10px;
		overflow-y: hidden;
		cursor: pointer;
	}
	.note {
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.note:hover,
	.note:focus {
		transform: translateY(-1px) scale(1.025);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.13),
			0 1.5px 4px rgba(0, 0, 0, 0.08);
	}
	.note:focus {
		border: 2px solid #4a90e2;
	}
	@media (max-width: 600px) {
		.note {
			width: 100%;
		}
		.note-meta {
			justify-content: flex-end;
		}
	}
</style>

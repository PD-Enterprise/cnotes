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
		const request = await fetch(`/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				note: note
			})
		});
		const result = await request.json();

		if (result.status !== 200) {
			showToast(
				'There was an error deleting your note from the database.',

				'error'
			);
			return;
		}
		localStorage.removeItem(`note:${notes.note.slug}`);
		notesStore.value = notesStore.value.filter((note) => note.slug !== notes.note.slug);
		showToast('Note deleted successfully', 'success');
	}
</script>

<div
	role="button"
	tabindex="0"
	class="note card border-base-content flex gap-2.5 border shadow-2xl"
	id={notes.note.slug}
	style="view-transition-name: note-card-{notes.note.slug}"
>
	<div class="card-body bg-base-300 flex flex-col rounded p-1">
		<div class="title-and-options flex flex-row justify-between gap-1">
			<a
				class="note-title card-title w-full p-1"
				href="{notes.note.slug}/sharing"
				style="view-transition-name: note-title-{notes.note.slug}"
			>
				{#if notes.note.title.split(' ').length > 4}
					{notes.note.title.split(' ').slice(0, 4).join(' ') + '...'}
				{:else}
					{notes.note.title}
				{/if}
			</a>
			<div class="card-options">
				<div class="dropdown">
					<div
						tabindex="0"
						role="button"
						class="btn btn-circle hover:bg-base-100 focus:border-base-content hover:border-base-content m-1 hover:border focus:border"
					>
						<Icon icon="bi:three-dots-vertical" width="18" height="18" />
					</div>
					<ul
						class="menu dropdown-content rounded-box bg-base-100 absolute top-8 right-8 flex flex-col gap-2 p-2 shadow-sm"
					>
						{#if notes.auth}
							<li>
								<a class="btn btn-success" href={`/${notes.note.slug}`}>
									Edit
									<Icon icon="mage:edit" width="20" height="20" />
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
									<Icon icon="mage:trash" width="20" height="20" />
								</button>
							</li>
						{:else}
							<li>
								<a class="btn btn-success btn-disabled" href={`/${notes.note.slug}`}>
									Edit
									<Icon icon="mage:edit" width="20" height="20" />
								</a>
							</li>

							<li>
								<button
									class="btn btn-error btn-disabled"
									onclick={() => {
										const delete_modal = document.getElementById(
											`delete_modal_${notes.note.slug}`
										) as HTMLDialogElement;
										delete_modal.showModal();
									}}
								>
									Delete
									<Icon icon="mage:trash" width="20" height="20" />
								</button>
							</li>
						{/if}
					</ul>
				</div>
			</div>
		</div>
		<div class="note-meta card-actions">
			<div class="badge badge-outline bg-base-200 border-base-content border p-2">
				{#if Number(notes.note.academicLevel)}
					{notes.note.academicLevel}th grade
				{:else}
					{notes.note.academicLevel}
				{/if}
			</div>
			<div class="badge badge-outline bg-base-200 border-base-content p-2">
				{notes.note.topic}
			</div>

			<div class="badge badge-outline bg-base-200 border-base-content p-2">
				{notes.note.visibility[0].toUpperCase() + notes.note.visibility.slice(1)}
			</div>

			<div class="badge badge-outline bg-base-200 border-base-content p-2">
				{(() => {
					const d = new Date(notes.note.dateCreated);
					const day = String(d.getDate()).padStart(2, '0');
					const month = String(d.getMonth() + 1).padStart(2, '0');
					const year = String(d.getFullYear()).slice(-2);
					return `${month}/${day}/${year}`;
				})()}
			</div>
			{#if notes.note.type == 'diagram'}
				<div class="badge badge-outline border-base-content bg-base-300 p-2">Diagram</div>
			{/if}
		</div>
	</div>
</div>

<dialog id="delete_modal_{notes.note.slug}" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-ghost btn-sm btn-circle absolute top-2 right-2">✕</button>
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
		--note-width: 15em;
		--note-height: 11em;
		width: var(--note-width);
		height: var(--note-height);
		flex-direction: column;
		overflow-y: hidden;
		cursor: pointer;
		contain: layout;
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

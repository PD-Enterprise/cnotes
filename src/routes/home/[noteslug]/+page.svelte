<script lang="ts">
	// Imports
	import { onDestroy, onMount } from 'svelte';
	import type { note } from '../../types';
	import { defaultExtensions, Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import config from '$lib/utils/apiConfig';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { theme, EditorNoteData, isAuthenticated } from '$lib/stores/store.svelte';
	import DOMPurify from 'dompurify';
	import { page } from '$app/stores';
	import Tiptap from '../../components/tiptap.svelte';

	// Variables
	let error: string = $state('');
	let originalNote = $state(null);
	let isChanged = $derived(
		originalNote && JSON.stringify(EditorNoteData.value) !== JSON.stringify(originalNote)
	);

	// Functions
	async function getNote(slug: string) {
		if (!slug) {
			console.error('No note slug provided.');
			return;
		}

		const response = await fetch(`/home/${slug}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		// console.log(result);

		if (!result.data) {
			console.error('Failed to fetch note data.');
			return;
		}

		const serverNote: note = result.data;
		originalNote = result.data;
		// console.log('server note', serverNote);

		if (serverNote && serverNote != undefined) {
			EditorNoteData.value = { ...serverNote };
			// console.log(noteData);
		}
	}
	function getNotesFromLocalStorage(slug: string) {
		if (!slug) {
			console.error('No note slug provided.');
			return;
		}
		// let localNote = null;
		// let hasLocalNote = false;
		// const storedNote = localStorage.getItem(`note:${slug}`);
		// if (storedNote) {
		// 	hasLocalNote = true;
		// 	try {
		// 		localNote = JSON.parse(decodeURIComponent(escape(atob(storedNote))));
		// 	} catch (e) {
		// 		try {
		// 			localNote = JSON.parse(storedNote);
		// 		} catch {
		// 			error = 'Corrupted local note data.';
		// 			return;
		// 		}
		// 	}
		// 	noteData = { ...localNote };
		// 	originalNoteData = { ...localNote };
		// }
	}
	async function saveNote() {
		// Auth check
		if (!isAuthenticated.value) {
			showToast('Error', 'You must be logged in to save notes.', 3000, 'error');
			return;
		}
		EditorNoteData.value.dateUpdated = new Date().toISOString();
		try {
			const response = await fetch(`/home/${EditorNoteData.value.slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					data: EditorNoteData.value
				})
			});
			const result = await response.json();
			// console.log(result);

			if (result.status !== 200) {
				console.error('Failed to save note.');
				showToast('Error', 'Failed to save note', 3000, 'error');
				return;
			}
			originalNote = JSON.parse(JSON.stringify(EditorNoteData.value));

			// Save to localStorage
			localStorage.setItem(
				`note:${EditorNoteData.value.slug}`,
				btoa(unescape(encodeURIComponent(JSON.stringify(EditorNoteData.value))))
			);
			showToast('Success', 'Note saved successfully', 1000, 'success');
		} catch (error) {
			console.error(error);
			showToast('Error', 'Failed to save note', 3000, 'error');
		}
	}
	function handleSaveShortcut(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 's') {
			event.preventDefault();
			saveNote();
		}
	}
	onMount(async () => {
		const slug = $page.url.pathname.split('/home/')[1].split('/sharing')[0];
		getNotesFromLocalStorage(slug);
		getNote(slug);

		window.addEventListener('keydown', handleSaveShortcut);
		const editor = document.getElementById('editor') as HTMLDivElement;

		$effect(() => {
			if (!editor) {
				return;
			}
			if (theme.value) {
				editor.classList.remove('dark');
			} else {
				editor.classList.add('dark');
			}
		});
	});
</script>

<dialog id="meta_data_modal" class="modal">
	<div class="modal-box flex w-96 flex-col">
		<div class="absolute right-2">
			<form method="dialog" onsubmit={(e) => e.preventDefault()}>
				<button
					class="btn btn-ghost btn-sm btn-circle top-2"
					onclick={(e) => {
						e.preventDefault();
						const meta_data_modal = document.getElementById('meta_data_modal') as HTMLDialogElement;
						meta_data_modal.close();
						// console.log(newNote);
					}}>✕</button
				>
			</form>
		</div>
		<div class="flex flex-col gap-2">
			<h3>Enter Metadata for your Note Here:</h3>
			<div class="meta-data flex flex-row flex-wrap gap-3">
				{#each Object.keys(EditorNoteData.value) as noteDataKey}
					{#if ['title', 'board', 'dateCreated', 'grade', 'subject'].includes(noteDataKey)}
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">{noteDataKey}:</span>
							</div>
							{#if noteDataKey == 'dateCreated'}
								<input
									type="date"
									class="input-bordered input"
									placeholder={noteDataKey}
									required
									bind:value={EditorNoteData.value[noteDataKey]}
								/>
							{:else}
								<input
									type="text"
									class="input-bordered input"
									placeholder={noteDataKey}
									required
									bind:value={EditorNoteData.value[noteDataKey]}
								/>
							{/if}
						</label>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</dialog>
<div class="main">
	{#if error}
		{error}
	{:else if EditorNoteData.value}
		<div class="note flex h-full flex-col gap-5 rounded-md">
			<div class="buttons mt-2 flex gap-2">
				{#if isChanged}
					<button class="btn btn-accent btn-outline" onclick={saveNote}>Save</button>
				{:else}
					<button class="btn btn-accent btn-outline" disabled>Save</button>
				{/if}
				<button
					class="btn btn-info border"
					onclick={() => {
						const meta_data_modal = document.getElementById('meta_data_modal') as HTMLDialogElement;
						meta_data_modal.showModal();
					}}>Edit Metadata</button
				>
				<button
					class="btn btn-success"
					onclick={() => {
						const share_modal = document.getElementById('share_modal') as HTMLDialogElement;
						share_modal.showModal();
					}}
					>Share<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
						/></svg
					></button
				>
			</div>
			<div class="editor h-full">
				<!-- {console.log('notedata', noteData.notescontent)} -->
				<Tiptap content={EditorNoteData.value.notescontent} />
			</div>
		</div>
		<dialog id="share_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">✕</button>
				</form>
				<span>Link:</span>
				<a href="/home/{EditorNoteData.value.slug}/sharing" class="share-link">
					https://cnotes.pages.dev/{EditorNoteData.value.slug}/sharing
				</a>
			</div>
		</dialog>
	{:else}
		<div class="loadingNotes"><h1>Loading Your Note...</h1></div>
	{/if}
</div>

<div class="active dark hidden"></div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	.share-link {
		text-decoration: underline;
		color: #4a90e2;
	}
	.meta-data {
		display: flex;
		flex-direction: row;
		gap: 10px;
		flex-wrap: wrap;
	}
	.note {
		padding: 5px;
	}
	/* .Tiptap-mathematics-editor {
		background: #202020;
		color: #fff;
		font-family: monospace;
		padding: 0.2rem 0.5rem;
	}

	.Tiptap-mathematics-render {
		padding: 0 0.25rem;
	}

	.Tiptap-mathematics-render--editable {
		cursor: pointer;
		transition: background 0.2s;
	}

	.Tiptap-mathematics-render--editable:hover {
		background: #eee;
	}

	.Tiptap-mathematics-editor,
	.Tiptap-mathematics-render {
		border-radius: 0.25rem;
		display: inline-block;
	} */
	.tipex-controller {
		background-color: #f3f4f6; /* bg-neutral-100 */
		position: sticky;
		bottom: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem; /* gap-2 */
		border-radius: 0; /* rounded-none */
		padding-left: 0.75rem; /* px-3 */
		padding-right: 0.75rem;
		padding-top: 0.5rem; /* py-2 */
		padding-bottom: 0.5rem;
	}
	@media (min-width: 768px) {
		.tipex-controller {
			flex-direction: row;
		}
	}

	.tipex-controller.dark,
	:global(.dark) .tipex-controller {
		background-color: #171717;
	}

	.tipex-controller-wrapper {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem; /* gap-3 */
	}

	.tipex-basic-controller-wrapper {
		display: flex;
		gap: 0.5rem; /* gap-2 */
	}

	.tipex-edit-button {
		background-color: #f3f4f6; /* bg-neutral-100 */
		color: #374151; /* text-neutral-700 */
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem; /* rounded-md */
		border: 0;
		padding: 0;
		font-size: 0.75rem; /* text-xs */
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-duration: 100ms;
	}

	.tipex-edit-button.dark,
	:global(.dark) .tipex-edit-button {
		background-color: rgba(31, 41, 55, 0.8);
		color: #e5e7eb;
	}

	.tipex-edit-button.active {
		background-color: #f3f4f6; /* bg-neutral-100 */
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
	}

	.tipex-edit-button.active.dark,
	:global(.dark) .tipex-edit-button.active {
		background-color: #374151;
	}
</style>

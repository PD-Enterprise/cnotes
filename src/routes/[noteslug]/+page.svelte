<script lang="ts">
	// Imports
	import { onDestroy, onMount } from 'svelte';
	import type { note } from '../types';
	import config from '$lib/utils/apiConfig';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { theme, EditorNoteData, isAuthenticated } from '$lib/stores/store.svelte';
	import DOMPurify from 'dompurify';
	import { page } from '$app/stores';
	import Tiptap from '../components/tiptap.svelte';
	import Loader from '../components/loader.svelte';
	import Excalidraw from '../components/Excalidraw.svelte';
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
	import ShareModel from '../components/shareModel.svelte';

	// Variables
	let error: string = $state('');
	let originalNote = $state(null);
	let excalidrawIsDirty = $state(false);
	let excalidrawKey = $state(0);
	let data = $props();
	let excalidrawAPI: ExcalidrawImperativeAPI | undefined = $state();
	let isChanged = $derived(() => {
		if (EditorNoteData.value.type === 'diagram') {
			return excalidrawIsDirty;
		}
		return originalNote && JSON.stringify(EditorNoteData.value) !== JSON.stringify(originalNote);
	});
	let isSaving = false;

	// Functions
	async function getNote() {
		const slug = $page.url.pathname.split('/')[1];
		// console.log(slug);

		const response = await fetch(`${slug}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		console.log(result);

		if (!result.data || result.status != 200) {
			console.error('Failed to fetch note data.');
			error = 'Failed to fetch note data.';
			return;
		}

		const serverNote: note = result.data;
		originalNote = result.data;
		// console.log('server note', serverNote);

		if (serverNote && serverNote != undefined) {
			EditorNoteData.value = { ...serverNote };
			// console.log(EditorNoteData.value.notescontent);
		}
	}
	export async function saveNote() {
		if (isSaving) {
			showToast('Info', 'Save already in progress...', 1500, 'info');
			return;
		}

		showToast('Info', 'Saving your note...', 1500, 'info');

		let noteToSave = { ...EditorNoteData.value };

		if (noteToSave.type == 'diagram' && excalidrawAPI) {
			const currentElements = excalidrawAPI.getSceneElements();
			const currentFiles = excalidrawAPI.getFiles();

			noteToSave.content = JSON.stringify({
				elements: currentElements,
				files: currentFiles
			});
		}
		isSaving = true;
		try {
			const response = await fetch(`${EditorNoteData.value.slug}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					data: noteToSave
				})
			});
			const result = await response.json();
			// console.log(result);

			if (result.status !== 200) {
				console.error('Failed to save note.');
				showToast('Error', 'Failed to save note', 3000, 'error');
				return;
			}

			EditorNoteData.value = noteToSave;

			originalNote = JSON.parse(JSON.stringify(EditorNoteData.value));
			excalidrawIsDirty = false;

			if (EditorNoteData.value.type === 'diagram') {
				excalidrawKey++;
			}

			// Save to localStorage
			localStorage.setItem(
				`note:${EditorNoteData.value.slug}`,
				btoa(unescape(encodeURIComponent(JSON.stringify(EditorNoteData.value))))
			);
			showToast('Success', 'Note saved successfully', 1000, 'success');
		} catch (error) {
			console.error(error);
			showToast('Error', 'Failed to save note', 3000, 'error');
		} finally {
			isSaving = false;
		}
	}
	function handleSaveShortcut(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 's') {
			event.preventDefault();

			if (event.repeat) {
				return;
			}
			saveNote();
		}
	}
	onMount(async () => {
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

		$effect(() => {
			if (excalidrawAPI) {
				// Destructure the three arguments: elements, appState, and files
				excalidrawAPI.onChange((elements, files) => {
					// console.log('Elements:', elements);
					// console.log('Files:', files);

					if (elements.length > 0) {
						const currentContent = JSON.stringify({ elements: elements, files: files });
						const originalContent = JSON.stringify({
							elements: JSON.parse(originalNote.notescontent).elements,
							files: JSON.parse(originalNote.notescontent).files
						});

						excalidrawIsDirty = currentContent !== originalContent;
					} else {
						excalidrawIsDirty =
							originalNote && originalNote.notescontent !== '{"elements": [], "files": {}}';
					}
				});
			}
		});
	});
</script>

{#if data.data.session}
	<div class="main">
		{#await getNote()}
			<Loader title="Loading your note..." />
		{:then}
			<dialog id="meta_data_modal" class="modal">
				<div class="modal-box flex w-96 flex-col">
					<div class="absolute right-2">
						<form method="dialog" onsubmit={(e) => e.preventDefault()}>
							<button
								class="btn btn-ghost btn-sm btn-circle top-2"
								onclick={(e) => {
									e.preventDefault();
									const meta_data_modal = document.getElementById(
										'meta_data_modal'
									) as HTMLDialogElement;
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
								{#if ['title', 'dateCreated', 'grade', 'subject'].includes(noteDataKey)}
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
			{#if error}
				{error}
			{:else if EditorNoteData.value}
				<div class="note flex h-full flex-col gap-2 rounded-md">
					<div class="buttons flex gap-3">
						{#if isChanged}
							<button class="btn btn-accent btn-outline shadow-xl" onclick={saveNote}>Save</button>
						{:else}
							<button class="btn btn-accent btn-outline shadow-xl" disabled>Save</button>
						{/if}
						<button
							class="btn btn-info border"
							onclick={() => {
								const meta_data_modal = document.getElementById(
									'meta_data_modal'
								) as HTMLDialogElement;
								meta_data_modal.showModal();
							}}>Metadata</button
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
						{#if EditorNoteData.value.type == 'text'}
							<Tiptap content={EditorNoteData.value.content} editable={true} />
						{:else if EditorNoteData.value.type == 'diagram'}
							{#key excalidrawKey}
								<Excalidraw
									theme="dark"
									content={EditorNoteData.value.content}
									viewModeEnabled={false}
									excalidrawAPI={(api) => (excalidrawAPI = api)}
								/>
							{/key}
						{/if}
					</div>
				</div>
				<ShareModel slug={EditorNoteData.value.slug} />
			{:else}
				<div class="loadingNotes"><h1>Loading Your Note...</h1></div>
			{/if}
		{:catch error}
			<p class="errorMessage">{error}</p>
		{/await}
	</div>
{:else}
	<p class="errorMessage">You are not logged in. Please login to continue.</p>
{/if}

<div class="active dark hidden"></div>

<style>
	.main {
		height: calc(100vh - 65px);
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
</style>

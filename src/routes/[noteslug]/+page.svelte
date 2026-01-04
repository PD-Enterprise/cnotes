<script lang="ts">
	// Imports
	import { onDestroy, onMount } from 'svelte';
	import type { note } from '../types';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { theme, EditorNoteData, isAuthenticated } from '$lib/stores/store.svelte';
	import { page } from '$app/stores';
	import Tiptap from '../components/tiptap.svelte';
	import Excalidraw from '../components/Excalidraw.svelte';
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
	import ShareModel from '../components/shareModel.svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';
	import Icon from '@iconify/svelte';
	import { getNotes } from '$lib/api/get-notes';

	// Variables
	let error: string = $state('');
	let originalNote = $state(null);
	let excalidrawIsDirty = $state(false);
	let excalidrawKey = $state(0);
	let excalidrawAPI: ExcalidrawImperativeAPI | undefined = $state();
	let isChanged = $derived(() => {
		if (EditorNoteData.value.type === 'diagram') {
			return excalidrawIsDirty;
		}
		return originalNote && JSON.stringify(EditorNoteData.value) !== JSON.stringify(originalNote);
	});
	let isSaving = false;
	let isK_12: string = $state('true');
	let initialTitle: string = $state('');
	let isTitleChanged: boolean = $state(false);
	let localNote: any = null;
	let hasLocalNote = false;

	// Functions
	async function getNote(slug: string) {
		const response = await fetch(`${slug}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		// console.log(result);

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
			initialTitle = EditorNoteData.value.title;
		}
	}
	async function getNoteFromLocalStorage(slug: string) {
		const storedNote = localStorage.getItem(`note:${slug}`);
		if (storedNote) {
			hasLocalNote = true;
			try {
				localNote = JSON.parse(decodeURIComponent(atob(storedNote)));
			} catch (e) {
				error = 'Failed to load note from local storage.';
			}
			originalNote = { ...localNote };
		}
	}
	export async function saveNote() {
		if (isSaving) {
			showToast('Save already in progress...', 'info');
			return;
		}

		showToast('Saving your note...', 'info');

		let noteToSave = { ...EditorNoteData.value };

		if (noteToSave.type == 'diagram' && excalidrawAPI) {
			const currentElements = excalidrawAPI.getSceneElements();
			const currentFiles = excalidrawAPI.getFiles();

			noteToSave.content = JSON.stringify({
				elements: currentElements,
				files: currentFiles
			});
		}
		if (initialTitle != EditorNoteData.value.title) {
			isTitleChanged = true;
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

			if (result.status !== 200) {
				console.error('Failed to save note.');
				showToast('Failed to save note', 'error');
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
			showToast('Note saved successfully', 'success');
			if (isTitleChanged) {
				setTimeout(() => {
					window.location.href = `/${result.data.slug}`;
				}, 1000);
			}
		} catch (error) {
			console.error(error);
			showToast('Failed to save note', 'error');
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
		const slug = $page.url.pathname.split('/')[1];
		getNoteFromLocalStorage(slug);
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

		$effect(() => {
			if (excalidrawAPI) {
				// Destructure the three arguments: elements, appState, and files
				excalidrawAPI.onChange((elements, files) => {
					// console.log('Elements:', elements);
					// console.log('Files:', files);
					if (elements.length > 0) {
						const currentContent = JSON.stringify({ elements: elements, files: files });
						const originalContent = JSON.stringify({
							elements: JSON.parse(originalNote.content).elements,
							files: JSON.parse(originalNote.content).files
						});
						excalidrawIsDirty = currentContent !== originalContent;
					} else {
						excalidrawIsDirty =
							originalNote && originalNote.content !== '{"elements": [], "files": {}}';
					}
				});
			}
		});
	});
</script>

{#if isAuthenticated.value}
	<div class="main">
		{#if error}
			{error}
		{:else if EditorNoteData.value}
			<div class="note flex h-full flex-col gap-2 rounded-md">
				<div class="drawer lg:drawer-open h-full">
					<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
					<div class="drawer-content flex h-full flex-col gap-2">
						<div class="buttons flex gap-3">
							<div class="sidebar-toggle hidden">
								<label for="my-drawer-4" aria-label="open sidebar" class="btn btn-ghost">
									<Icon icon="meteor-icons:sidebar" width="22" height="22" />
								</label>
							</div>
							<div class="save-button">
								{#if isChanged}
									<button class="btn btn-accent btn-outline shadow-xl" onclick={saveNote}
										>Save</button
									>
								{:else}
									<button class="btn btn-accent btn-outline shadow-xl" disabled>Save</button>
								{/if}
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
						</div>
						<div class="editor flex-1">
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
					<div class="drawer-side is-drawer-close:overflow-visible">
						<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
						<div
							class="bg-base-200 is-drawer-close:w-82 is-drawer-open:w-82 flex min-h-full w-82 flex-col items-start"
						>
							<div class="flex flex-col gap-4 p-2">
								<div class="top-bar flex flex-row gap-2">
									<h2 class="font-bold">Enter Metadata for your Note Here:</h2>
								</div>
								<div class="new-note-data flex w-72 flex-row flex-wrap gap-3">
									{#each Object.keys(EditorNoteData.value) as newNoteKey}
										{#if ['title', 'dateCreated', 'academicLevel', 'topic', 'visibility', 'language', 'keywords'].includes(newNoteKey)}
											<label class="form-control">
												<div class="label">
													<span class="label-text">{toTitleCase(newNoteKey)}:</span>
												</div>
												{#if newNoteKey == 'dateCreated'}
													<input
														type="date"
														class="input-bordered input metadata-input-field"
														bind:value={EditorNoteData.value[newNoteKey]}
														required
														placeholder="Date Created"
													/>
												{:else if newNoteKey == 'academicLevel'}
													<div class="academicLevel flex flex-wrap gap-5">
														<select
															class="select select-bordered metadata-input-field"
															bind:value={isK_12}
															required
														>
															<option value="true">K-12</option>
															<option value="false">Not K-12</option>
														</select>
														{#if isK_12 == 'true'}
															<input
																type="text"
																class="input-bordered input metadata-input-field"
																required
																bind:value={EditorNoteData.value[newNoteKey]}
																placeholder={toTitleCase(newNoteKey)}
															/>
														{:else}
															<select
																class="select select-bordered metadata-input-field"
																bind:value={EditorNoteData.value[newNoteKey]}
																required
															>
																<option value="UG">Undergraduate (UG)</option>
																<option value="G">Graduate (G)</option>
																<option value="PG">Postgraduate (PG)</option>
															</select>
														{/if}
													</div>
												{:else if newNoteKey == 'visibility'}
													<select
														class="select select-bordered metadata-input-field"
														bind:value={EditorNoteData.value[newNoteKey]}
														required
													>
														<option value="private">Private</option>
														<option value="public">Public</option>
													</select>
												{:else}
													<input
														type="text"
														class="input-bordered input metadata-input-field"
														required
														bind:value={EditorNoteData.value[newNoteKey]}
														placeholder={toTitleCase(newNoteKey)}
													/>
												{/if}
											</label>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ShareModel slug={EditorNoteData.value.slug} />
		{:else}
			<div class="loadingNotes"><h1>Loading Your Note...</h1></div>
		{/if}
	</div>
{:else}
	<p class="errorMessage">You are not logged in. Please login to continue.</p>
{/if}

<div class="active dark hidden"></div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	@media (max-width: 1023px) {
		.sidebar-toggle {
			display: block;
		}
		.drawer-side {
			height: calc(100vh - 64px);
			margin-top: 64px;
		}
	}
	.note {
		padding: 5px;
	}
</style>

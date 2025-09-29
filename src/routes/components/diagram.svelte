<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { validateNote } from '$lib/utils/validateNote';
	import type { note } from '../types';
	import Excalidraw from './Excalidraw.svelte';
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

	// Variables
	let newNote: note = $state({
		title: '',
		notescontent: '',
		dateCreated: '',
		grade: '',
		subject: '',
		type: ''
	});
	let isValid: boolean = $state(false);

	let excalidrawAPI: ExcalidrawImperativeAPI | undefined = $state();

	// $effect(() => {
	// 	if (excalidrawAPI) {
	// 		// Destructure the three arguments: elements, appState, and files
	// 		excalidrawAPI.onChange((elements, appState, files) => {
	// 			console.log('Elements:', elements);

	// 			console.log('Files:', files);
	// 		});
	// 	}
	// });

	async function addNote() {
		if (!validateNote(newNote)) {
			console.error('Note is not in correct form to be added to database.');
			showToast(
				'Data type error.',
				'The note is not in correct form. Please recheck your data.',
				3000,
				'error'
			);
			return;
		}
		try {
			if (excalidrawAPI) {
				const elements = excalidrawAPI.getSceneElements();
				const files = excalidrawAPI.getFiles();

				// console.log('Elements:', elements);
				// console.log('Files:', files);

				newNote.notescontent = JSON.stringify({ elements: elements, files: files });

				// console.log(newNote);
				await addToDB(newNote);
				showToast('Successfully added note', 'Note added successfully', 1000, 'success');
				window.location.href = '/';
			} else {
				showToast('Error saving note...', 'There is an error with the editor.', 3000, 'error');
				throw new Error();
			}
		} catch (error) {
			console.error('There was an error:', error);
		}
	}
	async function addToDB(note: note): Promise<boolean> {
		try {
			const request = await fetch('/new-note', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					note: note,
					type: 'diagram'
				})
			});
			const result = await request.json();
			// console.log(result);
			if (result.status == 401) {
				showToast('Error', 'You must be logged in to save notes.', 3000, 'error');
				return false;
			}
			if (result.status == 200) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.error('There was an error:', error);
			return false;
		}
	}
</script>

<dialog id="meta_data_modal" class="modal">
	<div class="modal-box flex w-96 flex-col">
		<div class="absolute right-2">
			<form method="dialog" onsubmit={(e) => e.preventDefault()}>
				<button
					class="btn btn-ghost btn-sm btn-circle top-2"
					onclick={(e) => {
						e.preventDefault();
						isValid = validateNote(newNote);
						if (isValid) {
							const meta_data_modal = document.getElementById(
								'meta_data_modal'
							) as HTMLDialogElement;
							meta_data_modal.close();
						} else {
							showToast(
								'Data type error.',
								'The note is not in correct form. Please recheck your data.',
								3000,
								'error'
							);
						}
						// console.log(newNote);
					}}>✕</button
				>
			</form>
		</div>
		<div class="flex flex-col gap-2">
			<h3>Enter Metadata for your Note Here:</h3>
			<div class="new-note-data flex flex-row flex-wrap gap-3">
				{#each Object.keys(newNote) as newNoteKey}
					{#if ['title', 'dateCreated', 'grade', 'subject'].includes(newNoteKey)}
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">{newNoteKey}:</span>
							</div>
							{#if newNoteKey == 'dateCreated'}
								<input
									type="date"
									class="input-bordered input w-full max-w-xs"
									bind:value={newNote[newNoteKey]}
									required
									placeholder="Date Created"
								/>
							{:else}
								<input
									type="text"
									class="input-bordered input w-full max-w-xs"
									required
									bind:value={newNote[newNoteKey]}
									placeholder={newNoteKey}
								/>
							{/if}
						</label>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</dialog>

<div class="main-component">
	<div class="content flex h-full flex-col gap-3 p-2">
		<div class="header flex flex-col gap-3 p-2">
			<div class="header-box flex flex-col items-center justify-center">
				<div class="mb-1 flex items-center gap-3">
					<h2 class="component-title mb-0 text-4xl font-extrabold drop-shadow">Add a Diagram</h2>
				</div>
			</div>
			<div class="buttons flex flex-row gap-2">
				<div class="metadata-btn w-40">
					<button
						class="btn border-base-content h-12 border"
						onclick={() => {
							const meta_data_modal = document.getElementById(
								'meta_data_modal'
							) as HTMLDialogElement;
							meta_data_modal.showModal();
						}}>Edit Metadata</button
					>
				</div>
				<div class="save-button-container w-40">
					{#if validateNote(newNote)}
						<button
							class="btn btn-accent btn-outline border-base-content h-12 border"
							onclick={addNote}>Add Note</button
						>
					{:else}
						<button
							class="btn btn-disabled btn-accent btn-outline border-base-content h-12 border"
							onclick={addNote}>Add Note</button
						>
					{/if}
				</div>
			</div>
		</div>
		<div class="editor h-full">
			<Excalidraw
				theme="dark"
				excalidrawAPI={(api) => (excalidrawAPI = api)}
				viewModeEnabled={false}
			/>
		</div>
	</div>
</div>

<style>
	.main-component {
		animation: fadeInDown 0.5s ease-in-out;
		height: calc(100vh - 140px);
	}
	.header-box {
		text-align: center;
		animation: fadeInDown 0.5s ease-in-out;
	}
	.header-box h2 {
		font-weight: bold;
		animation: fadeInDown 0.5s ease-in-out;
	}
	/* Form container */
	.new-note-data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
		/* Space between fields */
		animation: fadeInDown 0.5s ease-in-out;
	}
	@media (max-width: 600px) {
		.component-title {
			font-size: 1.5rem;
		}
	}

	/* Label styling */
	.form-control {
		width: 100%;
		/* Full width for inputs */
		display: flex;
		flex-direction: column;
	}

	.form-control .label-text {
		font-weight: 600;
		margin-bottom: 5px;
		transition: color 0.3s ease-in-out;
	}

	/* Input styling */
	.form-control input {
		padding: 10px;
		border: 2px solid #333333;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.3s ease-in-out;
	}

	.form-control input:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(107, 136, 190, 0.4);
	}

	/* Button styling */
	.btn {
		padding: 10px 20px;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.btn:active {
		transform: translateY(0);
		box-shadow: none;
	}

	/* Animations */
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-50px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

<script lang="ts">
	import { functionReturn } from '$lib/utils/functionReturn';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { validateNote } from '$lib/utils/validateNote';
	import type { note } from '../types';
	import Excalidraw from './Excalidraw.svelte';
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

	// Variables
	let isValid: boolean = $state(false);
	let props = $props();
	let newNote: note = props.newNote;

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
				'The note is not in correct form. Please recheck your data.',

				'error'
			);
			return;
		}

		if (excalidrawAPI) {
			const elements = excalidrawAPI.getSceneElements();
			const files = excalidrawAPI.getFiles();

			newNote.content = JSON.stringify({ elements: elements, files: files });
			newNote.type = 'diagram';

			const [success, error] = await addToDB(newNote);
			if (error || !success) {
				showToast('There is an error with the editor.', 'error');
			}
			showToast('Note added successfully', 'success');
			window.location.href = '/';
		} else {
			showToast('There is an error with the editor.', 'error');
		}
	}
	async function addToDB(note: note) {
		try {
			const request = await fetch('/new-note', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					note: note
				})
			});
			const result = await request.json();
			switch (result.status) {
				case 401:
					showToast('You must be logged in to save notes.', 'error');
					return functionReturn(false, true, 'Error adding note', null, null);
				case 400:
					return functionReturn(false, true, 'Error adding note', null, result.error);
				case 200:
					return functionReturn(true, false, 'Note added successfully', result.data, null);
				default:
					return functionReturn(false, true, 'Error adding note', null, null);
			}
		} catch (error) {
			console.error('There was an error:', error);
			return functionReturn(false, true, 'Error adding note', null, error);
		}
	}
</script>

<div class="main-component">
	<div class="content flex h-full flex-col gap-3 p-2">
		<div class="header flex flex-col gap-3">
			<div class="buttons flex flex-row gap-3">
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

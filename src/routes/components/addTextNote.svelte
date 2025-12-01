<script lang="ts">
	// Imports
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { editorState, isAuthenticated } from '$lib/stores/store.svelte';
	import DOMPurify from 'dompurify';
	import Tiptap from '../components/tiptap.svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';
	import type { functionReturnData, returnData } from '../interfaces';
	import { functionReturn } from '$lib/utils/functionReturn';
	import { onMount } from 'svelte';

	// Variables
	let props = $props();
	let newNote: note = props.newNote;

	// Functions
	async function addNote() {
		if (!validateNote(newNote)) {
			console.error('Note is not in correct form to be added to database.');
			showToast(
				'The note is not in correct form. Please recheck your data.',

				'error'
			);
			return;
		}
		const rawHtml = editorState.editor.getHTML();
		newNote.content = DOMPurify.sanitize(rawHtml);
		newNote.type = 'text';

		const [success, error] = await addToDB(newNote);
		if (error || !success) {
			showToast('There is an error with the editor.', 'error');
		}
		showToast('Note added successfully', 'success');
		window.location.href = '/';
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
	<div class="content flex h-full flex-col gap-3 p-2 pl-3">
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
			<Tiptap content={newNote.content} editable={true} />
		</div>
	</div>
</div>

<style>
	.main-component {
		animation: fadeInDown 0.5s ease-in-out;
		height: calc(100vh - 200px);
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

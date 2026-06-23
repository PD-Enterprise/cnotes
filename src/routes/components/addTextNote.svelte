<script lang="ts">
	// Imports
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { editorState, newNoteData } from '$lib/stores/store.svelte';
	import DOMPurify from 'dompurify';
	import Tiptap from '../components/tiptap.svelte';
	import { functionReturn } from '$lib/utils/functionReturn';
	import { validateAcademicLevel } from '$lib/utils/validateAcademicLevel';

	// Functions
	async function addNote() {
		const rawHtml = editorState.editor.getHTML();
		newNoteData.value.content = DOMPurify.sanitize(rawHtml);
		newNoteData.value.type = 'text';

		if (!validateNote(newNoteData.value)) {
			console.error('Note is not in correct form to be added to database.');
			showToast('The note is not in correct form. Please recheck your data.', 'error');
			return;
		}
		if (!validateAcademicLevel(newNoteData.value.academicLevel)) {
			console.error('Academic level is not in correct form to be added to database.');
			showToast('The Academic Level must be between 1 and 12. Or UG, G, or PG.', 'error');
			return;
		}

		const [success, error] = await addToDB(newNoteData.value);
		if (error || !success) {
			showToast('There is an error with the editor.', 'error');
			return;
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
			console.log(result);

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
					<button
							class="btn btn-accent btn-outline border-base-content h-12 border"
							onclick={addNote}>Add Note</button
						>
				</div>
			</div>
		</div>
		<div class="editor h-full">
			<Tiptap content={newNoteData.value.content} editable={true} />
		</div>
	</div>
</div>

<style>
	.main-component {
		height: calc(100vh - 200px);
	}
</style>

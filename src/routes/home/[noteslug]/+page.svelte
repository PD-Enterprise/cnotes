<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import type { note } from '../../types';
	import { Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	import config from '$lib/utils/apiConfig';
	import { showToast } from '$lib/utils/svelteToastsUtil';

	// Variables
	let noteData = $state<note>({
		title: '',
		board: '',
		dateCreated: '',
		grade: undefined,
		subject: '',
		notescontent: '',
		slug: '',
		email: ''
	});
	let originalNoteData: note | null = $state(null);
	let error: string = $state('');
	const isChanged = $derived(
		originalNoteData && JSON.stringify(noteData) !== JSON.stringify(originalNoteData)
	);
	let editor: TipexEditor = $state();

	// Functions
	async function getNote(slug: string) {
		if (!slug) {
			return;
		}
		// console.log(slug);
		const storedNote = localStorage.getItem(`note:${slug}`);
		// console.log(storedNote);
		if (storedNote) {
			const decrypedNote = atob(storedNote);
			// console.log(decrypedNote);
			noteData = JSON.parse(decrypedNote);
			originalNoteData = JSON.parse(decrypedNote);
			// console.log(noteData);
		}
	}
	async function saveNote() {
		noteData.dateUpdated = new Date().toISOString();

		try {
			const response = await fetch(`${config.apiUrl}notes/note/text/${noteData.slug}/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: JSON.parse(atob(localStorage.getItem('user') || '{}')).email,
					data: noteData
				})
			});

			if (!response.ok) {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.indexOf('application/json') !== -1) {
					const errorData = await response.json();
					console.error('Failed to save note:', errorData);
					showToast('Error', 'Failed to save note', 3000, 'error');
				} else {
					const errorText = await response.text();
					console.error('Failed to save note. Server returned non-JSON response:', errorText);
					showToast('Error', 'Failed to save note: Server error', 3000, 'error');
				}
				return;
			}
			const result = await response.json();
			console.log(result);
			originalNoteData = JSON.parse(JSON.stringify(noteData));
			showToast('Success', 'Note saved successfully', 3000, 'success');
		} catch (e) {
			console.error(e);
			showToast('Error', 'Failed to save note', 3000, 'error');
		}
	}
	onMount(async () => {
		noteData.slug = window.location.href.split('/home/')[1];
		// console.log(noteData.slug);
		getNote(noteData.slug);
	});
</script>

<div class="main p-2">
	{#if error}
		{error}
	{:else if noteData}
		<div class="note flex flex-col gap-3">
			<input
				type="text"
				class="edit-title input-bordered input w-full text-lg font-bold"
				placeholder="Title"
				bind:value={noteData.title}
			/>
			<div class="meta-data">
				{#each Object.keys(noteData) as noteDataKey}
					{#if ['board', 'dateCreated', 'grade', 'subject'].includes(noteDataKey)}
						<div class="w-full max-w-xs">
							<div class="label">
								<span class="label-text">{noteDataKey}:</span>
							</div>
							{#if noteDataKey == 'dateCreated'}
								<input
									type="date"
									class="input-bordered input"
									placeholder={noteDataKey}
									bind:value={noteData[noteDataKey]}
								/>{:else}
								<input
									type="text"
									class="input-bordered input"
									placeholder={noteDataKey}
									bind:value={noteData[noteDataKey]}
								/>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
			<div class="buttons mt-2 flex gap-2">
				{#if isChanged}
					<button class="btn btn-accent btn-outline" onclick={saveNote}>Save</button>
				{:else}
					<button class="btn btn-accent btn-outline" disabled>Save</button>
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
			<div class="editor dark">
				<Tipex
					body={noteData.notescontent}
					controls
					floating
					focal
					oncreate={() => {
						// console.log('editor created');
						editor.commands.insertContent(noteData.notescontent);
					}}
					onupdate={() => {
						// console.log(editor.getHTML());
						noteData.notescontent = editor.getHTML();
					}}
					bind:tipex={editor}
					class="p-2"
					style="height: calc(100vh - 200px)"
				/>
			</div>
		</div>
		<dialog id="share_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">✕</button>
				</form>
				<span>Link:</span>
				<a href="/home/{noteData.slug}/sharing" class="share-link">
					https://cnotes.pages.dev/{noteData.slug}/sharing
				</a>
			</div>
		</dialog>
	{:else}
		<div class="loadingNotes"><h1>Loading Your Note...</h1></div>
	{/if}
</div>

<style>
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
</style>

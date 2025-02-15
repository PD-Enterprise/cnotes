<script lang="ts">
	import { onMount } from 'svelte';
	import type { note } from '../../types';
	import SvelteToast from '../../components/svelteToast.svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import Editor from '../../components/editor.svelte';
	import editorRef from '../../components/editor.svelte';
	import { isChanged } from '$lib/stores/ischanged';
	import Input from '../../components/input.svelte';

	// Variables
	let data: note[] = [];
	let slug: string = '';
	let error: string = '';
	let originalData: note[] = []; // Store original data for comparison
	let conf = {
		setup: (editor) => {
			editor.addShortcut('ctrl+s', 'Save', () => {
				updateNote();
			});
		}
	};
	let isEditorLoading: boolean = true;

	// Functions
	async function getNote(slug: string, email: string) {
		const response = await fetch('/api/notes/note', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				slug: slug,
				email: email
			})
		});
		const result = await response.json();
		// console.log(result);
		if (result.status == 'success') {
			if (result.response.length > 0) {
				data = result.response;
				data[0].date_created = new Date(data[0].date_created).toISOString().split('T')[0];
				originalData = JSON.parse(JSON.stringify(result.response)); // Deep copy original data
				localStorage.setItem('notes', JSON.stringify(result.response));
				return true;
			}
		} else {
			error = 'Error getting note from database.';
			return false;
		}
	}
	function updateNote() {
		showToast('Saving...', 'Saving your note...', 2500, 'info');
		console.log('isChanged', $isChanged);
		if ($isChanged) {
			syncWithBackend();
		}
	}
	function checkForChanges() {
		// Compare current data with original data
		const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
		isChanged.set(hasChanges);
	}
	async function syncWithBackend() {
		console.log('Syncing with backend...');
		const response = await fetch('/api/notes/note/update-note', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: data,
				email: sessionStorage.getItem('Email')
			})
		});
		const result = await response.json();
		// console.log(result);
		if (result.status === 'success') {
			showToast('Success', 'Note saved successfully', 2500, 'success');
			isChanged.set(false);
		} else {
			showToast('Error', 'Failed to save note', 2500, 'error');
		}
	}
	onMount(async () => {
		isEditorLoading = false;

		const userEmail = sessionStorage.getItem('Email');
		const localNotes = localStorage.getItem('notes');

		slug = window.location.href.split('/home/')[1].split('/sharing')[0];

		if (userEmail) {
			const noteExists = await getNote(slug, userEmail);
			if (!noteExists && localNotes) {
				if (localNotes.length > 0) {
					const allNotes = JSON.parse(localNotes);
					// Filter notes to find the one matching the current slug
					data = allNotes.filter((note: note) => note.slug === slug);
					originalData = JSON.parse(JSON.stringify(data)); // Deep copy original data
				} else {
					error = 'Note not found';
				}
			} else if (!localNotes) {
				showToast('error', 'Note not found.', 2500, 'error');
			}
		} else {
			error = 'You mussed be logged in to view your notes';
		}
	});
	export { updateNote };
</script>

<SvelteToast />

{#if error}
	{error}
{:else if data.length > 0}
	<div class="note">
		<input
			type="text"
			class="edit-title input input-bordered w-full text-lg font-bold"
			bind:value={data[0].title}
			on:input={checkForChanges}
		/><br /><br />
		<div class="meta-data">
			<Input {data} title="Board" tag="board" {originalData} />

			<Input {data} title="Created Date" tag="date_created" {originalData} type="date" />
			<Input {data} title="Grade" tag="grade" {originalData} />

			<Input {data} title="School" tag="school" {originalData} />

			<Input {data} title="Subject" tag="subject" {originalData} />
		</div>
		<div class="buttons mt-2">
			{#if $isChanged}
				<button class="btn btn-outline btn-accent" on:click={updateNote}>Save</button>
			{:else}
				<button class="btn btn-outline btn-accent" disabled>Save</button>
			{/if}
			<button
				class="btn btn-success"
				on:click={() => {
					const my_modal_4 = document.getElementById('my_modal_4') as HTMLDialogElement;
					my_modal_4.showModal();
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
		<br />
		<div class="editor">
			{#if isEditorLoading}
				<div>Loading editor...</div>
			{:else}
				<Editor {data} {...conf} />
			{/if}
		</div>
	</div>
	<dialog id="my_modal_4" class="modal">
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
			</form>
			<label>Link:</label>
			<a href="/home/{data[0].slug}/sharing" class="share-link"
				>https://cnotes.pages.dev/{data[0].slug}/sharing</a
			>
		</div>
	</dialog>
{:else}
	<div class="loadingNotes"><h1>Loading Your Note...</h1></div>
{/if}

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
	.editor {
		height: 120vh;
	}
</style>

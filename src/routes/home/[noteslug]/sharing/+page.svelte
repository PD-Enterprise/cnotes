<script lang="ts">
	import { onMount } from 'svelte';
	import type { note } from '../../../types';
	import SvelteToast from '../../../components/svelteToast.svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import Editor from '../../../components/editor.svelte';
	import Input from '../../../components/input.svelte';

	// Variables
	let data: note[] = [];
	let slug: string = '';
	let error: string = '';
	let originalData: note[] = []; // Store original data for comparison
	let conf = {
		editable_root: false
	};
	let isEditorLoading: boolean = true;

	// Functions
	async function getNote(slug: string) {
		// First try to get note from localStorage using specific key
		const localNote = localStorage.getItem(`note_${slug}`);
		if (localNote) {
			const parsedNote = JSON.parse(localNote);
			data = [parsedNote];
			data[0].date_created = new Date(data[0].date_created).toISOString().split('T')[0];
			originalData = JSON.parse(JSON.stringify(data));
			console.log('Loaded shared note from localStorage:', data);
			return true;
		}

		// Then fetch from server
		const response = await fetch('/api/notes/note/sharing', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				slug: slug
			})
		});
		const result = await response.json();

		if (result.status == 'success' && result.response.length > 0) {
			data = result.response;
			data[0].date_created = new Date(data[0].date_created).toISOString().split('T')[0];
			originalData = JSON.parse(JSON.stringify(result.response));

			// Cache the note
			localStorage.setItem(`note_${slug}`, JSON.stringify(result.response[0]));

			return true;
		} else {
			error = 'Error getting note from database.';
			return false;
		}
	}

	onMount(async () => {
		isEditorLoading = false;
		slug = window.location.href.split('/home/')[1].split('/sharing')[0];

		await getNote(slug);
	});
</script>

<SvelteToast />

{#if error}
	{error}
{:else if data.length > 0}
	<div class="note">
		<h1 class="w-full text-3xl font-bold">
			{data[0].title}
		</h1>
		<br />
		<div class="meta-data">
			<Input {data} title="Board" tag="board" {originalData} isDisabled="true" />
			<Input
				{data}
				title="Created Date"
				tag="date_created"
				{originalData}
				type="date"
				isDisabled="true"
			/>
			<Input {data} title="Grade" tag="grade" {originalData} isDisabled="true" />
			<Input {data} title="School" tag="school" {originalData} isDisabled="true" />
			<Input {data} title="Subject" tag="subject" {originalData} isDisabled="true" />
		</div>
		<br />
		<div class="buttons mt-2">
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
			<label for="share-link">Link:</label>
			<div class="share-container">
				<a id="share-link" href="/home/{data[0].slug}/sharing" class="share-link"
					>https://cnotes.pages.dev/{data[0].slug}/sharing</a
				>
				<button
					class="btn btn-square btn-sm"
					aria-label="Copy share link to clipboard"
					on:click={() => {
						navigator.clipboard.writeText(`https://cnotes.pages.dev/${data[0].slug}/sharing`);
						showToast('success', 'Link copied to clipboard!', 2500, 'success');
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
						/>
					</svg>
				</button>
			</div>
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
		height: 750px;
	}
	.share-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>

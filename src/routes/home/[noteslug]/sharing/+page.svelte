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
	// Functions
	async function getNote(slug: string, email: string) {
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
	onMount(async () => {
		const userEmail = sessionStorage.getItem('Email');
		const localNotes = localStorage.getItem('notes');

		slug = window.location.href.split('/home/')[1].split('/sharing')[0];

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
			<Editor {data} {...conf} />
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

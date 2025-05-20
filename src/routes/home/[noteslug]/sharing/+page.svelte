<script lang="ts">
	import { onMount } from 'svelte';
	import type { note } from '../../../types';
	import { showToast } from '$lib/utils/svelteToastsUtil';

	// Variables
	let noteData: note = {
		title: '',
		board: '',
		dateCreated: '',
		grade: undefined,
		subject: '',
		notescontent: '',
		slug: '',
		email: ''
	};
	let error: string = '';

	// Functions
	async function getNote(slug: string) {
		if (!slug) {
			return;
		}
		// console.log(slug);
		const storedNote = localStorage.getItem(`note:${slug}`);
		// console.log(storedNote);
		const decrypedNote = atob(storedNote);
		// console.log(decrypedNote);
		noteData = JSON.parse(decrypedNote);
		// console.log(noteData);
	}

	onMount(async () => {
		noteData.slug = window.location.href.split('/home/')[1].split('/sharing')[0];
		// console.log(noteData.slug);
		getNote(noteData.slug);
	});
</script>

<div class="main p-2">
	{#if error}
		{error}
	{:else if noteData}
		<div class="note">
			<h1 class="w-full text-3xl font-bold">
				{noteData.title}
			</h1>
			<br />
			<div class="meta-data">
				{#each Object.keys(noteData) as noteDataKey}
					{#if ['board', 'dateCreated', 'grade', 'subject'].includes(noteDataKey)}
						<div class="w-full max-w-xs">
							<div class="label">
								<span class="label-text">{noteDataKey}:</span>
							</div>
							<h2 class="label-body">{noteData[noteDataKey]}</h2>
						</div>
					{/if}
				{/each}
			</div>
			<br />
			<div class="buttons mt-2">
				<button
					class="btn btn-success"
					on:click={() => {
						const share_modal = document.getElementById('share_modal') as HTMLDialogElement;
						share_modal.showModal();
					}}
				>
					Share<svg
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
						/>
					</svg>
				</button>
			</div>
		</div>
		<br />
		<div class="editor">
			{@html noteData.notescontent}
		</div>
		<dialog id="share_modal" class="modal">
			<div class="modal-box">
				<form method="dialog">
					<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
				</form>
				<label for="share-link">Link:</label>
				<div class="share-container">
					<a
						id="share-link"
						href="https://cnotes.pages.dev/{noteData.slug}/sharing"
						class="share-link">https://cnotes.pages.dev/{noteData.slug}/sharing</a
					>
					<button
						class="btn btn-square btn-sm"
						aria-label="Copy share link to clipboard"
						on:click={() => {
							navigator.clipboard.writeText(`https://cnotes.pages.dev/${noteData.slug}/sharing`);
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
	.share-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>

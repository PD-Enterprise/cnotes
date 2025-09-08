<script lang="ts">
	import { onMount } from 'svelte';
	import type { note } from '../../types';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import DOMPurify from 'dompurify';
	import { page } from '$app/stores';
	import Tiptap from '../../components/tiptap.svelte';

	// Variables
	let errorMessage: string = '';
	let noteData = $state<note>({
		title: '',
		board: '',
		dateCreated: '',
		grade: undefined,
		subject: '',
		notescontent: ''
	});
	let localNote = null;
	let hasLocalNote = false;

	// Functions
	async function getNoteFromServer() {
		const slug = $page.url.pathname.split('/sharing')[0].split('/')[1];

		const request = await fetch(`/${slug}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await request.json();
		console.log(result);

		if (result.status != 200) {
			errorMessage = 'Note not found.';
			return;
		}

		const serverNote = result.data;
		// console.log(serverNote);
		if (serverNote && serverNote != undefined) {
			noteData = { ...serverNote };
		} else {
			onMount(() => {
				const slug = $page.url.pathname.split('/home/')[1].split('/sharing')[0];
				getNoteFromLocalStorage(slug);
			});
		}
	}
	async function getNoteFromLocalStorage(slug: string) {
		const storedNote = localStorage.getItem(`note:${slug}`);
		if (storedNote) {
			hasLocalNote = true;
			try {
				localNote = JSON.parse(decodeURIComponent(escape(atob(storedNote))));
			} catch (e) {}
			noteData = { ...localNote };
		}
	}
</script>

<div class="main">
	{#await getNoteFromServer()}
		<div class="loadingNotes"><h1>Loading Your Note...</h1></div>
	{:then}
		{#if noteData}
			<div class="content flex flex-col gap-3">
				<div class="metadata-box bg-base-300 flex flex-col gap-2 rounded-md p-2">
					<h1 class="w-full p-2 text-3xl font-bold">
						{noteData.title}
					</h1>
					<div class="meta-data flex flex-col flex-wrap items-center justify-center">
						{#each Object.keys(noteData) as noteDataKey}
							{#if ['board', 'dateCreated', 'grade', 'subject'].includes(noteDataKey)}
								<div class="mx-auto">
									<div class="label text-center">
										<span class="label-text">
											{noteDataKey
												.replace(/([A-Z])/g, ' $1')
												.replace(/^./, (str) => str.toUpperCase())}:
										</span>
									</div>
									<h2 class="label-body text-center">{noteData[noteDataKey]}</h2>
								</div>
							{/if}
						{/each}
					</div>
					<div class="buttons">
						<button
							class="share-btn btn btn-success"
							onclick={() => {
								const share_modal = document.getElementById('share_modal') as HTMLDialogElement;
								share_modal.showModal();
							}}
						>
							Share
							<svg
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
				<div
					class="editor-container border-base-300 bg-base-200 h-full overflow-hidden rounded-lg border-4 p-2"
				>
					<div class="editor dark p-1">
						<Tiptap content={noteData.notescontent} editable={false} />
					</div>
				</div>
			</div>
			<dialog id="share_modal" class="modal">
				<div class="modal-box">
					<form method="dialog">
						<button class="btn btn-ghost btn-sm btn-circle absolute top-2 right-2">✕</button>
					</form>
					<label for="share-link">Link:</label>
					<div class="share-container">
						<a
							id="share-link"
							href="https://cnotes.pages.dev/{noteData.slug}/sharing"
							class="share-link">https://cnotes.pages.dev/{noteData.slug}/sharing</a
						>
						<button
							class="btn btn-sm btn-square"
							aria-label="Copy share link to clipboard"
							onclick={() => {
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
		{:else if errorMessage}
			<p class="errorMessage">{errorMessage}</p>
		{:else}
			<p class="loadingNotes">No note found.</p>
		{/if}
	{/await}
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	.share-link {
		text-decoration: underline;
		color: #4a90e2;
	}
	.share-btn {
		font-size: 16px;
	}
	.meta-data {
		display: flex;
		flex-direction: row;
		gap: 10px;
		flex-wrap: wrap;
	}
	.share-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>

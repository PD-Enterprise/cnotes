<script lang="ts">
	import { onMount } from 'svelte';
	import type { note } from '../../types';
	import { page } from '$app/stores';
	import Tiptap from '../../components/tiptap.svelte';
	import Excalidraw from '../../components/Excalidraw.svelte';
	import Icon from '@iconify/svelte';
	import ShareModel from '../../components/shareModel.svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';

	// Variables
	let errorMessage: string = $state('');
	let noteData = $state<note>({
		title: '',
		dateCreated: '',
		academicLevel: '',
		topic: '',
		content: '',
		type: '',
		visibility: '',
		year: '',
		language: '',
		keywords: ''
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
		// console.log(result);

		if (result.status != 200) {
			errorMessage = 'Note not found.';
			return;
		}

		const serverNote = result.data;
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
	onMount(() => {
		getNoteFromLocalStorage($page.url.pathname.split('/sharing')[0].split('/')[1]);
		getNoteFromServer();

		// console.log(JSON.parse(noteData.notescontent));
	});
</script>

<div class="main">
	{#if noteData}
		<div class="content flex h-full flex-col">
			<div class="metadata-box bg-base-200 flex flex-col gap-1 p-2">
				<h1 class="w-full p-1 text-2xl font-bold">
					{noteData.title}
				</h1>
				<div class="meta-data flex flex-col flex-wrap items-center justify-center">
					{#each Object.keys(noteData) as noteDataKey}
						{#if ['dateCreated', 'academicLevel', 'topic', 'visibility', 'language'].includes(noteDataKey)}
							<div class="mx-auto">
								<div class="label text-center">
									<span class="label-text">
										{toTitleCase(noteDataKey)}:
									</span>
								</div>
								{#if noteDataKey == 'academicLevel'}
									{#if Number(noteData[noteDataKey])}
										<p class="label-body text-center">{noteData[noteDataKey]}th grade</p>
									{:else}
										<p class="label-body text-center">{noteData[noteDataKey]}</p>
									{/if}
								{:else}
									<p class="label-body text-center">{noteData[noteDataKey]}</p>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
				<div class="buttons flex flex-row gap-2">
					<button
						class="share-btn btn btn-success p-2"
						onclick={() => {
							const share_modal = document.getElementById('share_modal') as HTMLDialogElement;
							share_modal.showModal();
						}}
					>
						Share
						<Icon icon="material-symbols:share-outline" width="24" height="24" />
					</button>
					<a class="edit-btn btn btn-accent p-2" href={`/${noteData.slug}`}
						>Edit<Icon icon="mage:edit" width="24" height="24" /></a
					>
				</div>
			</div>
			{#if noteData.type == 'text'}
				<Tiptap content={noteData.content} editable={false} />
			{:else if noteData.type == 'diagram'}
				<Excalidraw theme="dark" content={noteData.content} viewModeEnabled={true} />
			{/if}
		</div>
		<ShareModel slug={noteData.slug} />
	{:else if errorMessage}
		<p class="errorMessage">{errorMessage}</p>
	{:else}
		<p class="loadingNotes">No note found.</p>
	{/if}
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	.share-btn {
		font-size: 16px;
	}
	.metadata-box {
		border-bottom: 1px solid var(--color-gray-500);
	}
	.meta-data {
		display: flex;
		flex-direction: row;
		gap: 10px;
		flex-wrap: wrap;
	}
</style>

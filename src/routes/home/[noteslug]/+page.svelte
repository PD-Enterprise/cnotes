<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import type { note } from '../../types';
	import { defaultExtensions, Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	import config from '$lib/utils/apiConfig';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import Underline from '@tiptap/extension-underline';
	import Heading from '@tiptap/extension-heading';
	import Icon from '@iconify/svelte';

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
	let extensions = [
		...defaultExtensions,
		Heading.configure({
			levels: [1, 2, 3, 4]
		}),
		Underline
	];

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
	function toggleUnderline() {
		if (editor) {
			editor.chain().focus().toggleUnderline().run();
		}
	}
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
					floating
					focal
					{extensions}
					bind:tipex={editor}
					class="p-2"
					style="height: calc(100vh - 200px)"
					oncreate={() => {
						console.log('editor created');
						editor.commands.insertContent(noteData.notescontent);
					}}
					onupdate={() => {
						// console.log(editor.getHTML());
						noteData.notescontent = editor.getHTML();
					}}
				>
					{#snippet controlComponent(tipex)}
						<div class="tipex-controller">
							<div class="tipex-controller-wrapper">
								<div class="tipex-basic-controller-wrapper">
									{#each { length: 4 } as _, index}
										{@const level = index + 1}
										<button
											class="tipex-edit-button"
											onclick={() => editor?.chain().focus().toggleHeading({ level }).run()}
											class:active={editor?.isActive('heading', { level })}
										>
											H{level}
										</button>
									{/each}
									<button
										aria-label="Paragraph"
										onclick={() => editor?.chain().focus().setParagraph().run()}
										class="tipex-edit-button"
										class:active={editor?.isActive('paragraph')}
									>
										<Icon icon="fa6-solid:paragraph" />
									</button>
									<button
										aria-label="Code"
										onclick={() => editor?.chain().focus().toggleUnderline().run()}
										class="tipex-edit-button"
										class:active={editor?.isActive('underline')}
									>
										<Icon icon="fa6-solid:underline" />
									</button>
									<button
										aria-label="Bold"
										onclick={() => editor?.chain().focus().toggleBold().run()}
										class="tipex-edit-button"
										class:active={editor?.isActive('bold')}
									>
										<Icon icon="fa6-solid:bold" />
									</button>
									<button
										aria-label="Italic"
										onclick={() => editor?.chain().focus().toggleItalic().run()}
										class="tipex-edit-button"
										class:active={editor?.isActive('italic')}
									>
										<Icon icon="fa6-solid:italic" />
									</button>
									<button
										aria-label="Code"
										onclick={() => editor?.chain().focus().toggleCode().run()}
										class="tipex-edit-button"
										class:active={editor?.isActive('code')}
									>
										<Icon icon="fa6-solid:code" />
									</button>
								</div>
							</div>
						</div>
					{/snippet}
				</Tipex>
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
	.tipex-controller {
		background-color: #f3f4f6; /* bg-neutral-100 */
		position: sticky;
		bottom: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem; /* gap-2 */
		border-radius: 0; /* rounded-none */
		padding-left: 0.75rem; /* px-3 */
		padding-right: 0.75rem;
		padding-top: 0.5rem; /* py-2 */
		padding-bottom: 0.5rem;
	}
	@media (min-width: 768px) {
		.tipex-controller {
			flex-direction: row;
		}
	}
	.tipex-controller.dark,
	:global(.dark) .tipex-controller {
		background-color: #171717; /* dark:bg-neutral-900 */
	}

	.tipex-controller-wrapper {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem; /* gap-3 */
	}

	.tipex-basic-controller-wrapper {
		display: flex;
		gap: 0.5rem; /* gap-2 */
	}

	.tipex-edit-button {
		background-color: #f3f4f6; /* bg-neutral-100 */
		color: #374151; /* text-neutral-700 */
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem; /* rounded-md */
		border: 0;
		padding: 0;
		font-size: 0.75rem; /* text-xs */
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-duration: 100ms;
	}
	.tipex-edit-button.dark,
	:global(.dark) .tipex-edit-button {
		background-color: rgba(31, 41, 55, 0.8); /* dark:bg-neutral-800/80 */
		color: #e5e7eb; /* dark:text-gray-200 */
	}

	.tipex-edit-button.active {
		background-color: #f3f4f6; /* bg-neutral-100 */
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
	}
	.tipex-edit-button.active.dark,
	:global(.dark) .tipex-edit-button.active {
		background-color: #374151; /* dark:bg-gray-700 */
	}
</style>

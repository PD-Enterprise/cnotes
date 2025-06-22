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
	import Youtube from '@tiptap/extension-youtube';
	import Highlight from '@tiptap/extension-highlight';
	import Subscript from '@tiptap/extension-subscript';
	import Typography from '@tiptap/extension-typography';
	import TextAlign from '@tiptap/extension-text-align';
	import '../../../katex.min.css';

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
		Underline,
		Youtube,
		Highlight.configure({
			multicolor: true
		}),
		Subscript,
		Typography,
		TextAlign
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

			// Save to localStorage
			localStorage.setItem(`note:${noteData.slug}`, JSON.stringify(noteData));

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
			<dialog id="meta_data_modal" class="modal">
				<div class="modal-box flex w-96 flex-col">
					<div class="absolute right-2">
						<form method="dialog" onsubmit={(e) => e.preventDefault()}>
							<button
								class="btn btn-ghost btn-sm btn-circle top-2"
								onclick={(e) => {
									e.preventDefault();
									const meta_data_modal = document.getElementById(
										'meta_data_modal'
									) as HTMLDialogElement;
									meta_data_modal.close();
									// console.log(newNote);
								}}>✕</button
							>
						</form>
					</div>
					<div class="flex flex-col gap-2">
						<h3>Enter Metadata for your Note Here:</h3>
						<div class="meta-data flex flex-row flex-wrap gap-3">
							{#each Object.keys(noteData) as noteDataKey}
								{#if ['title', 'board', 'dateCreated', 'grade', 'subject'].includes(noteDataKey)}
									<label class="form-control w-full max-w-xs">
										<div class="label">
											<span class="label-text">{noteDataKey}:</span>
										</div>
										{#if noteDataKey == 'dateCreated'}
											<input
												type="date"
												class="input-bordered input"
												placeholder={noteDataKey}
												required
												bind:value={noteData[noteDataKey]}
											/>
										{:else}
											<input
												type="text"
												class="input-bordered input"
												placeholder={noteDataKey}
												required
												bind:value={noteData[noteDataKey]}
											/>
										{/if}
									</label>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</dialog>
			<div class="buttons mt-2 flex gap-2">
				{#if isChanged}
					<button class="btn btn-accent btn-outline" onclick={saveNote}>Save</button>
				{:else}
					<button class="btn btn-accent btn-outline" disabled>Save</button>
				{/if}
				<button
					class="btn btn-info"
					onclick={() => {
						const meta_data_modal = document.getElementById('meta_data_modal') as HTMLDialogElement;
						meta_data_modal.showModal();
					}}>Edit Metadata</button
				>
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
											onclick={() => {
												// @ts-expect-error
												editor?.chain().focus().toggleHeading({ level }).run();
											}}
											class:active={editor?.isActive('heading', { level })}
										>
											H{level}
										</button>
									{/each}
									<button
										aria-label="Paragraph"
										onclick={() => {
											// @ts-expect-error
											editor?.chain().focus().setParagraph().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('paragraph')}
									>
										<Icon icon="fa6-solid:paragraph" />
									</button>
									<button
										aria-label="Underline"
										onclick={() => {
											editor?.chain().focus().toggleUnderline().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('underline')}
									>
										<Icon icon="fa6-solid:underline" />
									</button>
									<button
										aria-label="Highlight"
										onclick={() => {
											editor?.chain().focus().toggleHighlight().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('highlight')}
									>
										<Icon icon="fa6-solid:highlighter" />
									</button>
									<button
										aria-label="Bold"
										onclick={() => {
											// @ts-expect-error
											editor?.chain().focus().toggleBold().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('bold')}
									>
										<Icon icon="fa6-solid:bold" />
									</button>
									<button
										aria-label="Italic"
										onclick={() => {
											// @ts-expect-error
											editor?.chain().focus().toggleItalic().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('italic')}
									>
										<Icon icon="fa6-solid:italic" />
									</button>
									<button
										aria-label="Subscript"
										onclick={() => {
											editor?.chain().focus().toggleSubscript().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('subscript')}
									>
										<Icon icon="fa6-solid:subscript" />
									</button>
									<!-- <button
										aria-label="Center"
										onclick={() => {
											editor?.chain().focus().setTextAlign('center').run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive({ textAlign: 'center' })}
									>
										<Icon icon="fa6-solid:align-center" />
									</button> -->
									<button
										aria-label="Code"
										onclick={() => {
											// @ts-expect-error
											editor?.chain().focus().toggleCode().run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('code')}
									>
										<Icon icon="fa6-solid:code" />
									</button>
									<!-- <button
										aria-label="Table"
										onclick={() => {
											editor
												?.chain()
												.focus()
												.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
												.run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('Table')}
									>
										<Icon icon="fa6-solid:table" />
									</button> -->
									<button
										aria-label="Youtube"
										onclick={() => {
											const url = prompt('Enter Youtube URL');
											if (url) {
												editor
													?.chain()
													.focus()
													.setYoutubeVideo({
														src: url,
														width: Math.max(320, 640),
														height: Math.max(180, 480)
													})
													.run();
											}
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('Youtube')}
									>
										<svg
											viewBox="0 0 256 180"
											width="32"
											height="22"
											xmlns="http://www.w3.org/2000/svg"
											preserveAspectRatio="xMidYMid"
										>
											<path
												d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
												fill="red"
											/>
											<path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
										</svg>
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
	/* .Tiptap-mathematics-editor {
		background: #202020;
		color: #fff;
		font-family: monospace;
		padding: 0.2rem 0.5rem;
	}

	.Tiptap-mathematics-render {
		padding: 0 0.25rem;
	}

	.Tiptap-mathematics-render--editable {
		cursor: pointer;
		transition: background 0.2s;
	}

	.Tiptap-mathematics-render--editable:hover {
		background: #eee;
	}

	.Tiptap-mathematics-editor,
	.Tiptap-mathematics-render {
		border-radius: 0.25rem;
		display: inline-block;
	} */
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
	/* 
	.tipex-controller.dark,
	:global(.dark) .tipex-controller {
		background-color: #171717;
	} 
	*/

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
	/* 
	.tipex-edit-button.dark,
	:global(.dark) .tipex-edit-button {
		background-color: rgba(31, 41, 55, 0.8);
		color: #e5e7eb;
	}
	*/

	.tipex-edit-button.active {
		background-color: #f3f4f6; /* bg-neutral-100 */
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
	}
	/*
	.tipex-edit-button.active.dark,
	:global(.dark) .tipex-edit-button.active {
		background-color: #374151;
	}
	*/
</style>

<script lang="ts">
	// Imports
	import { Tipex, type TipexEditor, defaultExtensions } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { theme, user } from '$lib/stores/store.svelte';
	import config from '$lib/utils/apiConfig';
	import Underline from '@tiptap/extension-underline';
	import Heading from '@tiptap/extension-heading';
	import Icon from '@iconify/svelte';
	import Youtube from '@tiptap/extension-youtube';
	import Highlight from '@tiptap/extension-highlight';
	import Subscript from '@tiptap/extension-subscript';
	import Typography from '@tiptap/extension-typography';
	import TextAlign from '@tiptap/extension-text-align';
	import '../../katex.min.css';
	import Table from '@tiptap/extension-table';
	import TableRow from '@tiptap/extension-table-row';
	import TableHeader from '@tiptap/extension-table-header';
	import TableCell from '@tiptap/extension-table-cell';
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/stores/store.svelte';
	import DOMPurify from 'dompurify';

	// Variables
	let newNote: note = {
		title: '',
		slug: '',
		notescontent: '',
		board: '',
		dateCreated: '',
		email: '',
		grade: undefined,
		subject: ''
	};
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
		TextAlign,
		Table.configure({
			resizable: true
		}),
		TableRow,
		TableHeader,
		TableCell
	];
	let isValid: boolean = $state(false);

	// Functions
	async function addNote() {
		if (!$isAuthenticated) {
			showToast('Error', 'You must be logged in to save notes.', 3000, 'error');
			return;
		}
		if (!validateNote(newNote)) {
			console.error('Note is not in correct form to be added to database.');
			showToast(
				'Data type error.',
				'The note is not in correct form. Please recheck your data.',
				3000,
				'error'
			);
		} else {
			try {
				newNote.notescontent = DOMPurify.sanitize(editor.getHTML());
				newNote.slug = newNote.title.replaceAll(' ', '-').toLowerCase();

				if (user.value) {
					// @ts-expect-error
					newNote.email = user.value.email;
				} else {
					newNote.email = null;
				}

				// console.log(newNote);
				const encryptedNote = btoa(JSON.stringify(newNote));
				// console.log(encryptedNote);
				const storableNote: { key: string; value: string } = {
					key: `note:${newNote.slug}`,
					value: encryptedNote
				};

				if (localStorage.getItem(`note:${newNote.slug}`)) {
					console.error('Another note with that name already exists.');
					showToast(
						'Title name Conflict',
						'Another note with that name already exists, please choose another name',
						3000,
						'error'
					);
				} else {
					localStorage.setItem(storableNote.key, storableNote.value);
					await addToDB(newNote);
					showToast('Successfully added note', 'Note added successfully', 1000, 'success');
					window.location.href = '/home';
				}
			} catch (error) {
				console.error('There was an error:', error);
			}
		}
	}
	async function addToDB(note: note) {
		console.log(note);
		const request = await fetch(`${config.apiUrl}notes/new-note/text`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: JSON.parse(atob(localStorage.getItem('user'))).email,
				note: note
			})
		});
		const result = await request.json();
		console.log(result);
	}
	onMount(() => {
		const editor = document.getElementById('editor') as HTMLDivElement;

		$effect(() => {
			if (theme.value) {
				editor.classList.remove('dark');
			} else {
				editor.classList.add('dark');
			}
		});
	});
</script>

<dialog id="meta_data_modal" class="modal">
	<div class="modal-box flex w-96 flex-col">
		<div class="absolute right-2">
			<form method="dialog" onsubmit={(e) => e.preventDefault()}>
				<button
					class="btn btn-ghost btn-sm btn-circle top-2"
					onclick={(e) => {
						e.preventDefault();
						isValid = validateNote(newNote);
						if (isValid) {
							const meta_data_modal = document.getElementById(
								'meta_data_modal'
							) as HTMLDialogElement;
							meta_data_modal.close();
						} else {
							showToast(
								'Data type error.',
								'The note is not in correct form. Please recheck your data.',
								3000,
								'error'
							);
						}
						// console.log(newNote);
					}}>✕</button
				>
			</form>
		</div>
		<div class="flex flex-col gap-2">
			<h3>Enter Metadata for your Note Here:</h3>
			<div class="new-note-data flex flex-row flex-wrap gap-3">
				{#each Object.keys(newNote) as newNoteKey}
					{#if ['title', 'board', 'dateCreated', 'grade', 'subject'].includes(newNoteKey)}
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">{newNoteKey}:</span>
							</div>
							{#if newNoteKey == 'dateCreated'}
								<input
									type="date"
									class="input-bordered input w-full max-w-xs"
									bind:value={newNote[newNoteKey]}
									required
									placeholder="Date Created"
								/>
							{:else}
								<input
									type="text"
									class="input-bordered input w-full max-w-xs"
									required
									bind:value={newNote[newNoteKey]}
									placeholder={newNoteKey}
								/>
							{/if}
						</label>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</dialog>
<div class="main-component">
	<div class="content flex h-full flex-col gap-3 p-2">
		<div class="header flex flex-col gap-3 p-2">
			<div class="header-box flex flex-col items-center justify-center">
				<div class="mb-1 flex items-center gap-3">
					<svg width="36" height="36" viewBox="0 0 24 24" fill="none" class="text-blue-600">
						<rect x="2" y="4" width="20" height="16" rx="3" fill="#3B82F6" />
						<rect x="5" y="7" width="14" height="10" rx="2" fill="#fff" />
						<path d="M8 10h8M8 13h5" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" />
					</svg>
					<h2 class="component-title mb-0 text-4xl font-extrabold drop-shadow">Add a Text Note</h2>
				</div>
			</div>
			<div class="buttons flex flex-row gap-2">
				<div class="metadata-btn w-40">
					<button
						class="btn h-12 border border-base-content"
						onclick={() => {
							const meta_data_modal = document.getElementById(
								'meta_data_modal'
							) as HTMLDialogElement;
							meta_data_modal.showModal();
						}}>Edit Metadata</button
					>
				</div>
				<div class="save-button-container w-40">
					{#if !isValid}
						<button
							class="btn btn-disabled btn-accent btn-outline h-12 border border-base-content"
							onclick={addNote}>Add Note</button
						>
					{:else}
						<button
							class="btn btn-accent btn-outline h-12 border border-base-content"
							onclick={addNote}>Add Note</button
						>
					{/if}
				</div>
			</div>
		</div>
		<form class="editor-form-container flex h-full flex-col gap-3 bg-blue-500">
			<div class="editor h-full overflow-hidden bg-yellow-500" id="editor">
				<Tipex
					body=""
					floating
					focal
					{extensions}
					bind:tipex={editor}
					class=" h-full p-2"
					oncreate={() => {
						// console.log('editor created');
					}}
					onupdate={() => {
						// console.log(editor.getHTML());
						isValid = validateNote(newNote);
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
										aria-label="Table"
										onclick={() => {
											editor
												?.chain()
												.focus()
												.insertTable({ rows: 3, cols: 2, withHeaderRow: true })
												.run();
										}}
										class="tipex-edit-button"
										class:active={editor?.isActive('table')}
									>
										<Icon icon="fa6-solid:table" />
									</button>
									{#if editor?.isActive('table')}
										<div class="table-controls flex gap-1">
											<button
												aria-label="Add Column Before"
												onclick={() => {
													if (editor) {
														editor.chain().focus().addColumnBefore().run();
													}
												}}
												class="tipex-edit-button"
												title="Add Column Before"
											>
												<Icon icon="fa6-solid:table-columns" />
											</button>

											<button
												aria-label="Add Column After"
												onclick={() => {
													if (editor) {
														editor.chain().focus().addColumnAfter().run();
													}
												}}
												class="tipex-edit-button"
												title="Add Column After"
											>
												<Icon icon="fa6-solid:table-columns" />
											</button>

											<button
												aria-label="Add Row Before"
												onclick={() => {
													if (editor) {
														editor.chain().focus().addRowBefore().run();
													}
												}}
												class="tipex-edit-button"
												title="Add Row Before"
											>
												<Icon icon="fa6-solid:plus" />
											</button>

											<button
												aria-label="Add Row After"
												onclick={() => {
													if (editor) {
														editor.chain().focus().addRowAfter().run();
													}
												}}
												class="tipex-edit-button"
												title="Add Row After"
											>
												<Icon icon="fa6-solid:plus" />
											</button>

											<button
												aria-label="Delete Column"
												onclick={() => {
													if (editor) {
														editor.chain().focus().deleteColumn().run();
													}
												}}
												class="tipex-edit-button"
												title="Delete Column"
											>
												<Icon icon="fa6-solid:trash" />
											</button>

											<button
												aria-label="Delete Row"
												onclick={() => {
													if (editor) {
														editor.chain().focus().deleteRow().run();
													}
												}}
												class="tipex-edit-button"
												title="Delete Row"
											>
												<Icon icon="fa6-solid:trash" />
											</button>

											<button
												aria-label="Delete Table"
												onclick={() => {
													if (editor) {
														editor.chain().focus().deleteTable().run();
													}
												}}
												class="tipex-edit-button"
												title="Delete Table"
											>
												<Icon icon="fa6-solid:trash-can" />
											</button>
										</div>
									{/if}
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
		</form>
	</div>
</div>

<style>
	.main-component {
		animation: fadeInDown 0.5s ease-in-out;
		height: calc(100vh - 130px);
	}
	.header-box {
		text-align: center;
		animation: fadeInDown 0.5s ease-in-out;
	}
	.header-box h2 {
		font-weight: bold;
		animation: fadeInDown 0.5s ease-in-out;
	}
	/* Form container */
	.new-note-data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
		/* Space between fields */
		animation: fadeInDown 0.5s ease-in-out;
	}
	@media (max-width: 600px) {
		.component-title {
			font-size: 1.5rem;
		}
	}

	/* Label styling */
	.form-control {
		width: 100%;
		/* Full width for inputs */
		display: flex;
		flex-direction: column;
	}

	.form-control .label-text {
		font-weight: 600;
		margin-bottom: 5px;
		transition: color 0.3s ease-in-out;
	}

	/* Input styling */
	.form-control input {
		padding: 10px;
		border: 2px solid #333333;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.3s ease-in-out;
	}

	.form-control input:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(107, 136, 190, 0.4);
	}

	/* Button styling */
	.btn {
		padding: 10px 20px;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.btn:active {
		transform: translateY(0);
		box-shadow: none;
	}

	/* Animations */
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-50px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
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

	/* Table-specific styling */
	.tiptap table {
		border-collapse: collapse;
		margin: 0;
		overflow: hidden;
		table-layout: fixed;
		width: 100%;
	}

	.tiptap table td,
	.tiptap table th {
		border: 1px solid #e5e7eb; /* Using a Tailwind gray color instead of var(--gray-3) */
		box-sizing: border-box;
		min-width: 1em;
		padding: 6px 8px;
		position: relative;
		vertical-align: top;
	}

	.tiptap table td > *,
	.tiptap table th > * {
		margin-bottom: 0;
	}

	.tiptap table th {
		background-color: #f3f4f6; /* Using a Tailwind gray color instead of var(--gray-1) */
		font-weight: bold;
		text-align: left;
	}

	.tiptap table .selectedCell:after {
		background: rgba(
			200,
			200,
			200,
			0.4
		); /* Using a semi-transparent gray instead of var(--gray-2) */
		content: '';
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		pointer-events: none;
		position: absolute;
		z-index: 2;
	}

	.tiptap table .column-resize-handle {
		background-color: #8b5cf6; /* Using Tailwind purple color instead of var(--purple) */
		bottom: -2px;
		pointer-events: none;
		position: absolute;
		right: -2px;
		top: 0;
		width: 4px;
	}

	.tiptap .tableWrapper {
		margin: 1.5rem 0;
		overflow-x: auto;
	}

	.tiptap.resize-cursor {
		cursor: ew-resize;
		cursor: col-resize;
	}

	/* Add dark mode support */
	:global(.dark) .tiptap table td,
	:global(.dark) .tiptap table th {
		border-color: #374151; /* Dark mode border color */
	}

	:global(.dark) .tiptap table th {
		background-color: #1f2937; /* Dark mode header background */
	}

	:global(.dark) .tiptap table .selectedCell:after {
		background: rgba(55, 65, 81, 0.4); /* Dark mode selection color */
	}

	.table-controls {
		display: flex;
		align-items: center;
		padding: 2px;
		border-radius: 4px;
	}

	/* Add tooltips for the buttons */
	.tipex-edit-button {
		position: relative;
	}

	.tipex-edit-button:hover::after {
		content: attr(title);
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 4px 8px;
		border-radius: 4px;
		z-index: 10;
	}
</style>

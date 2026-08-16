<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { note } from '../types';
	import { EditorNoteData, editorState, theme, userData } from '$lib/stores/store.svelte';
	import { Editor, isActive, mergeAttributes } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import MathExtension from '@aarkue/tiptap-math-extension';
	import './tiptap-editor.css';
	import 'katex/dist/katex.min.css';
	import IconParagraph from '~icons/material-symbols/format-paragraph';
	import IconBold from '~icons/material-symbols/format-bold';
	import IconItalic from '~icons/material-symbols/format-italic';
	import IconUnderline from '~icons/material-symbols/format-underlined';
	import IconHighlight from '~icons/material-symbols/ink-highlighter';
	import IconSubscript from '~icons/material-symbols/subscript';
	import IconSuperscript from '~icons/material-symbols/superscript';
	import IconAlignLeft from '~icons/material-symbols/format-align-left';
	import IconAlignCenter from '~icons/material-symbols/format-align-center';
	import IconAlignRight from '~icons/material-symbols/format-align-right';
	import IconAlignJustify from '~icons/material-symbols/format-align-justify';
	import IconTable from '~icons/material-symbols/table';
	import IconAddRow from '~icons/material-symbols/add-row-below';
	import IconAddColumn from '~icons/material-symbols/add-column-right';
	import IconDeleteRow from '~icons/material-symbols/remove';
	import IconDeleteColumn from '~icons/material-symbols/close';
	import IconDeleteTable from '~icons/material-symbols/delete';
	import IconYoutube from '~icons/material-symbols/smart-display';
	import IconImage from '~icons/material-symbols/image';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import Heading from '@tiptap/extension-heading';
	import Underline from '@tiptap/extension-underline';
	import Youtube from '@tiptap/extension-youtube';
	import Subscript from '@tiptap/extension-subscript';
	import Superscript from '@tiptap/extension-superscript';
	import Highlight from '@tiptap/extension-highlight';
	import { TableKit } from '@tiptap/extension-table';
	import Image from '@tiptap/extension-image';
	import ImageUploadModal from './ImageUploadModal.svelte';
	import TextAlign from '@tiptap/extension-text-align';

	let element: any = $state();
	let {
		content,
		editable,
		dataStore
	}: { content: string; editable: boolean; dataStore?: { value: note } } = $props();
	let isTableActive = $state(false);
	let isParagraphActive = $state(false);
	let isUnderlineActive = $state(false);
	let isHighlightActive = $state(false);
	let isBoldActive = $state(false);
	let isItalicActive = $state(false);
	let isSubscriptActive = $state(false);
	let isSuperscriptActive = $state(false);
	let isLeftAlignActive = $state(false);
	let isCenterAlignActive = $state(false);
	let isRightAlignActive = $state(false);
	let isJustifyAlignActive = $state(false);
	let heading1Active = $state(false);
	let heading2Active = $state(false);
	let heading3Active = $state(false);
	let imageUploadCount = $state(0);
	let imageLimit = $derived(
		userData.value.membership === 'tier-1'
			? 3
			: userData.value.membership === 'tier-2' || userData.value.membership === 'tier-3'
				? 5
				: 0
	);
	let remainingUploads = $derived(imageLimit - imageUploadCount);

	function countImages(html: string): number {
		return (html.match(/<img\s/g) || []).length;
	}

	function handleImageUpload() {
		if (remainingUploads <= 0) {
			showToast('Image upload limit reached', 'error');
			return;
		}
		const dialog = document.getElementById('image_upload_modal') as HTMLDialogElement | null;
		dialog?.showModal();
	}

	const CustomHeading = Heading.extend({
		renderHTML({ node, HTMLAttributes }) {
			const level = node.attrs.level;
			let classes = '';
			switch (level) {
				case 1:
					classes = 'text-4xl font-bold';
					break;
				case 2:
					classes = 'text-3xl font-semibold';
					break;
				case 3:
					classes = 'text-2xl font-medium';
					break;
				case 4:
					classes = 'text-xl';
					break;
				default:
					classes = 'text-base';
			}
			return [`h${level}`, mergeAttributes(HTMLAttributes, { class: classes }), 0];
		}
	});

	onMount(() => {
		editorState.editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				CustomHeading.configure({ levels: [1, 2, 3] }),
				Underline,
				Highlight.configure({
					multicolor: true
				}),
				Subscript,
				Superscript,
				MathExtension.configure({
					evaluation: true
				}),
				TableKit.configure({
					table: { resizable: true }
				}),
				Youtube,
				Image.configure({ inline: true }),
				TextAlign.configure({
					types: ['heading', 'paragraph'],
					alignments: ['left', 'center', 'right', 'justify'],
					defaultAlignment: 'left'
				})
			],
			content: content || '',
			onTransaction: ({ editor }) => {
				editorState.editor = editor;

				isParagraphActive = editor.isActive('paragraph');
				isUnderlineActive = editor.isActive('underline');
				isHighlightActive = editor.isActive('highlight');
				isBoldActive = editor.isActive('bold');
				isItalicActive = editor.isActive('italic');
				isSubscriptActive = editor.isActive('subscript');
				isSuperscriptActive = editor.isActive('superscript');
				isLeftAlignActive = editor.isActive({ textAlign: 'left' });
				isCenterAlignActive = editor.isActive({ textAlign: 'center' });
				isRightAlignActive = editor.isActive({ textAlign: 'right' });
				isJustifyAlignActive = editor.isActive({ textAlign: 'justify' });
				heading1Active = editor.isActive('heading', { level: 1 });
				heading2Active = editor.isActive('heading', { level: 2 });
				heading3Active = editor.isActive('heading', { level: 3 });
			},
			onUpdate() {
				if (dataStore) {
					dataStore.value.content = editorState.editor.getHTML();
				}
			},
			editorProps: {
				attributes: {
					class: 'tiptap focus:outline-none'
				}
			},
			editable: editable,
			onSelectionUpdate: ({ editor }) => {
				if (editor.isActive('table')) {
					isTableActive = true;
				} else {
					isTableActive = false;
				}
			}
		});

		const tipexController = document.getElementById('editor') as HTMLDivElement;
		if (theme.value == true) {
			tipexController.classList.remove('dark');
		} else {
			tipexController.classList.add('dark');
		}

		if (!editable) {
			const editorElement = document.getElementById('editor') as HTMLDivElement;
			editorElement.style = 'border: none';
		}
	});
	$effect(() => {
		const html = EditorNoteData.value.content;
		if (html) {
			imageUploadCount = countImages(html);
		} else {
			imageUploadCount = countImages(content || '');
		}
	});

	$effect(() => {
		const noteContent = dataStore?.value.content;
		if (editorState.editor && noteContent) {
			if (editorState.editor.getHTML() !== noteContent) {
				editorState.editor.commands.setContent(noteContent, { emitUpdate: false });
			}
		}
	});
	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div
	class="editor-container flex w-full flex-col p-0"
	id="editor"
	style="height: calc(100vh - 65px); min-height: 400px;"
>
	{#if editable}
		<div class="tipex-controller control-group flex flex-row">
			<div class="tipex-basic-controller-wrapper flex flex-row flex-wrap rounded-md">
				<button
					class="editor-button is-active"
					title="Heading 1"
					aria-label="Heading 1"
					onclick={() => {
						editorState.editor.commands.toggleHeading({ level: 1 });
					}}
					class:active={heading1Active}
				>
					H1
				</button>
				<button
					class="editor-button is-active"
					title="Heading 2"
					aria-label="Heading 2"
					onclick={() => {
						editorState.editor.commands.toggleHeading({ level: 2 });
					}}
					class:active={heading2Active}
				>
					H2
				</button>
				<button
					class="editor-button is-active"
					title="Heading 3"
					aria-label="Heading 3"
					onclick={() => {
						editorState.editor.commands.toggleHeading({ level: 3 });
					}}
					class:active={heading3Active}
				>
					H3
				</button>
				<button
					aria-label="Paragraph"
					title="Paragraph"
					onclick={() => {
						editorState.editor.chain().focus().setParagraph().run();
					}}
					class="editor-button btn"
					class:active={isParagraphActive}><IconParagraph /></button
				>
				<button
					aria-label="Bold"
					title="Bold"
					onclick={() => {
						editorState.editor?.chain().focus().toggleBold().run();
					}}
					class="editor-button"
					class:active={isBoldActive}
				>
					<IconBold />
				</button>
				<button
					aria-label="Italic"
					title="Italic"
					onclick={() => {
						editorState.editor?.chain().focus().toggleItalic().run();
					}}
					class="editor-button"
					class:active={isItalicActive}
				>
					<IconItalic />
				</button>
				<button
					aria-label="Underline"
					title="Underline"
					class="editor-button btn"
					onclick={() => {
						editorState.editor.chain().focus().toggleUnderline().run();
					}}
					class:active={isUnderlineActive}
				>
					<IconUnderline />
				</button>
				<button
					aria-label="Highlight"
					title="Highlight"
					class="editor-button btn"
					onclick={() => {
						editorState.editor.chain().focus().toggleHighlight().run();
					}}
					class:active={isHighlightActive}><IconHighlight /></button
				>
				<button
					aria-label="Subscript"
					title="Subscript"
					onclick={() => {
						editorState.editor?.chain().focus().toggleSubscript().run();
					}}
					class="editor-button"
					class:active={isSubscriptActive}
				>
					<IconSubscript />
				</button>
				<button
					aria-label="Superscript"
					title="Superscript"
					onclick={() => {
						editorState.editor?.chain().focus().toggleSuperscript().run();
					}}
					class="editor-button"
					class:active={isSuperscriptActive}
				>
					<IconSuperscript />
				</button>
				<button
					aria-label="Left"
					title="Left"
					onclick={() => {
						editorState.editor?.commands.toggleTextAlign('left');
					}}
					class="editor-button"
					class:active={isLeftAlignActive}
				>
					<IconAlignLeft width="24" height="24" />
				</button>
				<button
					aria-label="Center"
					title="Center"
					onclick={() => {
						editorState.editor?.commands.toggleTextAlign('center');
					}}
					class="editor-button"
					class:active={isCenterAlignActive}
				>
					<IconAlignCenter width="24" height="24" />
				</button>
				<button
					aria-label="Right"
					title="Right"
					onclick={() => {
						editorState.editor?.commands.toggleTextAlign('right');
					}}
					class="editor-button"
					class:active={isRightAlignActive}
				>
					<IconAlignRight width="24" height="24" />
				</button>
				<button
					aria-label="Justify"
					title="Justify"
					onclick={() => {
						editorState.editor?.commands.toggleTextAlign('justify');
					}}
					class="editor-button"
					class:active={isJustifyAlignActive}
				>
					<IconAlignJustify width="24" height="24" />
				</button>
				<button
					aria-label="Table"
					title="Table"
					onclick={() => {
						editorState.editor
							.chain()
							.focus()
							.insertTable({ rows: 3, cols: 2, withHeaderRow: false })
							.run();
						isTableActive = true;
					}}
					class="editor-button"
					class:active={isTableActive}
				>
					<IconTable />
				</button>
				{#if isTableActive}
					<button
						aria-label="Add Row After"
						title="Add Row After"
						onclick={() => {
							if (editorState) {
								editorState.editor.chain().focus().addRowAfter().run();
							}
						}}
						class="editor-button"
					>
						<IconAddRow width="24" height="24" />
					</button>
					<button
						aria-label="Add Column After"
						title="Add Column After"
						onclick={() => {
							if (editorState) {
								editorState.editor.chain().focus().addColumnAfter().run();
							}
						}}
						class="editor-button"
					>
						<IconAddColumn width="24" height="24" />
					</button>
					<button
						aria-label="Delete Row"
						title="Delete Row"
						onclick={() => {
							if (editorState) {
								editorState.editor.chain().focus().deleteRow().run();
							}
						}}
						class="editor-button"
					>
						<IconDeleteRow width="20" height="20" />
					</button>
					<button
						aria-label="Delete Column"
						title="Delete Column"
						onclick={() => {
							if (editorState) {
								editorState.editor.chain().focus().deleteColumn().run();
							}
						}}
						class="editor-button"
					>
						<IconDeleteColumn width="20" height="20" />
					</button>
					<button
						aria-label="Delete Table"
						title="Delete Table"
						onclick={() => {
							if (editorState) {
								editorState.editor.chain().focus().deleteTable().run();
							}
						}}
						class="editor-button"
					>
						<IconDeleteTable width="20" height="20" />
					</button>
				{/if}
				<button
					aria-label="Youtube"
					title="YouTube"
					onclick={() => {
						const url = prompt('Enter Youtube URL');
						if (url) {
							editorState.editor
								.chain()
								.focus()
								.setYoutubeVideo({
									src: url,
									width: Math.max(320, 10) || 640,
									height: Math.max(180, 10) || 480
								})
								.run();
						}
					}}
					class="editor-button"
					class:active={editorState.editor?.isActive('Youtube')}
				>
					<IconYoutube width="24" height="24" />
				</button>
				<!-- <button
					aria-label="Image"
					title="Image ({remainingUploads} remaining)"
					onclick={handleImageUpload}
					class="editor-button"
					class:opacity-50={remainingUploads <= 0}
					class:cursor-not-allowed={remainingUploads <= 0}
				>
					<IconImage />
				</button> -->
			</div>
		</div>
	{/if}
	<div bind:this={element} class="editor" id="editor"></div>
</div>

<ImageUploadModal
	onInsert={(url) => editorState.editor?.chain().focus().setImage({ src: url }).run()}
/>

<!-- I am truly very sorry to whoever is going to see this in the future,
 this was causing a weird bug on the frontend,
 so i had to do this..
 Please forgive me... -->
{#if false}
	<div class="editor-button active dark hidden"></div>
	<div class="tipex-controller dark"></div>
{/if}

<style>
	.editor-container {
		overflow: hidden;
		border-radius: var(--radius-box);
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.06),
			0 1px 2px -1px rgba(0, 0, 0, 0.06);
	}
	.editor {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		border: var(--border) solid var(--color-base-300);
		border-top: none;
		background-color: var(--color-base-100);
		padding: 1rem 1rem;
		font-size: 1rem;
		line-height: 1.75;
		color: var(--color-base-content);
	}
	.tipex-controller {
		background-color: var(--color-base-200);
		z-index: 10;
		align-items: center;
		justify-content: space-between;
		border: var(--border) solid var(--color-base-300);
		border-bottom: none;
		border-radius: var(--radius-box) var(--radius-box) 0 0;
		padding: 0.375rem 0.75rem;
		gap: 0.25rem;
	}
	.tipex-basic-controller-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 0.125rem;
	}
	.editor-button {
		background-color: transparent;
		color: color-mix(in srgb, var(--color-base-content) 70%, transparent);
		display: inline-flex;
		height: 2.125rem;
		width: 2.125rem;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-field);
		border: 0;
		padding: 0;
		font-size: 0.75rem;
		font-weight: 500;
		transition: all 120ms;
		position: relative;
	}
	.editor-button:hover {
		background-color: var(--color-base-300);
		color: var(--color-base-content);
	}
	.editor-button.active {
		background-color: var(--color-base-300);
		color: var(--color-base-content);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
	}
	.editor-button:hover::after {
		content: attr(title);
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: color-mix(in srgb, var(--color-neutral) 90%, transparent);
		color: var(--color-neutral-content);
		padding: 3px 7px;
		border-radius: var(--radius-field);
		z-index: 20;
		font-size: 0.7rem;
		white-space: nowrap;
		pointer-events: none;
		margin-top: 2px;
	}
</style>

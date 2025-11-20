<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { editor, EditorNoteData, isStudyModeActive } from '$lib/stores/store.svelte';
	import { Editor, mergeAttributes } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import MathExtension from '@aarkue/tiptap-math-extension';
	import 'katex/dist/katex.min.css';
	import Icon from '@iconify/svelte';
	import './tiptap-editor.css';
	import Heading from '@tiptap/extension-heading';
	import Underline from '@tiptap/extension-underline';
	import Youtube from '@tiptap/extension-youtube';
	import Subscript from '@tiptap/extension-subscript';
	import Superscript from '@tiptap/extension-superscript';
	import Highlight from '@tiptap/extension-highlight';
	import { TableKit } from '@tiptap/extension-table';
	import { BubbleMenu, isClient } from '@tiptap/svelte';

	let element: any;
	let { content, editable } = $props();

	// Centralized state management for button activity
	let isTableActive = $state(false);
	let isParagraphActive = $state(false);
	let isUnderlineActive = $state(false);
	let isHighlightActive = $state(false);
	let isBoldActive = $state(false);
	let isItalicActive = $state(false);
	let isSubscriptActive = $state(false);
	let isSuperscriptActive = $state(false);

	onMount(() => {
		editor.value = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Heading.configure({
					levels: [1, 2, 3],
					HTMLAttributes: {
						class: 'text-xl' // Default class if needed, or overridden below
					}
				}),
				Heading.extend({
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
				}),
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
				BubbleMenu.configure({
					// You can configure plugin options here
				})
			],
			content: 'Loading...',
			onTransaction: ({ editor }) => {
				// This is a more efficient way to keep the editor instance reactive
				editor.value = editor.value;

				// Update all button states from a single source of truth
				isTableActive = editor.isActive('table');
				isParagraphActive = editor.isActive('paragraph');
				isUnderlineActive = editor.isActive('underline');
				isHighlightActive = editor.isActive('highlight');
				isBoldActive = editor.isActive('bold');
				isItalicActive = editor.isActive('italic');
				isSubscriptActive = editor.isActive('subscript');
				isSuperscriptActive = editor.isActive('superscript');
			},
			onUpdate() {
				EditorNoteData.value.content = editor.value.getHTML();
			},
			editorProps: {
				attributes: {
					class: 'p-2 focus:outline-none overflow-y-scroll',
					style: 'height: 100%'
				}
			},
			editable: editable
		});

		if (!editable) {
			const editorElement = document.getElementById('editor') as HTMLDivElement;
			editorElement.style.border = 'none';
		}
	});

	$effect(() => {
		if (editor.value && content !== undefined && content !== null) {
			if (editor.value.getHTML() !== content) {
				editor.value.commands.setContent(content);
			}
		}
	});

	onDestroy(() => {
		if (editor.value) {
			editor.value.destroy();
		}
	});

	function toggleStudyMode() {
		isStudyModeActive.update((n) => !n);
	}
</script>

<div class="editor-container flex h-full flex-col p-0">
	{#if editable}
		<!-- Main Static Toolbar -->
		<div class="tipex-controller control-group dark flex flex-row rounded-tl rounded-tr p-2 shadow-xl">
			<div class="button-group">
				<div class="tipex-basic-controller-wrapper flex flex-row flex-wrap rounded-md">
					<button
						aria-label="Study Mode"
						title="Study Mode"
						class="editor-button btn"
						onclick={toggleStudyMode}
						class:active={$isStudyModeActive}
					>
						<Icon icon="ion:book-outline" width="24" height="24" />
					</button>
					{#each { length: 3 } as _, index}
						{@const level = index + 1}
						<button
							class="editor-button"
							title={`Heading ${level}`}
							aria-label={`Heading ${level}`}
							class:active={editor.value?.isActive('heading', { level })}
							onclick={() => editor.value?.chain().focus().toggleHeading({ level }).run()}
						>
							H{level}
						</button>
					{/each}
					<button
						aria-label="Paragraph"
						title="Paragraph"
						onclick={() => editor.value?.chain().focus().setParagraph().run()}
						class:active={isParagraphActive}
						class="editor-button btn"><Icon icon="fa6-solid:paragraph" /></button
					>
					<button
						aria-label="Underline"
						title="Underline"
						class="editor-button btn"
						onclick={() => editor.value?.chain().focus().toggleUnderline().run()}
						class:active={isUnderlineActive}><Icon icon="fa6-solid:underline" /></button
					>
					<button
						aria-label="Highlight"
						title="Highlight"
						class="editor-button btn"
						onclick={() => editor.value?.chain().focus().toggleHighlight().run()}
						class:active={isHighlightActive}><Icon icon="fa6-solid:highlighter" /></button
					>
					<button
						aria-label="Bold"
						title="Bold"
						onclick={() => editor.value?.chain().focus().toggleBold().run()}
						class="editor-button"
						class:active={isBoldActive}
					>
						<Icon icon="fa6-solid:bold" />
					</button>
					<button
						aria-label="Italic"
						title="Italic"
						onclick={() => editor.value?.chain().focus().toggleItalic().run()}
						class="editor-button"
						class:active={isItalicActive}
					>
						<Icon icon="fa6-solid:italic" />
					</button>
					<button
						aria-label="Subscript"
						title="Subscript"
						onclick={() => editor.value?.chain().focus().toggleSubscript().run()}
						class="editor-button"
						class:active={isSubscriptActive}
					>
						<Icon icon="fa6-solid:subscript" />
					</button>
					<button
						aria-label="Superscript"
						title="Superscript"
						onclick={() => editor.value?.chain().focus().toggleSuperscript().run()}
						class="editor-button"
						class:active={isSuperscriptActive}
					>
						<Icon icon="fa6-solid:superscript" />
					</button>
					<button
						aria-label="Table"
						title="Table"
						onclick={() =>
							editor.value
								.chain()
								.focus()
								.insertTable({ rows: 3, cols: 2, withHeaderRow: false })
								.run()}
						class="editor-button"
						class:active={isTableActive}
					>
						<Icon icon="fa6-solid:table" />
					</button>
					{#if isTableActive}
						<button
							aria-label="Add Row After"
							title="Add Row After"
							onclick={() => editor.value?.chain().focus().addRowAfter().run()}
							class="editor-button"
						>
							<Icon icon="majesticons:add-row" width="24" height="24" />
						</button>
						<button
							aria-label="Add Column After"
							title="Add Column After"
							onclick={() => editor.value?.chain().focus().addColumnAfter().run()}
							class="editor-button"
						>
							<Icon icon="majesticons:add-column" width="24" height="24" />
						</button>
						<button
							aria-label="Delete Row"
							title="Delete Row"
							onclick={() => editor.value?.chain().focus().deleteRow().run()}
							class="editor-button"
						>
							<Icon icon="fluent:table-delete-row-20-regular" width="20" height="20" />
						</button>
						<button
							aria-label="Delete Column"
							title="Delete Column"
							onclick={() => editor.value?.chain().focus().deleteColumn().run()}
							class="editor-button"
						>
							<Icon icon="fluent:table-delete-column-20-regular" width="20" height="20" />
						</button>
						<button
							aria-label="Delete Table"
							title="Delete Table"
							onclick={() => editor.value?.chain().focus().deleteTable().run()}
							class="editor-button"
						>
							<Icon icon="fluent-mdl2:delete-table" width="20" height="20" />
						</button>
					{/if}
					<button
						aria-label="Youtube"
						title="YouTube"
						onclick={() => {
							const url = prompt('Enter Youtube URL');
							if (url) {
								editor.value
									?.chain()
									.focus()
									.setYoutubeVideo({
										src: url,
										width: 640,
										height: 480
									})
									.run();
							}
						}}
						class="editor-button"
					>
						<Icon icon="mdi:youtube" width="24" height="24" />
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Bubble Menu (Floating Toolbar) -->
	{#if isClient && editor.value}
		<BubbleMenu
			class="bubble-menu"
			editor={editor.value}
			tippyOptions={{ duration: 150, animation: 'scale-subtle' }}
		>
			<button
				aria-label="Bold"
				title="Bold"
				class="editor-button"
				onclick={() => editor.value?.chain().focus().toggleBold().run()}
				class:active={isBoldActive}
			>
				<Icon icon="fa6-solid:bold" />
			</button>
			<button
				aria-label="Italic"
				title="Italic"
				class="editor-button"
				onclick={() => editor.value?.chain().focus().toggleItalic().run()}
				class:active={isItalicActive}
			>
				<Icon icon="fa6-solid:italic" />
			</button>
			<button
				aria-label="Underline"
				title="Underline"
				class="editor-button"
				onclick={() => editor.value?.chain().focus().toggleUnderline().run()}
				class:active={isUnderlineActive}
			>
				<Icon icon="fa6-solid:underline" />
			</button>
		</BubbleMenu>
	{/if}

	<div bind:this={element} class="editor bg-base-300 rounded-br-md rounded-bl-md" id="editor" />
</div>

<style>
	.editor-container {
		overflow: hidden;
	}
	.editor {
		height: calc(100vh - 180px);
		min-height: calc(var(--spacing) * 96);
		border-width: 1px;
		border-color: var(--color-gray-500);
		border-top: none;
	}
	.tipex-controller {
		background-color: #f3f4f6;
		z-index: 10;
		align-items: center;
		justify-content: space-between;
		border-width: 1px;
		border-color: var(--color-gray-500);
	}
	.tipex-controller.dark,
	:global(.dark) .tipex-controller {
		background-color: #171717;
	}
	.tipex-basic-controller-wrapper {
		display: flex;
		gap: 0.5rem;
	}
	.editor-button {
		background-color: #f3f4f6;
		color: #374151;
		display: flex;
		height: 2.5rem;
		width: 2.5rem;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		border: 0;
		padding: 0;
		font-size: 0.75rem;
		transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
		transition-duration: 100ms;
	}
	.editor-button.dark,
	:global(.dark) .editor-button {
		background-color: rgba(31, 41, 55, 0.8);
		color: #e5e7eb;
	}
	.editor-button.active {
		background-color: #e5e7eb;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
	}
	.editor-button.active.dark,
	:global(.dark) .editor-button.active {
		background-color: #374151;
	}

	/* Bubble Menu Styles */
	.bubble-menu {
		display: flex;
		padding: 0.25rem;
		border-radius: 0.5rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
		gap: 0.25rem;
		background-color: #f3f4f6;
		border: 1px solid #e5e7eb;
	}
	:global(.dark) .bubble-menu {
		background-color: #171717;
		border: 1px solid #374151;
	}
	/* Tooltip styling */
	.editor-button {
		position: relative;
	}
	.editor-button:hover::after {
		content: attr(title);
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 4px 8px;
		border-radius: 4px;
		z-index: 10;
		margin-top: 8px;
		white-space: nowrap;
	}

	/* Tiptap Table Styles */
	.tiptap table {
		border-collapse: collapse;
		margin: 0;
		overflow: hidden;
		table-layout: fixed;
		width: 100%;
	}
	.tiptap table td,
	.tiptap table th {
		border: 1px solid #e5e7eb;
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
		background-color: #f3f4f6;
		font-weight: bold;
		text-align: left;
	}
	.tiptap table .selectedCell:after {
		background: rgba(200, 200, 200, 0.4);
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
		background-color: #8b5cf6;
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
	:global(.dark) .tiptap table td,
	:global(.dark) .tiptap table th {
		border-color: #374151;
	}
	:global(.dark) .tiptap table th {
		background-color: #1f2337;
	}
	:global(.dark) .tiptap table .selectedCell:after {
		background: rgba(55, 65, 81, 0.4);
	}
</style>

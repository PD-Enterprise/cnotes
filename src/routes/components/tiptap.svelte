<script>
	import { onMount, onDestroy } from 'svelte';
	import { editor } from '$lib/stores/store.svelte';
	import { Editor, mergeAttributes } from '@tiptap/core';
	// import { Placeholder } from '@tiptap/extensions';
	import StarterKit from '@tiptap/starter-kit';
	import Mathematics from '@tiptap/extension-mathematics';
	import 'katex/dist/katex.min.css';
	import Icon from '@iconify/svelte';
	import './tiptap-editor.css';
	import Heading from '@tiptap/extension-heading';
	import Underline from '@tiptap/extension-underline';
	// import Youtube from '@tiptap/extension-youtube';
	import Subscript from '@tiptap/extension-subscript';
	import Superscript from '@tiptap/extension-superscript';
	import Highlight from '@tiptap/extension-highlight';
	import TextAlign from '@tiptap/extension-text-align';
	// import Table from '@tiptap/extension-table';
	// import TableRow from '@tiptap/extension-table-row';
	// import TableHeader from '@tiptap/extension-table-header';
	// import TableCell from '@tiptap/extension-table-cell';

	let element;
	let content = $props();

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
								classes = 'text-4xl font-bold'; // Added font-bold for better visual distinction
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
						return [
							`h${level}`,
							mergeAttributes(HTMLAttributes, { class: classes }), // Merge existing attributes with your new class
							0
						];
					}
				}),
				Underline,
				Highlight.configure({
					multicolor: true
				}),
				Subscript,
				Superscript,
				TextAlign.configure({
					alignments: ['left', 'center', 'right'],
					defaultAlignment: 'left'
				}),
				Mathematics.configure({
					inlineOptions: {
						onClick: (node) => {
							const newCalculation = prompt('Enter new calculation:', node.attrs.latex);
							if (newCalculation) {
								editor.value
									.chain()
									// @ts-expect-error
									.setNodeSelection(node.pos)
									.updateInlineMath({ latex: newCalculation })
									.focus()
									.run();
							}
						}
					}
				})
				// Youtube,
				// Table.configure({
				// 	resizable: true
				// }),
				// TableRow,
				// TableHeader,
				// TableCell,
			],
			content: content.content || '',
			onTransaction: () => {
				editor.value = editor.value;
			},
			editorProps: {
				attributes: {
					class: 'p-2 focus:outline-none',
					style: 'height: 100%'
				}
			}
		});
	});

	onDestroy(() => {
		if (editor.value) {
			editor.value.destroy();
		}
	});
</script>

<div class="editor-container flex h-full flex-col gap-3 overflow-hidden p-1">
	<div bind:this={element} class="editor min-h-96 border-2 border-gray-500 bg-base-300"></div>
	<div class="tipex-controller dark">
		<div class="tipex-controller-wrapper">
			<div class="tipex-basic-controller-wrapper rounded-md">
				{#each { length: 3 } as _, index}
					{@const level = index + 1}
					<button
						class="tipex-edit-button"
						onclick={() => {
							editor.value.chain().focus().toggleHeading({ level }).run();
						}}
						class:active={editor.value?.isActive('heading', { level })}
					>
						H{level}
					</button>
				{/each}
				<button
					aria-label="Paragraph"
					onclick={() => {
						editor.value.chain().focus().setParagraph().run();
					}}
					class:active={editor.value?.isActive('paragraph')}
					class="tipex-edit-button btn"><Icon icon="fa6-solid:paragraph" /></button
				>
				<button
					aria-label="Underline"
					class="tipex-edit-button btn"
					onclick={() => {
						editor.value.chain().focus().toggleUnderline().run();
					}}
					class:active={editor.value?.isActive('underline')}
					><Icon icon="fa6-solid:underline" /></button
				>
				<button
					aria-label="Highlight"
					class="tipex-edit-button btn"
					onclick={() => {
						editor.value.chain().focus().toggleHighlight().run();
					}}
					class:active={editor.value?.isActive('highlight')}
					><Icon icon="fa6-solid:highlighter" /></button
				>
				<button
					aria-label="Bold"
					onclick={() => {
						editor.value?.chain().focus().toggleBold().run();
					}}
					class="tipex-edit-button"
					class:active={editor.value?.isActive('bold')}
				>
					<Icon icon="fa6-solid:bold" />
				</button>
				<button
					aria-label="Italic"
					onclick={() => {
						editor.value?.chain().focus().toggleItalic().run();
					}}
					class="tipex-edit-button"
					class:active={editor.value?.isActive('italic')}
				>
					<Icon icon="fa6-solid:italic" />
				</button>
				<button
					aria-label="Subscript"
					onclick={() => {
						editor.value?.chain().focus().toggleSubscript().run();
					}}
					class="tipex-edit-button"
					class:active={editor.value?.isActive('subscript')}
				>
					<Icon icon="fa6-solid:subscript" />
				</button>
				<button
					aria-label="Subscript"
					onclick={() => {
						editor.value?.chain().focus().toggleSuperscript().run();
					}}
					class="tipex-edit-button"
					class:active={editor.value?.isActive('superscript')}
				>
					<Icon icon="fa6-solid:superscript" />
				</button>
				<button
					aria-label="Insert Math Formula"
					onclick={() => {
						const hasSelection = !editor.value.state.selection.empty;

						if (hasSelection) {
							return editor.value.chain().setInlineMath().focus().run();
						}

						const latex = prompt('Enter inline math expression:', '');
						return editor.value.chain().insertInlineMath({ latex }).focus().run();
					}}
					class="tipex-edit-button btn"
					><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 5h-7L8 19l-3-6H3m11 0l6 6m-6 0l6-6"
						/></svg
					></button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.editor {
		height: 100%;
	}
	.tiptap p.is-editor-empty:first-child::before {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
	.tiptap p.is-empty::before {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
	.tipex-controller {
		background-color: #f3f4f6;
		position: sticky;
		bottom: 0;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}
	/* @media (min-width: 768px) {
		.tipex-controller {
			flex-direction: row;
		}
	} */
	.tipex-controller.dark,
	:global(.dark) .tipex-controller {
		background-color: #171717;
	}

	.tipex-controller-wrapper {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.tipex-basic-controller-wrapper {
		display: flex;
		gap: 0.5rem;
	}
	.tipex-edit-button {
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
	.tipex-edit-button.dark,
	:global(.dark) .tipex-edit-button {
		background-color: rgba(31, 41, 55, 0.8);
		color: #e5e7eb;
	}

	.tipex-edit-button.active {
		background-color: #f3f4f6;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
	}
	.tipex-edit-button.active.dark,
	:global(.dark) .tipex-edit-button.active {
		background-color: #374151;
	}

	/* .tiptap table {
		border-collapse: collapse;
		margin: 0;
		overflow: hidden;
		table-layout: fixed;
		width: 100%;
} */

	/* .tiptap table td,
	.tiptap table th {
		border: 1px solid #e5e7eb;
		box-sizing: border-box;
		min-width: 1em;
		padding: 6px 8px;
		position: relative;
		vertical-align: top;
	} */

	/* .tiptap table td > *,
	.tiptap table th > * {
		margin-bottom: 0;
	} */
	/* 
	.tiptap table th {
		background-color: #f3f4f6;
		font-weight: bold;
		text-align: left;
	} */

	/* .tiptap table .selectedCell:after {
		background: rgba(200, 200, 200, 0.4);
		content: '';
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		pointer-events: none;
		position: absolute;
		z-index: 2;
	} */

	/* .tiptap table .column-resize-handle {
		background-color: #8b5cf6;
		bottom: -2px;
		pointer-events: none;
		position: absolute;
		right: -2px;
		top: 0;
		width: 4px;
	} */
	/* 
	.tiptap .tableWrapper {
		margin: 1.5rem 0;
		overflow-x: auto;
	}
/* 
	.tiptap.resize-cursor {
		cursor: ew-resize;
		cursor: col-resize;
	} */
	/* 
	:global(.dark) .tiptap table td,
	:global(.dark) .tiptap table th {
		border-color: #374151;
	} */
	/* 
	:global(.dark) .tiptap table th {
		background-color: #1f2937;
	} */
	/* 
	:global(.dark) .tiptap table .selectedCell:after {
		background: rgba(55, 65, 81, 0.4);
	} */

	/* .table-controls {
		display: flex;
		align-items: center;
		padding: 2px;
		border-radius: 4px;
	} */

	/* .tipex-edit-button {
		position: relative;
	} */

	/* .tipex-edit-button:hover::after {
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
	} */
</style>

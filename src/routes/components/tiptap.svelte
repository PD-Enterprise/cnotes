<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { EditorNoteData, editorState } from '$lib/stores/store.svelte';
	import { Editor, isActive, mergeAttributes } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import MathExtension from '@aarkue/tiptap-math-extension';
	import './tiptap-editor.css';
	import 'katex/dist/katex.min.css';
	import Icon from '@iconify/svelte';
	import Heading from '@tiptap/extension-heading';
	import Underline from '@tiptap/extension-underline';
	import Youtube from '@tiptap/extension-youtube';
	import Subscript from '@tiptap/extension-subscript';
	import Superscript from '@tiptap/extension-superscript';
	import Highlight from '@tiptap/extension-highlight';
	import { TableKit } from '@tiptap/extension-table';
	import FileHandler from '@tiptap/extension-file-handler';
	import Image from '@tiptap/extension-image';
	import TextAlign from '@tiptap/extension-text-align';

	let element: any = $state();
	let { content, editable } = $props();
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

	onMount(() => {
		editorState.editor = new Editor({
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
				MathExtension.configure({
					evaluation: true
				}),
				TableKit.configure({
					table: { resizable: true }
				}),
				Youtube,
				Image,
				FileHandler.configure({
					allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
					onDrop: (currentEditor, files, pos) => {
						files.forEach((file) => {
							const fileReader = new FileReader();

							fileReader.readAsDataURL(file);
							fileReader.onload = () => {
								currentEditor
									.chain()
									.insertContentAt(pos, {
										type: 'image',
										attrs: {
											src: fileReader.result
										}
									})
									.focus()
									.run();
							};
						});
					},
					onPaste: (currentEditor, files, htmlContent) => {
						files.forEach((file) => {
							if (htmlContent) {
								// if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
								// you could extract the pasted file from this url string and upload it to a server for example
								console.log(htmlContent); // eslint-disable-line no-console
								return false;
							}

							const fileReader = new FileReader();

							fileReader.readAsDataURL(file);
							fileReader.onload = () => {
								currentEditor
									.chain()
									.insertContentAt(currentEditor.state.selection.anchor, {
										type: 'image',
										attrs: {
											src: fileReader.result
										}
									})
									.focus()
									.run();
							};
						});
					}
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph'],
					alignments: ['left', 'center', 'right', 'justify'],
					defaultAlignment: 'left'
				})
			],
			content: 'Loading...',
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
			},
			onUpdate() {
				EditorNoteData.value.content = editorState.editor.getHTML();
			},
			editorProps: {
				attributes: {
					class: 'p-2 focus:outline-none overflow-y-scroll',
					style: 'height: 100%'
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
		if (!editable) {
			const editorElement = document.getElementById('editor') as HTMLDivElement;
			editorElement.style = 'border: none';
		}
	});
	$effect(() => {
		if (editorState.editor && content !== undefined && content !== null) {
			if (editorState.editor.getHTML() !== content) {
				editorState.editor.commands.setContent(content);
			}
		}
	});
	onDestroy(() => {
		editorState.editor?.destroy();
	});
</script>

<div class="editor-container flex h-full flex-col p-0">
	{#if editable}
		<div
			class="tipex-controller control-group dark flex flex-row rounded-tl rounded-tr p-2 shadow-xl"
		>
			<div class="tipex-basic-controller-wrapper flex flex-row flex-wrap rounded-md">
				{#each { length: 3 } as _, index}
					{@const level = index + 1}
					<button
						class="editor-button is-active"
						title={`Heading ${level}`}
						aria-label={`Heading ${level}`}
						onclick={() => {
							// @ts-expect-error
							editorState.editor.chain().focus().toggleHeading({ level }).run();
						}}
					>
						H{level}
					</button>
				{/each}

				<button
					aria-label="Paragraph"
					title="Paragraph"
					onclick={() => {
						editorState.editor.chain().focus().setParagraph().run();
					}}
					class="editor-button btn"
					class:active={isParagraphActive}><Icon icon="fa6-solid:paragraph" /></button
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
					<Icon icon="fa6-solid:bold" />
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
					<Icon icon="fa6-solid:italic" />
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
					<Icon icon="fa6-solid:underline" />
				</button>
				<button
					aria-label="Highlight"
					title="Highlight"
					class="editor-button btn"
					onclick={() => {
						editorState.editor.chain().focus().toggleHighlight().run();
					}}
					class:active={isHighlightActive}><Icon icon="fa6-solid:highlighter" /></button
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
					<Icon icon="fa6-solid:subscript" />
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
					<Icon icon="fa6-solid:superscript" />
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
					<Icon icon="material-symbols:format-align-left-rounded" width="24" height="24" />
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
					<Icon icon="material-symbols:format-align-center-rounded" width="24" height="24" />
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
					<Icon icon="material-symbols:format-align-right-rounded" width="24" height="24" />
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
					<Icon icon="material-symbols:format-align-justify-rounded" width="24" height="24" />
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
					<Icon icon="fa6-solid:table" />
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
						<Icon icon="majesticons:add-row" width="24" height="24" />
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
						<Icon icon="majesticons:add-column" width="24" height="24" />
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
						<Icon icon="fluent:table-delete-row-20-regular" width="20" height="20" />
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
						<Icon icon="fluent:table-delete-column-20-regular" width="20" height="20" />
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
						<Icon icon="fluent-mdl2:delete-table" width="20" height="20" />
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
					<Icon icon="mdi:youtube" width="24" height="24" />
				</button>
			</div>
		</div>
	{/if}
	<div bind:this={element} class="editor bg-base-300 rounded-br-md rounded-bl-md" id="editor"></div>
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
	.editor-button.active {
		background-color: #f3f4f6;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
	}
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
	}
	.editor-button.active.dark,
	:global(.dark) .editor-button.active {
		background-color: #374151;
	}
	.editor-button.active.dark,
	:global(.dark) .editor-button.active {
		background-color: #374151;
	}
	.editor-button.dark,
	:global(.dark) .editor-button {
		background-color: rgba(31, 41, 55, 0.8);
		color: #e5e7eb;
	}
</style>

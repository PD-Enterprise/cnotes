<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import type { Editor as TinyMCEEditor } from 'tinymce';
	import { isChanged } from '$lib/stores/store';
	import { theme } from '$lib/stores/store';
	import { onMount } from 'svelte';

	// Variables
	export let editorRef: TinyMCEEditor | null = null;
	export let data: any;
	export let conf: any = {
		height: 500,
		menubar: true,
		shortcuts: true,
		skin: 'oxide-dark',
		content_css: 'dark',
		plugins: [
			'advlist',
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'visualblocks',
			'code',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'preview',
			'help',
			'wordcount'
		],
		toolbar:
			'undo redo | formatselect | ' +
			'bold italic forecolor underline | alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist | image media table | ' +
			'help',
		image_title: true,
		automatic_uploads: true,
		file_picker_types: 'image',
		image_caption: true,
		image_dimensions: true,
		a11y_advanced_options: true,
		setup: (editor) => {
			editor.on('init', () => {
				editor.notificationManager.close();
			});
		}
	};

	onMount(() => {
		theme.subscribe((value) => {
			if (value) {
				conf = { ...conf, skin: 'oxide', content_css: 'light' };
			} else {
				conf = { ...conf, skin: 'oxide-dark', content_css: 'dark' };
			}
		});
	});
</script>

<div class="editor-container">
	{#if Editor}
		<Editor
			bind:this={editorRef as any}
			bind:value={data[0].notescontent}
			apiKey="vy0yfom8b74patlx3pqq3fsgzs7yo91br84xiy2o6744slrf"
			channel="7"
			{conf}
			on:input={() => {
				isChanged.set(true);
			}}
		/>
	{:else}
		<div class="loading">Loading Editor...</div>
	{/if}
</div>

<style>
	.editor-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		background: var(--background-color, #ffffff);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.loading {
		padding: 2rem;
		text-align: center;
		color: var(--text-color, #333);
		font-size: 1.1rem;
	}

	:global(.tox-tinymce) {
		border-radius: 8px !important;
		border: 1px solid var(--border-color, #ddd) !important;
	}

	:global(.tox .tox-toolbar) {
		background: var(--toolbar-bg, #f5f5f5) !important;
		border-bottom: 1px solid var(--border-color, #ddd) !important;
	}

	:global(.tox .tox-tbtn) {
		border-radius: 4px !important;
		margin: 2px !important;
	}

	:global(.tox .tox-tbtn:hover) {
		background: var(--hover-bg, #e0e0e0) !important;
	}

	:global(.tox .tox-toolbar__group) {
		border-right: 1px solid var(--border-color, #ddd) !important;
		padding: 0 4px !important;
	}

	:global(.tox .tox-statusbar) {
		border-top: 1px solid var(--border-color, #ddd) !important;
	}

	@media (max-width: 768px) {
		.editor-container {
			padding: 0.5rem;
		}

		:global(.tox .tox-toolbar__group) {
			padding: 0 2px !important;
		}
	}
</style>

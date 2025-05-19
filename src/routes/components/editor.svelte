<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import type { Editor as TinyMCEEditor } from 'tinymce';
	import { isChanged, theme } from '$lib/stores/store.svelte';
	import { onMount } from 'svelte';

	// Variables
	let editorRef: TinyMCEEditor | null = $state(null);
	let {
		data = { value: { notescontent: '' } },
		conf = {
			height: 750,
			menubar: false,
			shortcuts: false,
			skin: 'oxide-dark',
			content_css: 'dark',
			send_usage_statistics: false,
			promotion: false,
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
				'undo redo | blocks | ' +
				'bold italic forecolor underline | alignleft aligncenter alignright alignjustify | bullist numlist | ' +
				'table tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
				'bullist numlist outdent indent | ' +
				' help',
			a11y_advanced_options: true,
			file_picker_types: 'image'
		}
	} = $props();

	// Debug logs
	console.log('Initial data:', data);
	console.log('Initial data.value:', data.value);
	console.log('Initial notescontent:', data.value?.notescontent);

	let editorContent = $state(data.value?.notescontent || '');
	console.log('Initial editorContent:', editorContent);

	$effect(() => {
		if (theme.value) {
			conf = { ...conf, skin: 'oxide', content_css: 'light' };
		} else {
			conf = { ...conf, skin: 'oxide-dark', content_css: 'dark' };
		}
	});

	$effect(() => {
		console.log('Effect triggered - new data value:', data.value);
		if (data.value?.notescontent !== undefined) {
			editorContent = data.value.notescontent;
			console.log('Updated editorContent:', editorContent);
		}
	});
</script>

{#if Editor}
	<Editor
		bind:this={editorRef as any}
		bind:value={editorContent}
		apiKey="vy0yfom8b74patlx3pqq3fsgzs7yo91br84xiy2o6744slrf"
		channel="7"
		{conf}
		on:input={() => {
			console.log('Input event - current content:', editorContent);
			isChanged.value = true;
			if (data.value) {
				data.value.notescontent = editorContent;
				console.log('Updated data.value.notescontent:', data.value.notescontent);
			}
		}}
	/>
{:else}
	<div class="loading">Loading Editor...</div>
{/if}

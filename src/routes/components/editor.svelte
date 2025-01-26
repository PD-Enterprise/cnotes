<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import type { Editor as TinyMCEEditor } from 'tinymce';
	import { isChanged } from '$lib/stores/ischanged';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	// Variables
	export let editorRef: TinyMCEEditor | null = null;
	export let data: any;
	export let conf: any = {
		height: 800,
		menubar: false,
		shortcuts: false,
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
			'undo redo | blocks | ' +
			'bold italic forecolor underline | alignleft aligncenter alignright alignjustify | bullist numlist | ' +
			'table tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
			'bullist numlist outdent indent | ' +
			' help',
		a11y_advanced_options: true,
		file_picker_types: 'image'
	};

	// onMount(() => {
	// 	theme.subscribe((value) => {
	// 		if (value) {
	// 			conf = { ...conf, skin: 'oxide', content_css: 'light' };
	// 		} else {
	// 			conf = { ...conf, skin: 'oxide-dark', content_css: 'dark' };
	// 		}
	// 	});
	// });
</script>

{#if Editor}
	<Editor
		bind:this={editorRef}
		bind:value={data[0].note_content}
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

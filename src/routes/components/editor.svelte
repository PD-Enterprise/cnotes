<script lang="ts">
	import Editor from '@tinymce/tinymce-svelte';
	import type { Editor as TinyMCEEditor } from 'tinymce';
	import { isChanged } from '$lib/stores/ischanged';

	// Variables
	export let editorRef: TinyMCEEditor | null = null;
	export let data: any;
	export let conf: any;
</script>

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

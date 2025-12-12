<script lang="ts">
	import BookLoader from './bookLoader.svelte';
	let props = $props();
</script>

<div class="bg-base-200 fixed inset-0 z-50 flex flex-col items-center justify-center gap-10">
	<BookLoader />
	<p>{props.title}</p>
</div>

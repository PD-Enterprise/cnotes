<script lang="ts">
	import { fade } from 'svelte/transition';
	let props = $props();
</script>

<div
	class="bg-base-200 fixed inset-0 z-50 flex flex-col items-center justify-center gap-10"
	in:fade={{ duration: 150 }}
	out:fade={{ duration: 300 }}
>
	<div class="loading loading-spinner h-12 w-12 text-gray-400"></div>
	<p>{props.title}</p>
</div>

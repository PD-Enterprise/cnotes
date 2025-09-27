<script lang="ts">
	let props = $props();
</script>

<div class="bg-base-200 fixed inset-0 z-50 flex flex-col items-center justify-center gap-10">
	<div class="loading loading-spinner h-12 w-12 text-gray-400"></div>
	<p>{props.title}</p>
</div>

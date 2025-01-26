<script lang="ts">
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
	import Excalidraw from '../../components/Excalidraw.svelte';

	let excalidrawAPI: ExcalidrawImperativeAPI = $state()!;
	$effect(() => {
		// excalidrawAPI?.onChange(console.log);
	});
</script>

<div class="main">
	<Excalidraw theme="dark" excalidrawAPI={(api) => (excalidrawAPI = api)} />
</div>

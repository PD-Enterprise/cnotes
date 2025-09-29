<script lang="ts">
	import type { note } from '../types';

	// Variables
	// @ts-expect-error
	let newNote: note[] = [{}];

	import Excalidraw from './Excalidraw.svelte';
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

	let excalidrawAPI: ExcalidrawImperativeAPI | undefined = $state();

	$effect(() => {
		excalidrawAPI?.onChange(console.log);
	});
</script>

<div class="main p-1">
	<form>
		<div class="header-box">
			<h2 class="mb-6 text-3xl">Add a Diagram</h2>
			<div class="excalidraw-wrapper">
				<Excalidraw theme="dark" excalidrawAPI={(api) => (excalidrawAPI = api)} />
			</div>
			<!-- <button class="btn btn-accent btn-outline" onclick={addNewDiagram}>Add Note</button> -->
		</div>
	</form>
</div>

<style>
	.main {
		padding: 20px;
		animation: fadeInDown 0.8s ease-in-out;
		height: calc(100vh - 130px);
		display: flex;
		flex-direction: column;
	}
	.header-box {
		text-align: center;
		animation: fadeInDown 0.6s ease-in-out;
	}

	.header-box h2 {
		font-size: 2.5rem;
		font-weight: bold;
		animation: fadeInDown 0.8s ease-in-out;
	}

	/* Form container */
	.new-note-data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
		/* Space between fields */
		animation: fadeInDown 1s ease-in-out;
	}
</style>

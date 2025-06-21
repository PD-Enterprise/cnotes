<script lang="ts">
	import { onMount } from 'svelte';
	import AddTextNote from '../../components/addTextNote.svelte';
	import Diagram from '../../components/diagram.svelte';

	// Variables
	let option = $state('text');
</script>

<div class="main">
	<div class="dropdown ml-2 p-2">
		<select bind:value={option} class="menu z-[1] m-1 w-52 bg-base-100 p-2 shadow">
			<option value="text">Text</option>
			<option value="diagram">Diagram</option>
		</select>
	</div>
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-xs btn-circle text-info">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="h-4 w-4 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
		</div>
		<div class="compact dropdown-content card z-[1] w-64 rounded-box bg-base-100 shadow">
			<div class="card-body">
				<h2 class="card-title">component state is not held!!</h2>
				<p>Save your work before switching</p>
			</div>
		</div>
	</div>
	{#if option === 'text'}
		<div class="text">
			<AddTextNote />
		</div>
	{:else if option === 'diagram'}
		<div class="diagram mt-1 p-2">
			This feature coming soon!!
			<!-- <Diagram /> -->
		</div>
	{/if}
</div>

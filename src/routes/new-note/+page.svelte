<script lang="ts">
	import Icon from '@iconify/svelte';

	// import { onMount } from 'svelte';
	import AddTextNote from '../components/addTextNote.svelte';
	import Diagram from '../components/diagram.svelte';

	// Variables
	let option = $state('text');
</script>

<div class="main">
	<div class="dropdown p-2">
		<select
			bind:value={option}
			class="menu bg-base-200 border-base-content z-[1] m-1 w-52 rounded border p-2 shadow-xl"
		>
			<option value="text">Text</option>
			<option value="diagram">Diagram</option>
		</select>
	</div>
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-xs btn-circle text-info">
			<Icon icon="material-symbols:info" width="24" height="24" />
		</div>
		<div class="compact dropdown-content card rounded-box bg-base-100 z-[1] w-64 shadow">
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
			<Diagram />
		</div>
	{/if}
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
</style>

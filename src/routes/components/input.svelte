<script lang="ts">
	import { isChanged } from '$lib/stores/ischanged';

	export let originalData: any;
	export let data: any;
	export let title: string;
	export let tag: string;
	export let type: string = 'text';
	export let isDisabled: string = 'false';

	function checkForChanges() {
		// Compare current data with original data
		const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
		isChanged.set(hasChanges);
	}
</script>

{#if isDisabled == 'true'}
	<div class="w-full max-w-xs">
		<div class="label">
			<span class="label-text w-full max-w-xs">
				<b>{title}</b>: {data[0][tag]}
			</span>
		</div>
	</div>
{:else}
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">{title}:</span>
		</div>
		<input
			{type}
			class="input input-bordered w-full"
			bind:value={data[0][tag]}
			on:input={checkForChanges}
		/>
	</label>
{/if}

<style>
	input,
	label {
		max-width: 10rem;
	}
</style>

<script lang="ts">
	import { isChanged } from '$lib/stores/ischanged';

	export let originalData: any;

	function checkForChanges() {
		// Compare current data with original data
		const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
		isChanged.set(hasChanges);
	}

	export let data: any;
	export let title: string;
	export let tag: string;
	export let type: string = 'text';
	export let isDisabled: string = 'false';
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
	<label class="form-control w-full max-w-xs">
		<div class="label">
			<span class="label-text">{title}:</span>
		</div>
		<input
			{type}
			class="input input-bordered w-full max-w-xs"
			bind:value={data[0][tag]}
			on:input={checkForChanges}
		/>
	</label>
{/if}

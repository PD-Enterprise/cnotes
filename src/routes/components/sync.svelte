<script lang="ts">
	// Imports
	import { isAuthenticated, sync } from '$lib/stores/store.svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { onMount } from 'svelte';

	// Functions
	onMount(() => {
		// Getting the auto-login element
		const autoLoginElement = document.getElementById('auto-login') as HTMLInputElement;

		// Getting the autoLogin value from localStorage
		$effect(() => {
			if ($sync == true) {
				localStorage.setItem('syncState', 'true');
				autoLoginElement.classList.remove('hidden');
			} else {
				localStorage.setItem('syncState', 'false');
			}
		});
	});
</script>

<li id="auto-login" class="">
	<label class="flex cursor-pointer gap-2">
		Sync
		<input
			type="checkbox"
			class="toggle"
			checked={$sync}
			onclick={() => {
				if (isAuthenticated.value) {
					sync.set(!$sync);
				} else {
					showToast(
						'Not Logged In.',
						'You need to be logged in to use this feature.',
						3000,
						'error'
					);
				}
			}}
		/>
	</label>
</li>

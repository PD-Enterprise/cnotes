<script lang="ts">
	// Imports
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { autoLogin, isAuthenticated } from '$lib/stores/store.svelte';
	import { onMount } from 'svelte';

	// Variables
	let whichNav = $props();

	// Functions
	onMount(() => {
		// Getting the auto-login element
		const autoLoginElement = document.getElementById('auto-login') as HTMLInputElement;

		$effect(() => {
			if (autoLogin.value == true) {
				localStorage.setItem('AutoLogin', 'true');

				autoLoginElement.classList.remove('hidden');
				if (whichNav.type == 'nav' && $page.url.pathname == '/') {
					goto('/home');
				}
			} else {
				localStorage.setItem('AutoLogin', 'false');
			}
		});
	});
</script>

<li id="auto-login" class="">
	<label class="flex cursor-pointer gap-2">
		Auto Login
		<input
			type="checkbox"
			class="toggle"
			checked={autoLogin.value}
			onclick={() => {
				autoLogin.value = !autoLogin.value;
			}}
		/>
	</label>
</li>

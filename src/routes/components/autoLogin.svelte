<script lang="ts">
	// Imports
	import { goto } from '$app/navigation';
	import { autoLogin } from '$lib/stores/store';
	import { isAuthenticated } from '$lib/stores/store';
	import { onMount } from 'svelte';

	// Variables
	let whichNav = $props();
	let autoLoginLocal = '';

	// Functions
	onMount(() => {
		// Getting the auto-login element
		const autoLoginElement = document.getElementById('auto-login') as HTMLInputElement;

		// Subscribing to the loggedIn store
		isAuthenticated.subscribe((value) => {
			// If the user is logged in
			if (value) {
				// Remove the 'hidden' class from the auto-login element
				autoLoginElement.classList.remove('hidden');
				// Subscribing to the autoLogin store
				autoLogin.subscribe((value) => {
					// Saving the autoLogin value to localStorage
					localStorage.setItem('AutoLogin', value.toString());
					// If the navigation type is 'nav'
					if (whichNav.type == 'nav') {
						// If autoLogin is true, navigate to the home page
						if (value) {
							goto('/home');
						}
					}
				});
			}
		});
		// Getting the autoLogin value from localStorage
		autoLoginLocal = localStorage.getItem('AutoLogin');
		// Setting the autoLogin store based on the value from localStorage
		if (autoLoginLocal == 'true') {
			autoLogin.set(true);
		} else {
			autoLogin.set(false);
		}
	});
</script>

<li id="auto-login" class="">
	<label class="flex cursor-pointer gap-2">
		Auto Login
		<input
			type="checkbox"
			class="toggle"
			checked={$autoLogin}
			onclick={() => {
				autoLogin.set(!$autoLogin);
			}}
		/>
	</label>
</li>

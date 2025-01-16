<script lang="ts">
	import { goto } from '$app/navigation';
	import { autoLogin } from '$lib/stores/autoLogin';
	import { loggedIn } from '$lib/stores/loggedIn';
	import { onMount } from 'svelte';

	// Variables
	let whichNav = $props();
	let autoLoginLocal = '';

	// Functions
	onMount(() => {
		const autoLoginElement = document.getElementById('auto-login') as HTMLInputElement;

		loggedIn.subscribe((value) => {
			if (value) {
				autoLoginElement.classList.remove('hidden');
				autoLogin.subscribe((value) => {
					localStorage.setItem('AutoLogin', value.toString());
					if (whichNav.type == 'nav') {
						if (value) {
							goto('/home');
						}
					}
				});
			}
		});
		autoLoginLocal = localStorage.getItem('AutoLogin');
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

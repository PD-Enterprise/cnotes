<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import InAppNavbar from '../components/inAppNavbar.svelte';
	// import auth from '$lib/utils/authService';
	import { isAuthenticated, user, auth0Client, sync, autoLogin } from '$lib/stores/store.svelte';
	import SvelteToast from '../components/svelteToast.svelte';
	import config from '$lib/utils/apiConfig';
	import './app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	onMount(async () => {
		try {
			auth0Client.subscribe(async (value) => {
				if (!value) {
					localStorage.setItem('isAuthenticated', 'false');
					localStorage.setItem('user', 'null');
				} else {
					try {
						isAuthenticated.set(await $auth0Client.isAuthenticated());
						user.value = await $auth0Client.getUser();
						// @ts-expect-error
						fetchRole(user.value.email);
						// console.log('isauth', $isAuthenticated);
						// console.log('user', user.value);
						isAuthenticated.subscribe(async (value) => {
							localStorage.setItem('isAuthenticated', JSON.stringify(value));
							if (value) {
								autoLogin.value = true;
								sync.set(true);
							}
						});
						const encryptedUser = btoa(JSON.stringify(user.value));
						// console.log(encryptedUser);
						localStorage.setItem('user', encryptedUser);
					} catch (error) {
						if (localStorage.getItem('isAuthenticated') == 'true') {
							isAuthenticated.set(true);
						}
						if (localStorage.getItem('user')) {
							const encryptedUser = localStorage.getItem('user');
							// console.log(encryptedUser);
							const decryptedUser = atob(encryptedUser);
							// console.log(decryptedUser);
							user.value = JSON.parse(decryptedUser);
						}
					}
				}
			});
		} catch (error) {
			console.error(error);
		}
	});
	async function fetchRole(email: string) {
		try {
			const request = await fetch(`${config.apiUrl}users/roles/get-role`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email
				})
			});
			const result = await request.json();
			// console.log(result);
			localStorage.setItem('role', result.data);
		} catch (error) {
			localStorage.setItem('role', 'tier-1');
		}
	}
</script>

<SvelteToast />

<div class="main h-screen">
	<div class="navbar mb-5 mt-3">
		<InAppNavbar />
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
</style>

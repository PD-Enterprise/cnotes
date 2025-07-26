<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import InAppNavbar from '../components/inAppNavbar.svelte';
	import SvelteToast from '../components/svelteToast.svelte';
	import config from '$lib/utils/apiConfig';
	// import { ClerkProvider } from 'svelte-clerk';

	let { children } = $props();

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

<!-- <ClerkProvider> -->
<div class="main h-screen">
	<div class="navbar mb-5 mt-3">
		<InAppNavbar />
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

<!-- </ClerkProvider> -->

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
</style>

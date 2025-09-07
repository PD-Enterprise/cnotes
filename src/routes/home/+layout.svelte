<script lang="ts">
	// Imports
	import { onMount, type Snippet } from 'svelte';
	import Navbar from '../components/navbar.svelte';
	import SvelteToast from '../components/svelteToast.svelte';
	import config from '$lib/utils/apiConfig';
	import type { PageData } from '../$types';

	let { children, data }: { children: Snippet; data: PageData } = $props();

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
	<div class="navbar mt-3 mb-5">
		<Navbar />
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

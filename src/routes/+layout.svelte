<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Navbar from './components/navbar.svelte';
	import Footer from './components/footer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth0Client, isAuthenticated } from '$lib/stores/store.svelte';
	import auth from '$lib/utils/authService';

	let { children } = $props();

	const isAdminRoute = derived(page, ($page) => {
		return $page.url.pathname.startsWith('/home');
	});
	onMount(async () => {
		try {
			const client = await auth.createClient();
			// console.log('client', client);
			auth0Client.set(client);
			// console.log('client', $auth0Client);
			auth0Client.subscribe(async (value) => {
				if (!value) {
					localStorage.setItem('isAuthenticated', 'false');
				} else {
					try {
						isAuthenticated.set(await $auth0Client.isAuthenticated());
						// console.log('isauth', $isAuthenticated);
						isAuthenticated.subscribe(async (value) => {
							localStorage.setItem('isAuthenticated', JSON.stringify(value));
						});
					} catch (error) {
						if (localStorage.getItem('isAuthenticated') == 'true') {
							isAuthenticated.set(true);
						}
					}
				}
			});
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="main">
	<div class="navbar" style:display={$isAdminRoute ? 'none' : 'block'}>
		<Navbar />
	</div>
	<div class="content">
		{@render children()}
	</div>
	<div class="footer" style:display={$isAdminRoute ? 'none' : 'block'}>
		<Footer />
	</div>
</div>

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
	.main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.footer {
		margin-top: auto;
	}
</style>

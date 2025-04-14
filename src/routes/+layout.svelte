<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Navbar from './components/navbar.svelte';
	import Footer from './components/footer.svelte';
	import { theme } from '$lib/stores/store';
	import auth from '$lib/utils/authService';
	import { isAuthenticated, user, auth0Client } from '$lib/stores/store';
	import apiConfig from '$lib/utils/apiConfig';
	import { loadSavedTheme, applyThemeToDocument, themeStore } from '$lib/stores/themeStore';

	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();

	const isAdminRoute = derived(page, ($page) => {
		return $page.url.pathname.startsWith('/home');
	});

	onMount(async () => {
		const client = await auth.createClient();
		auth0Client.set(client);
		isAuthenticated.set(await $auth0Client.isAuthenticated());
		user.set(await $auth0Client.getUser());
		const request = await fetch(`${apiConfig.apiUrl}users/roles/get-role`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				// @ts-expect-error
				email: $user.email
			})
		});
		const result = await request.json();
		localStorage.setItem('role', result.data);
		// console.log($user);
		localStorage.setItem('user', JSON.stringify($user));

		// Check for saved theme
		try {
			const savedTheme = loadSavedTheme();
			if (savedTheme) {
				applyThemeToDocument(savedTheme);
			} else {
				// Fallback to light/dark theme
				const localTheme = localStorage.getItem('theme') || 'dark';
				const themeType = localTheme === 'light' ? 'light' : 'dark';
				document.documentElement.setAttribute('data-theme', themeType);
				themeStore.setTheme(themeType);
			}
		} catch (error) {
			console.error('Error initializing theme:', error);
			// Set a default theme in case of error
			document.documentElement.setAttribute('data-theme', 'dark');
			themeStore.setTheme('dark');
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
	<div class="footer">
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

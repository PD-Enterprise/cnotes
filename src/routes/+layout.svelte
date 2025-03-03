<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Navbar from './components/navbar.svelte';
	import Footer from './components/footer.svelte';
	import { theme } from '$lib/stores/theme';

	import '../app.css';
	import { onMount } from 'svelte';
	let { children } = $props();

	const isAdminRoute = derived(page, ($page) => {
		return $page.url.pathname.startsWith('/home');
	});

	onMount(() => {
		const localTheme = localStorage.getItem('theme');
		if (localTheme === 'light') {
			document.documentElement.setAttribute('data-theme', 'light');
		} else {
			document.documentElement.setAttribute('data-theme', 'dark');
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

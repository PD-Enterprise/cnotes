<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Navbar from './components/navbar.svelte';
	import Footer from './components/footer.svelte';

	import '../app.css';
	let { children } = $props();

	const isAdminRoute = derived(page, ($page) => {
		return $page.url.pathname.startsWith('/admin-dashboard');
	});
</script>

<div class="main">
	<div class="navbar" style:display={$isAdminRoute ? 'none' : 'block'}>
		<Navbar />
	</div>
	{@render children()}
	<div class="footer">
		<Footer />
	</div>
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.footer {
		margin-top: auto;
	}
</style>

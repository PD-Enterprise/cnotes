<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Navbar from './components/navbar.svelte';
	import Footer from './components/footer.svelte';
	import '../app.css';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { ClerkProvider } from 'svelte-clerk';

	let { children }: { children: Snippet } = $props();

	const isAdminRoute = derived(page, ($page) => {
		return $page.url.pathname.startsWith('/home');
	});
	onMount(async () => {});
</script>

<ClerkProvider>
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
</ClerkProvider>

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
	.main {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.footer {
		margin-top: auto;
	}
</style>

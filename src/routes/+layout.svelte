<script lang="ts">
	// Imports
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import Navbar from './components/navbar.svelte';
	import Footer from './components/footer.svelte';
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import type { PageData } from './$types';
	import { autoLogin, isAuthenticated, sync } from '$lib/stores/store.svelte';

	let { children }: { children: Snippet } = $props();
	// console.log(data);
	// if (data.session && data.session.userId) {
	// 	isAuthenticated.value = true;
	// 	// console.log('isAuth', isAuthenticated.value);
	// 	onMount(() => {
	// 		if (localStorage.getItem('AutoLogin') == 'true') {
	// 			autoLogin.value = true;
	// 			// console.log('autoLogin', autoLogin.value);
	// 		}
	// 		if (localStorage.getItem('syncState') == 'true') {
	// 			sync.set(true);
	// 			// console.log('sync', $sync);
	// 		}
	// 	});
	// }

	const isAdminRoute = derived(page, ($page) => {
		return $page.url.pathname.startsWith('/home');
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
		height: 100vh;
	}
	.footer {
		margin-top: auto;
	}
</style>

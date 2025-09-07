<script lang="ts">
	// Imports
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import type { PageData } from './$types';

	let { children, data }: { children: Snippet; data: PageData } = $props();
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
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
</style>

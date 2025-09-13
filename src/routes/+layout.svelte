<script lang="ts">
	// Imports
	import { type Snippet } from 'svelte';
	import Navbar from './components/navbar.svelte';
	import '../app.css';
	import SvelteToast from './components/svelteToast.svelte';
	import type { PageData } from './$types';

	let { children, data }: { children: Snippet; data: PageData } = $props();
</script>

<SvelteToast />

<div class="main flex h-screen flex-col">
	<div class="navbar">
		<Navbar {data} />
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

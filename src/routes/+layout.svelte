<script lang="ts">
	// Imports
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import Navbar from './components/navbar.svelte';
	import SvelteToast from './components/svelteToast.svelte';
	import type { PageData } from './$types';
	import Loader from './components/loader.svelte';

	let { children, data }: { children: Snippet; data: PageData } = $props();
	let isLoaded = $state(false);

	onMount(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 50);
	});
</script>

<SvelteToast />

{#if !isLoaded}
	<Loader title="Loading Cnotes..." />
{/if}

<div
	class="main flex h-screen flex-col {isLoaded
		? 'opacity-100'
		: 'opacity-0'} overflow-hidden transition-opacity duration-400"
>
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

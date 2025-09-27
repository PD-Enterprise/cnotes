<script lang="ts">
	// Imports
	import { type Snippet } from 'svelte';
	import Navbar from './components/navbar.svelte';
	import '../app.css';
	import SvelteToast from './components/svelteToast.svelte';
	import type { PageData } from './$types';
	import LoadingScreen from './components/LoadingScreen.svelte';

	let { children, data }: { children: Snippet; data: PageData } = $props();

	let loading = true;
	// Hide loading screen after short delay (simulate CSS/app load)
	onMount(() => {
		setTimeout(() => {
			loading = false;
		}, 1200); // 1.2s for smoothness
	});
</script>

<SvelteToast />


{#if loading}
	<LoadingScreen />
{:else}
	<div class="main flex h-screen flex-col">
		<div class="navbar">
			<Navbar {data} />
		</div>
		<div class="content">
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
</style>

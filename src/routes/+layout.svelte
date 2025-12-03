<script lang="ts">
	// Imports
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import Navbar from './components/navbar.svelte';
	import type { PageData } from './$types';
	import Loader from './components/loader.svelte';
	import { onNavigate } from '$app/navigation';
	import { isAuthenticated } from '$lib/stores/store.svelte';
	import NotLoggedIn from './components/notLoggedIn.svelte';
	import SvelteToast from './components/svelteToast.svelte';

	let { children, data }: { children: Snippet; data: PageData } = $props();
	let isLoaded = $state(false);

	onMount(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 50);
	});

	if (!data.session || !data.session == null) {
		isAuthenticated.value = false;
	} else {
		isAuthenticated.value = true;
	}

	onNavigate((navigation) => {
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{#if !isLoaded}
	<Loader title="Loading Cnotes..." />
{/if}

<div
	class="main flex h-screen flex-col {isLoaded
		? 'opacity-100'
		: 'opacity-0'} overflow-hidden transition-opacity duration-400"
>
	<SvelteToast />
	{#if !isAuthenticated.value}
		<NotLoggedIn />
	{/if}
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
	::view-transition-old(note-card-*) {
		animation:
			fade-out 0.25s both,
			zoom-out-transition 0.25s both;
	}
	::view-transition-new(note-card-*) {
		animation:
			fade-in 0.25s both,
			zoom-in-transition 0.25s both;
	}
	@keyframes zoom-out-transition {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0.5;
			transform: scale(1.1);
		}
	}
	@keyframes zoom-in-transition {
		from {
			opacity: 0.5;
			transform: scale(1.1);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	::view-transition-old(root) {
		animation: fade-out 0.25s both;
	}

	::view-transition-new(root) {
		animation: fade-in 0.25s both;
	}
	@keyframes fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	::view-transition-old(note-title-*) {
		opacity: 0;
	}
	::view-transition-new(note-title-*) {
		opacity: 1;
	}
</style>

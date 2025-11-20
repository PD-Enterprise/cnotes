
<script lang="ts">
	// Imports
	import '../app.css';
	import { onMount, type Snippet, afterUpdate } from 'svelte';
	import Navbar from './components/navbar.svelte';
	import SvelteToast from './components/svelteToast.svelte';
	import type { PageData } from './$types';
	import Loader from './components/loader.svelte';
	import { onNavigate } from '$app/navigation';
	import { isAuthenticated, notesStore } from '$lib/stores/store.svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import NotLoggedIn from './components/notLoggedIn.svelte';
	import CommandPalette from './components/CommandPalette.svelte';
    import ConfirmationModal from './components/ConfirmationModal.svelte';
    import { commandPaletteStore } from '$lib/stores/commandPaletteStore';

	let { children, data }: { children: Snippet; data: PageData } = $props();
	let isLoaded = $state(false);
	let previousIsAuthenticated = $state(isAuthenticated.value);

	onMount(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 50);
	});

	afterUpdate(() => {
		const currentIsAuthenticated = !!data.session;
		if (currentIsAuthenticated && !previousIsAuthenticated) {
			// User just logged in
			setTimeout(() => {
				showToast(
					'Pro Tip!',
					'Press Ctrl+K (or Cmd+K) to open the command palette.',
					'info',
					8000
				);
			}, 1000); // Delay to ensure UI is ready
		}
		isAuthenticated.value = currentIsAuthenticated;
		previousIsAuthenticated = currentIsAuthenticated;
	});

	const handleKeydown = (event: KeyboardEvent) => {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			commandPaletteStore.open();
		}
	};

	isAuthenticated.value = !!data.session;

	// View Transitions
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

<svelte:window on:keydown={handleKeydown} />

<SvelteToast />
<CommandPalette notes={notesStore.value} />
<ConfirmationModal />

{#if !isLoaded}
	<Loader title="Loading Cnotes..." />
{/if}

<div
	class="main flex h-screen flex-col {isLoaded
		? 'opacity-100'
		: 'opacity-0'} overflow-hidden transition-opacity duration-400"
>
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

<!-- Hidden form for command palette logout -->
<form id="logout-form" action="/logout" method="POST" style="display: none;">
	<button type="submit">Logout</button>
</form>

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
	::view-transition-old(root),
	::view-transition-new(root) {
		animation: none;
	}
	::view-transition-new(root) {
		animation: fade-in 0.1s ease-in;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

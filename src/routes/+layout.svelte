<script lang="ts">
	import '../app.css';
	import Navbar from './components/navbar.svelte';
	import { Toaster } from 'svelte-french-toast';
	import AutoLogin from './components/autoLogin.svelte';
	import { isStudyModeActive } from '$lib/stores/store.svelte';
	import { slide } from 'svelte/transition';
</script>

<AutoLogin />
<div class="flex h-screen flex-col bg-base-300">
	{#if !$isStudyModeActive}
		<div transition:slide={{ duration: 300, axis: 'y' }}>
			<Navbar />
		</div>
	{/if}
	<main class="flex-1 overflow-y-auto">
		<slot />
	</main>
</div>
<Toaster />

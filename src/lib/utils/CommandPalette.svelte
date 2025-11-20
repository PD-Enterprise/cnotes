<script lang="ts">
	import { Command } from 'cmdk-svelte';
	import { goto } from '$app/navigation';
	import { theme } from '$lib/stores/store.svelte';

	// Icons
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import FilePlus2 from 'lucide-svelte/icons/file-plus-2';
	import Home from 'lucide-svelte/icons/home';
	import LogOut from 'lucide-svelte/icons/log-out';

	export let open: boolean;

	const toggleTheme = () => {
		theme.value = !theme.value;
		document.documentElement.setAttribute('data-theme', theme.value ? 'light' : 'dark');
		open = false;
	};

	const newNote = () => {
		goto('/home/new-note');
		open = false;
	};

	const goHome = () => {
		goto('/home');
		open = false;
	};

	const logout = () => {
		// This will submit the hidden form in +layout.svelte to sign out
		document.getElementById('logout-form')?.requestSubmit();
		open = false;
	};
</script>

<Command.Dialog bind:open {open} label="Command Menu">
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>

		<Command.Group heading="Navigation">
			<Command.Item onSelect={goHome}>
				<Home class="mr-2 h-4 w-4" />
				<span>Home</span>
			</Command.Item>
			<Command.Item onSelect={newNote}>
				<FilePlus2 class="mr-2 h-4 w-4" />
				<span>New Note</span>
			</Command.Item>
		</Command.Group>

		<Command.Group heading="Actions">
			<Command.Item onSelect={toggleTheme}>
				{#if theme.value}
					<Moon class="mr-2 h-4 w-4" />
					<span>Switch to Dark Mode</span>
				{:else}
					<Sun class="mr-2 h-4 w-4" />
					<span>Switch to Light Mode</span>
				{/if}
			</Command.Item>
		</Command.Group>

		<Command.Group heading="Account">
			<Command.Item onSelect={logout}>
				<LogOut class="mr-2 h-4 w-4" />
				<span>Logout</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>

<script lang="ts">
	import { Command } from 'cmdk-svelte';
	import { goto } from '$app/navigation';

	// Icons
	import FilePlus2 from 'lucide-svelte/icons/file-plus-2';
	import Home from 'lucide-svelte/icons/home';
	import LogOut from 'lucide-svelte/icons/log-out';

	export let open: boolean;

	const newNote = () => {
		goto('/new-note');
		open = false;
	};

	const goHome = () => {
		goto('/');
		open = false;
	};

	const logout = () => {
		// This will submit the hidden form in +layout.svelte to sign out
		document.getElementById('logout-form')?.requestSubmit();
		open = false;
	};
</script>

<!-- 
  The `cmdk-dialog` element is rendered into a portal, so we need to use :global()
  to style it. We apply a semi-transparent background and a backdrop-blur
  to achieve the glassmorphism effect.
-->
<style>
	:global([cmdk-dialog]) {
		@apply rounded-lg bg-base-200/60 backdrop-blur;
	}
	:global([cmdk-input]) {
		@apply bg-base-100/80;
	}
</style>

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

		<Command.Group heading="Account">
			<Command.Item onSelect={logout}>
				<LogOut class="mr-2 h-4 w-4" />
				<span>Logout</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>

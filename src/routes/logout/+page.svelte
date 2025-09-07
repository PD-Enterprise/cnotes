<script lang="ts">
	import { goto } from '$app/navigation';
	import { signOut } from '@auth/sveltekit/client';

	function cleanupAndSignOut() {
		for (let i = localStorage.length - 1; i >= 0; i--) {
			const key = localStorage.key(i);
			if (key && key.startsWith('note:')) {
				localStorage.removeItem(key);
			}
		}
		signOut({ redirectTo: '/' });
		goto('/');
	}
</script>

<div class="main flex flex-col items-center justify-center gap-5 p-3">
	<h1 class="text-2xl">Are you sure you want to sign out?</h1>
	<div class="options flex flex-row gap-5">
		<button class="btn btn-error" onclick={cleanupAndSignOut}>Yes</button>
		<button class="btn btn-accent" onclick={() => (window.location.href = '/')}>No</button>
	</div>
</div>

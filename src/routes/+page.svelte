<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col gap-5 p-3">
	{#if data.session}
		<p>Welcome, {data.session.user?.name || 'User'}!</p>
		<pre
			class="rounded-lg border-8 border-gray-700 bg-gray-600 p-4 break-words whitespace-pre-wrap">{JSON.stringify(
				data.session,
				null,
				2
			)}</pre>
		<button class="btn" onclick={() => signOut()}>Sign Out</button>
	{:else}
		<button class="btn" onclick={() => signIn('google')}>Sign In</button>
	{/if}
</div>

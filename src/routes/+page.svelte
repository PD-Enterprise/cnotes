<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
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
		<SignOut>
			<span class="btn" slot="submitButton">Signout</span>
		</SignOut>
	{:else}
		<SignIn>
			<span class="btn" slot="submitButton">Sign In</span>
		</SignIn>
	{/if}
</div>

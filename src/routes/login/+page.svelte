<script lang="ts">
	import Icon from '@iconify/svelte';
	import { signIn } from '@auth/sveltekit/client';

	async function handleGoogleSignIn() {
		await signIn('google' , { redirectTo: '/' }) ;
	}
</script>

<div class="flex h-full items-center justify-center animate-fadeInUp">
	<div class="card bg-base-200 w-96 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl font-bold">Login to Cnotes</h2>
			<p>Continue with your academic journey!</p>
			<div class="card-actions justify-end mt-4">
				<a href="/auth/google" class="btn btn-primary interactive-pop">
					<Icon icon="flat-color-icons:google" class="mr-2" />
					Login with Google
				</a>
			</div>
		</div>
	</div>
</div>
<style>
.main {
	 height: calc(100vh - 120px);
}
</style>
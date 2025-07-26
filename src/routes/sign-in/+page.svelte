<script lang="ts">
	import SignIn from 'clerk-sveltekit/client/SignIn.svelte';
</script>

<div class="signIn-component flex justify-center p-4">
	<SignIn redirectUrl="/home" />
</div>

<style>
	.signIn-component {
		margin-top: 30px;
		height: 100%;
		display: flex;
		justify-content: center;
	}
</style>

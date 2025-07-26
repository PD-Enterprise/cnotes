<script lang="ts">
	import SignUp from 'clerk-sveltekit/client/SignUp.svelte';
</script>

<div class="signUp-component flex justify-center p-4">
	<SignUp redirectUrl="/home" />
</div>

<style>
	.signUp-component {
		margin-top: 30px;
		height: 100%;
		display: flex;
		justify-content: center;
	}
</style>

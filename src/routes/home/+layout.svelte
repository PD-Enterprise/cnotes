<script lang="ts">
	// Importing necessary modules and components
	import { onMount } from 'svelte';
	import InAppNavbar from '../components/inAppNavbar.svelte';
	import auth from '$lib/utils/authService';
	import { isAuthenticated, user, auth0Client, autoLogin } from '$lib/stores/store';

	// Destructuring children from props
	let { children } = $props();

	// Variable to hold the cookie value
	let cookieValue: string;

	onMount(async () => {
		isAuthenticated.set(await $auth0Client.isAuthenticated());
		user.set(await $auth0Client.getUser());
		console.log($user);
		localStorage.setItem('user', JSON.stringify($user));
	});
</script>

<div class="main">
	<div class="navbar mb-5 mt-3">
		<InAppNavbar />
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.navbar {
		margin: 0;
		padding: 0;
	}
</style>

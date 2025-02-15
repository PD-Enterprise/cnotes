<script lang="ts">
	// Importing necessary modules and components
	import { onMount } from 'svelte';
	import InAppNavbar from '../components/inAppNavbar.svelte';
	import { renewCookie } from '$lib/utils/renewCookie';
	import { loggedIn } from '$lib/stores/loggedIn';

	// Destructuring children from props
	let { children } = $props();

	// Variable to hold the cookie value
	let cookieValue: string;

	// Function to fetch and renew the cookie
	onMount(async () => {
		// Fetching the cookie from the server
		const response = await fetch('/api/cookie', {
			method: 'GET',
			credentials: 'include'
		});
		// Parsing the response
		// Checking if the response is successful
		if (response.ok) {
			const result = await response.json();
			// console.log(result);
			// Setting the cookie value
			cookieValue = result.cookieValue;
			// Checking if the cookie value exists
			if (cookieValue) {
				// Renewing the cookie
				renewCookie(cookieValue);
			}
		}
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
	}
</style>

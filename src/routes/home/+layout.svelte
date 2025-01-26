<script lang="ts">
	// Importing necessary modules and components
	import { onMount } from 'svelte';
	import InAppNavbar from '../components/inAppNavbar.svelte';
	import renewCookie from '$lib/utils/renewCookie';
	import { loggedIn } from '$lib/stores/loggedIn';

	// Destructuring children from props
	let { children } = $props();

	// Variable to hold the cookie value
	let cookieValue: string;

	// Function to fetch and renew the cookie
	onMount(async () => {
		if ($loggedIn) {
			// Fetching the cookie from the server
			const response = await fetch('/api/cookie', {
				method: 'GET',
				credentials: 'include'
			});
			// Parsing the response
			const result = await response.json();
			// Checking if the response is successful
			if (result.message == 'success') {
				// Setting the cookie value
				cookieValue = result.cookieValue;
				// Checking if the cookie value exists
				if (cookieValue) {
					// Renewing the cookie
					await renewCookie(cookieValue);
				}
			} else {
				// Logging an error if the response is not successful
				// console.error('Failed to fetch cookie.', result.message);
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

<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Variables
	let httpDogUrlStatusCode = $state('');
	let imgSrc = $state('');

	// Functions
	async function getStatusCode() {
		try {
			const currentUrl = window.location.href;
			const myResponse = await fetch(currentUrl);
			const statusCode: number = myResponse.status;
			if (statusCode !== 200) {
				httpDogUrlStatusCode = statusCode.toString();
			}
		} catch (error) {
			console.error('There was an error:', error);
		}
	}
	onMount(() => {
		getStatusCode();
	});
	$effect(() => {
		// console.log(httpDogUrlStatusCode);
		imgSrc = `https://http.dog/${httpDogUrlStatusCode}.jpg`;
	});
</script>

<center>
	<img src={imgSrc} class="mt-5" alt="Image for Error Code: {httpDogUrlStatusCode}" />
</center>
<center>
	<a href="/home" class="btn mb-5 mt-5 text-3xl">Go To Home</a>
</center>

<style>
	img {
		width: 41.16rem;
		height: 36rem;
	}
</style>

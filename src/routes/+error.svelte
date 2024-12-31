<script lang="ts">
	// Imports
	import { onMount } from 'svelte';

	// Variables
	let httpDogUrlStatusCode: string;

	// Functions
	async function getStatusCode() {
		try {
			const currentUrl = window.location.href;
			const myResponse = await fetch(currentUrl);
			const statusCode: number = myResponse.status;
			if (statusCode !== 200) {
				httpDogUrlStatusCode = `${statusCode}`;
			}
		} catch (error) {
			console.error('There was an error:', error);
		}
	}
	onMount(() => {
		getStatusCode();
	});
	$: imgSrc = `https://http.dog/${httpDogUrlStatusCode}.jpg`;
</script>

<center>
	<iframe src={imgSrc} title="Error" class="mt-5"></iframe>
</center>
<center>
	<a href="/" class="btn mb-5 mt-5 text-3xl">Go To Home</a>
</center>

<style>
	iframe {
		width: 41.16rem;
		height: 36rem;
	}
</style>

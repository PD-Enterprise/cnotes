<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { onMount } from 'svelte';

	async function getNotes(userEmail: string) {
		if (userEmail) {
			const request = await fetch('/api/notes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Email: userEmail
				})
			});
			const result = await request.json();
			console.log(result.response);
		}
	}
	onMount(() => {
		const userEmail = sessionStorage.getItem('Email');

		getNotes(userEmail);
	});
</script>

This is the home page. Coming Soon...

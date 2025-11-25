<script lang="ts">
	// Imports
	import { SvelteToast } from '@zerodevx/svelte-toast';

	// Variables
	const toastOptions = {
		duration: 40,
		initial: 1,
		next: 0,
		pausable: false,
		dismissable: true,
		reversed: false,
		intro: { x: 0 },
		theme: {},
		classes: []
	};
</script>

<SvelteToast {toastOptions} />

<style>
	:global(.info) {
		--toastBackground: blue;
		--toastColor: white;
	}

	:global(.error) {
		--toastBackground: red;
		--toastColor: white;
	}

	:global(.success) {
		--toastBackground: green;
		--toastColor: white;
	}
</style>

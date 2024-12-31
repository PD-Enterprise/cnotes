<script lang="ts">
	// Imports
	import {
		toasts,
		ToastContainer as ToastContainerAny,
		FlatToast as FlatToastAny
	} from 'svelte-toasts';
	import { onMount } from 'svelte';

	// Variables
	const ToastContainer = ToastContainerAny as any;
	const FlatToast = FlatToastAny as any;
</script>

<svelte:component this={ToastContainer} let:data>
	<svelte:component this={FlatToast} {data} />
</svelte:component>

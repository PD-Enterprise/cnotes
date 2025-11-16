<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const dialog = document.getElementById('my_modal_2');
		if (dialog) {
			// @ts-expect-error
			dialog.showModal();
		}
	});
</script>

<dialog id="my_modal_2" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">You are not logged in</h3>
		<p class="py-4">Please login to continue.</p>
		<button
			onclick={() => {
				const dialog = document.getElementById('my_modal_2');
				if (dialog) {
					// @ts-expect-error
					dialog.close();
				}
			}}
		>
			<a href="/login" class="btn btn-primary">Login</a>
		</button>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

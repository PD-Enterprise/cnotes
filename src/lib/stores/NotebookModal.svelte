<script lang="ts">
	import { showNotebookModal } from '$lib/stores/store.svelte';
	import { createNotebook } from '$lib/utils/notebooks';
	import { showToast } from '$lib/utils/svelteToastsUtil';

	let notebookName = '';

	function handleCreateNotebook() {
		if (notebookName.trim()) {
			createNotebook(notebookName.trim());
			showToast('Success', `Notebook "${notebookName.trim()}" created.`, 3000, 'success');
			notebookName = '';
			showNotebookModal.value = false;
		} else {
			showToast('Error', 'Notebook name cannot be empty.', 3000, 'error');
		}
	}
</script>

<dialog id="notebook_modal" class="modal" bind:open={showNotebookModal.value}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">Create New Notebook</h3>
		<div class="py-4">
			<input
				type="text"
				placeholder="Enter notebook name"
				class="input input-bordered w-full"
				bind:value={notebookName}
				on:keydown={(e) => e.key === 'Enter' && handleCreateNotebook()}
			/>
		</div>
		<div class="modal-action">
			<button class="btn btn-primary" on:click={handleCreateNotebook}>Create</button>
			<button class="btn" on:click={() => (showNotebookModal.value = false)}>Cancel</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop" on:submit|preventDefault={() => (showNotebookModal.value = false)}>
		<button>close</button>
	</form>
</dialog>
<script lang="ts">
	import { modalStore } from '$lib/stores/modalStore';

	let dialog: HTMLDialogElement;

	// Subscribe to the modal store to control the dialog's state
    modalStore.subscribe(value => {
        if (dialog) {
            if (value.isOpen) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }
    });

	// Get a reactive snapshot of the store's value
	const state = modalStore.getState();

	function handleConfirm() {
		if($state.onConfirm) {
            $state.onConfirm();
        }
		modalStore.close();
	}

    function handleClose() {
        modalStore.close();
    }
</script>

<dialog bind:this={dialog} class="modal" on:close={handleClose}>
	<!-- Apply glassmorphism styling to the modal-box -->
	<div class="modal-box rounded-lg bg-base-200/60 backdrop-blur-sm">
		<h3 class="font-bold text-lg">{$state?.title}</h3>
		<p class="py-4">{$state?.message}</p>
		<div class="modal-action">
			<button class="btn" on:click={handleClose}>Cancel</button>
			<button class="btn btn-error" on:click={handleConfirm}>Confirm</button>
		</div>
	</div>
    <form method="dialog" class="modal-backdrop">
        <button on:click={handleClose}>close</button>
    </form>
</dialog>

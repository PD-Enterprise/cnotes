
<script lang="ts">
	import { modalStore } from '$lib/stores/modalStore';
	import { onMount } from 'svelte';

	let dialog: HTMLDialogElement;
    let state: { isOpen: boolean; title: string; message: string; onConfirm: () => void; };

    modalStore.subscribe(value => {
        state = value;
        if (dialog) {
            if (state.isOpen) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }
    });

	function handleConfirm() {
		if(state.onConfirm) {
            state.onConfirm();
        }
		modalStore.close();
	}

    function handleClose() {
        modalStore.close();
    }
</script>

<dialog bind:this={dialog} class="modal" on:close={handleClose}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">{state?.title}</h3>
		<p class="py-4">{state?.message}</p>
		<div class="modal-action">
			<button class="btn" on:click={handleClose}>Cancel</button>
			<button class="btn btn-error" on:click={handleConfirm}>Confirm</button>
		</div>
	</div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>

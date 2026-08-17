<script lang="ts">
	import { getOcr } from '$lib/api/get-ocr';
	import { EditorNoteData, editorState } from '$lib/stores/store.svelte';
	import { compressImage } from '$lib/utils/compressImage';
	import { onMount } from 'svelte';
	import IconUpload from '~icons/material-symbols/upload';

	const MAX_FILE_SIZE = 20 * 1024 * 1024;
	const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

	let ocrModal: HTMLDialogElement | undefined = $state(undefined);
	let input: HTMLInputElement | undefined = $state(undefined);
	let loading: string = $state('');
	let error: string = $state('');
	let isOver = $state(false);
	let image: File | undefined = $state(undefined);
	let imageUrl = $derived(image ? URL.createObjectURL(image) : undefined);

	async function extractText(file: File) {
		loading = 'Extracting text...';
		try {
			await getOcr(image, (chunk) => {
				if (chunk.type === 'delta' && chunk.delta) {
					console.log(chunk.delta);
					EditorNoteData.value.content += chunk.delta.replaceAll('\n', '<br>');
					editorState.editor?.commands.setContent(EditorNoteData.value.content, {
						emitUpdate: false
					});
				} else if (chunk.type === 'error') {
					error = 'Error extracting text. Please try again.';
				} else if (chunk.type === 'done') {
					ocrModal.close();
				}
			});
		} catch (e) {
			error = 'Error extracting text. Please try again.';
		} finally {
			loading = '';
		}
	}
	async function setImage() {
		loading = 'Uploading image...';
		if (!input || !input.files) {
			error = 'No file selected';
			return;
		}
		image = input.files[0];

		if (!ALLOWED_TYPES.includes(image.type)) {
			error = 'Only JPEG, PNG, and WebP files are accepted';
			return;
		}
		if (image.size >= MAX_FILE_SIZE) {
			loading = 'File too large. Compressing image...';
			const compressedFile = await compressImage(image);
			if (!compressedFile) {
				error = 'Error compressing image. Please try again.';
				return;
			}
			image = compressedFile;
		}

		await extractText(image);
	}
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isOver = true;
	}
	function handleDragLeave() {
		isOver = false;
	}
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isOver = false;

		if (!event.dataTransfer) {
			return;
		}
		if (event.dataTransfer.files && input) {
			input.files = event.dataTransfer.files;
			setImage();
		}
	}

	onMount(() => {
		ocrModal = document.getElementById('ocr_modal') as HTMLDialogElement | null;
		ocrModal.showModal();
	});
</script>

<dialog class="modal" id="ocr_modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>

		<div class="flex flex-col items-center justify-center gap-2 p-4">
			<label
				class="group border-base-content hover:bg-base-300 bg-base-200 relative flex aspect-[4/3] w-full max-w-md cursor-pointer justify-center overflow-hidden rounded-3xl border-4 border-dashed p-6 text-center shadow-lg transition duration-300 hover:shadow-2xl sm:p-8"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
			>
				<input
					type="file"
					id="file-upload"
					class="hidden"
					bind:this={input}
					onchange={setImage}
					multiple={false}
					accept="image/jpeg, image/png, image/webp"
				/>

				{#if image && imageUrl}
					<img
						src={imageUrl}
						alt={image.name}
						class="pointer-events-none absolute inset-0 h-full w-full object-contain"
					/>
				{/if}

				<div class="relative z-10 flex flex-col items-center justify-center gap-4 sm:gap-6">
					{#if image}
						{#if loading}
							<div class="rounded-2xl bg-black/60 px-6 py-4 text-white backdrop-blur-sm">
								<span class="loading loading-spinner loading-md"></span>
								<span class="block text-lg font-semibold sm:text-xl"> Uploading Image... </span>
								<span class="mt-1 block text-xs sm:text-sm">
									{loading}
								</span>
							</div>
						{/if}
					{:else}
						<IconUpload class="h-12 w-12 sm:h-16 sm:w-16" />
						<span class="px-4 sm:px-8">
							<span class="block text-lg font-semibold transition duration-300 sm:text-xl">
								Upload Image...
							</span>
							<span class="text-base-content mt-1 block text-xs sm:text-sm">
								Click or drag a file into this area
							</span>
						</span>
					{/if}
				</div>
			</label>
			{#if error}
				<p class=" text-red-500">{error}</p>
			{/if}
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={close}>close</button>
	</form>
</dialog>

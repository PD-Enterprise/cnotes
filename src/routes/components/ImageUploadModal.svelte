<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { uploadImage } from '$lib/api/upload-image';
	import IconWarning from '~icons/material-symbols/warning';
	import IconCloudUpload from '~icons/material-symbols/cloud-upload';

	let {
		onInsert
	}: {
		onInsert: (url: string) => void;
	} = $props();

	let dialog: HTMLDialogElement | undefined = $state();
	let fileInput: HTMLInputElement | undefined = $state();

	let uploading = $state(false);
	let dragOver = $state(false);
	let promptCompress = $state(false);
	let pendingFile: File | null = $state(null);

	function open() {
		dialog?.showModal();
	}

	function close() {
		uploading = false;
		dragOver = false;
		promptCompress = false;
		pendingFile = null;
		dialog?.close();
	}

	function resizeToWebP(file: File, quality: number): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				const MAX = 1200;
				let { width, height } = img;
				if (width > MAX || height > MAX) {
					if (width > height) {
						height = Math.round((height / width) * MAX);
						width = MAX;
					} else {
						width = Math.round((width / height) * MAX);
						height = MAX;
					}
				}
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					reject(new Error('Could not get canvas context'));
					return;
				}
				ctx.drawImage(img, 0, 0, width, height);
				canvas.toBlob(
					(blob) => {
						if (blob) resolve(blob);
						else reject(new Error('Canvas conversion failed'));
						URL.revokeObjectURL(img.src);
					},
					'image/webp',
					quality
				);
			};
			img.onerror = () => {
				URL.revokeObjectURL(img.src);
				reject(new Error('Failed to load image'));
			};
			img.src = URL.createObjectURL(file);
		});
	}

	function blobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error('Failed to read image'));
			reader.readAsDataURL(blob);
		});
	}

	async function processAndUpload(file: File, initialQuality = 0.85) {
		uploading = true;
		try {
			let quality = initialQuality;
			let blob = await resizeToWebP(file, quality);

			while (blob.size > 9 * 1024 * 1024 && quality > 0.05) {
				quality = Math.round((quality - 0.1) * 100) / 100;
				blob = await resizeToWebP(file, quality);
			}

			if (blob.size > 9 * 1024 * 1024) {
				showToast('Image too large even after maximum compression', 'error');
				uploading = false;
				return;
			}

			const base64 = await blobToBase64(blob);
			const publicId = crypto.randomUUID();
			const url = await uploadImage(base64, publicId);
			showToast('Image uploaded successfully', 'success');
			onInsert(url);
			close();
		} catch (err) {
			showToast(err instanceof Error ? err.message : 'Upload failed', 'error');
			uploading = false;
		}
	}

	function handleFile(file: File) {
		if (!file.type.startsWith('image/')) {
			showToast('Please select an image file', 'error');
			return;
		}

		if (file.size > 9 * 1024 * 1024) {
			pendingFile = file;
			promptCompress = true;
			return;
		}

		processAndUpload(file);
	}

	function onCompress() {
		promptCompress = false;
		if (pendingFile) {
			const file = pendingFile;
			pendingFile = null;
			processAndUpload(file);
		}
	}

	function onCancelCompress() {
		promptCompress = false;
		pendingFile = null;
	}

	function onFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
		input.value = '';
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function onDragLeave() {
		dragOver = false;
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		const file = event.dataTransfer?.files?.[0];
		if (file) handleFile(file);
	}

</script>

<dialog bind:this={dialog} class="modal" id="image_upload_modal">
	<div class="modal-box p-6">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			onclick={close}
			aria-label="Close"
		>
			✕
		</button>
		<h3 class="text-lg font-bold mb-4">Upload Image</h3>

		{#if uploading}
			<div class="flex flex-col items-center gap-3 py-8">
				<span class="loading loading-spinner loading-lg text-primary"></span>
				<p class="text-sm opacity-70">Compressing and uploading image...</p>
			</div>
		{:else if promptCompress}
			<div class="flex flex-col items-center gap-4 py-8">
				<IconWarning width="40" height="40" class="text-warning" />
				<p class="text-sm text-center">
					The selected image exceeds <strong>9MB</strong>.
					It will be resized and compressed before upload.
				</p>
				<p class="text-xs opacity-60 text-center">The original image data will be discarded.</p>
				<div class="flex gap-3 mt-2">
					<button class="btn btn-outline btn-sm" onclick={onCancelCompress}>Cancel</button>
					<button class="btn btn-primary btn-sm" onclick={onCompress}>Compress & Upload</button>
				</div>
			</div>
		{:else}
			<div
				class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
				class:border-primary={dragOver}
				class:bg-base-200={dragOver}
				role="button"
				tabindex="0"
				ondragover={onDragOver}
				ondragleave={onDragLeave}
				ondrop={onDrop}
				onclick={() => fileInput?.click()}
				onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
			>
				<IconCloudUpload
					width="48"
					height="48"
					class="opacity-50 mx-auto mb-2"
				/>
				<p class="text-sm opacity-70">Drag & drop an image here, or click to select</p>
				<p class="text-xs opacity-50 mt-1">Will be resized to 1200px max and converted to WebP</p>
			</div>
		{/if}

		<input
			type="file"
			accept="image/*"
			class="hidden"
			bind:this={fileInput}
			onchange={onFileSelected}
		/>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={close}>close</button>
	</form>
</dialog>

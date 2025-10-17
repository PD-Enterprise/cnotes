<script lang="ts">
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import Icon from '@iconify/svelte';
	import urlConfig from '$lib/utils/urlConfig';
	import { onMount } from 'svelte';

	export let slug;

	onMount(() => {
		console.log(urlConfig.shareUrl);
	});
</script>

<dialog id="share_modal" class="modal">
	<div class="modal-box p-4">
		<div class="share-container flex flex-row items-center gap-2">
			<a id="share-link" href="{urlConfig.shareUrl}{slug}/sharing" class="share-link"
				>https://cnotes.pages.dev/{slug}/sharing</a
			>
			<button
				class="btn btn-sm btn-square"
				aria-label="Copy share link to clipboard"
				onclick={() => {
					navigator.clipboard.writeText(`https://cnotes.pages.dev/${slug}/sharing`);
					showToast('success', 'Link copied to clipboard!', 2500, 'success');
				}}
			>
				<Icon icon="mdi:clipboard-outline" width="20" height="20" />
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.share-link {
		text-decoration: underline;
		color: #4a90e2;
	}
	.share-link:hover {
		color: #3f7dc4;
	}
</style>

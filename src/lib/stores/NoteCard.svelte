<script lang="ts">
	import { notebooksStore } from '$lib/stores/store.svelte';
	import { addNoteToNotebook, removeNoteFromNotebooks } from '$lib/utils/notebooks';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import type { note } from '../../types';

	export let note: note;
	export let deleteNoteFromCloud: (note: note) => void;
</script>

<div class="card bg-base-200 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">{note.title}</h2>
		<p>
			{note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
		</p>
		<div class="card-actions justify-end items-center">
			<div class="dropdown dropdown-top dropdown-end">
				<div tabindex="0" role="button" class="btn btn-sm m-1">Move to</div>
				<ul
					tabindex="0"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
				>
					<li>
						<a
							href={'#'}
							on:click|preventDefault={() => {
								removeNoteFromNotebooks(note.slug);
								showToast('Moved', `Note moved to Uncategorized`, 2000, 'info');
							}}>Uncategorized</a
						>
					</li>
					<div class="divider my-0"></div>
					{#if notebooksStore.value.length > 0}
						{#each notebooksStore.value as notebook}
							<li>
								<a
									href={'#'}
									on:click|preventDefault={() => {
										addNoteToNotebook(note.slug, notebook.id);
										showToast('Moved', `Note moved to ${notebook.name}`, 2000, 'info');
									}}>{notebook.name}</a
								>
							</li>
						{/each}
					{:else}
						<li><a>No notebooks yet</a></li>
					{/if}
				</ul>
			</div>
			<a href="/home/{note.slug}" class="btn btn-primary">View</a>
			<button class="btn btn-error" on:click={() => deleteNoteFromCloud(note)}>Delete</button>
		</div>
	</div>
</div>
<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { note } from '../types';
	import { toTitleCase } from '$lib/utils/toTitleCase';
	import { getDiagram } from '$lib/api/get-note';

	let { note, auth } = $props<{ note: note; auth: any }>();

	async function deleteNote(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		const response = await fetch(`/api/delete-note`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ slug: note.slug, auth: auth.session.access_token })
		});
		const result = await response.json();
		if (result.status === 200) {
			window.location.reload();
		}
	}
	async function shareNote(e: MouseEvent) {
		e.preventDefault();
		const shareData = {
			title: 'Cnotes',
			text: 'Check out this note from Cnotes!',
			url: `${window.location.origin}/${note.slug}/sharing`
		};
		try {
			await navigator.share(shareData);
			// console.log('Note shared successfully');
		} catch (err) {
			// console.log('Error sharing note:', err);
		}
	}
</script>

<a
	href={`/${note.slug}`}
	id={note.slug}
	class="note-card bg-base-100 rounded-lg p-4 shadow-md flex flex-col justify-between gap-4 interactive-pop"
>
	<div>
		<h2 class="text-xl font-bold mb-2">{toTitleCase(note.title)}</h2>
		<div class="note-meta text-sm text-base-content opacity-60">
			{#if note.academicLevel}
				<span>Grade: {note.academicLevel}</span>
			{/if}
			{#if note.topic}
				<span>Subject: {note.topic}</span>
			{/if}
		</div>
	</div>

	<div class="note-actions flex justify-end items-center gap-2">
		<button class="btn btn-circle btn-sm" onclick={shareNote}>
			<Icon icon="mdi:share-variant" width="20" height="20" />
		</button>
		<button class="btn btn-circle btn-sm btn-error" onclick={deleteNote}>
			<Icon icon="mdi:delete" width="20" height="20" />
		</button>
	</div>
</a>

<style>
	.note-card {
		border: 1px solid transparent;
		min-height: 150px;
		width: 300px;
	}

	.note-card:hover {
		border-color: var(--primary);
	}
</style>

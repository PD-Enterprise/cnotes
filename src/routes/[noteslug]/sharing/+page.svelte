<script lang="ts">
	import { onMount } from 'svelte';
	import type { note } from '../../types';
	import { page } from '$app/stores';
	import Tiptap from '../../components/tiptap.svelte';
	import Excalidraw from '../../components/Excalidraw.svelte';
	import IconEyeOff from '~icons/material-symbols/visibility-off';
	import IconEye from '~icons/material-symbols/visibility';
	import ShareModel from '../../components/shareModel.svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';

	let errorMessage: string = $state('');
	let noteData = $state<note | null>(null);
	let localNote = null;
	let hasLocalNote = false;
	let slug: string = $state('');
	let shouldShowMetadata: boolean = $state(false);
	let isLoading: boolean = $state(true);

	// Functions
	function formatDate(value: string): string {
		if (!value) return '';
		const d = new Date(value);
		if (isNaN(d.getTime())) return value;
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	async function getNoteFromServer() {
		const request = await fetch(`/${slug}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await request.json();
		if (result.status != 200) {
			noteData = null;
			getNoteFromLocalStorage(slug);
			switch (result.status) {
				case 401:
					errorMessage = 'You must be logged in to view this note.';
					break;
				case 403:
					errorMessage =
						"You aren't the owner of this note. You do not have permission to view it.";
					break;
				default:
					errorMessage = 'Note not found or an unexpected error occurred.';
					break;
			}
			isLoading = false;
			return;
		}

		const serverNote = result.data[0];
		noteData = { ...serverNote };
		isLoading = false;
	}
	async function getNoteFromLocalStorage(slug: string) {
		const storedNote = localStorage.getItem(`note:${slug}`);
		if (storedNote) {
			hasLocalNote = true;
			try {
				localNote = JSON.parse(storedNote);
			} catch (e) {
				errorMessage = 'Failed to load note from local storage.';
				isLoading = false;
				return;
			}
			noteData = { ...localNote };
		}
	}

	onMount(() => {
		slug = $page.url.pathname.split('/sharing')[0].split('/')[1];
		getNoteFromLocalStorage(slug);
		getNoteFromServer();
	});
</script>

{#if isLoading}
	<div class="reader" style="view-transition-name: note-card-{slug}">
		<div class="skeleton" style="width: 40%; height: 2rem; margin-bottom: 1rem;"></div>
		<div class="skeleton" style="width: 60%; height: 1rem; margin-bottom: 0.5rem;"></div>
		<div class="skeleton" style="width: 100%; height: 1rem; margin-bottom: 0.5rem;"></div>
		<div class="skeleton" style="width: 90%; height: 1rem; margin-bottom: 0.5rem;"></div>
		<div class="skeleton" style="width: 95%; height: 1rem; margin-bottom: 1.5rem;"></div>
		<div class="skeleton" style="width: 100%; height: 8rem;"></div>
	</div>
{:else if errorMessage && !noteData}
	<div class="reader error-state">
		<p class="error-message">{errorMessage}</p>
		<a class="btn btn-primary btn-sm" href="/">Go home</a>
	</div>
{:else if noteData}
	<div class="reader" style="view-transition-name: note-card-{slug}">
		<div class="meta">
			{#if noteData.academicLevel}
				<span class="tag accent">
					{!isNaN(Number(noteData.academicLevel)) && noteData.academicLevel.trim() !== ''
						? `${noteData.academicLevel}th grade`
						: noteData.academicLevel}
				</span>
			{/if}
			{#if noteData.topic}
				<span class="tag muted">{noteData.topic}</span>
			{/if}
			<span class="tag {noteData.visibility === 'public' ? 'info' : 'muted'}">
				{noteData.visibility
					? noteData.visibility.charAt(0).toUpperCase() + noteData.visibility.slice(1)
					: ''}
			</span>
			{#if noteData.dateUpdated}
				<span class="tag muted">Updated {formatDate(noteData.dateUpdated)}</span>
			{/if}
			<button
				class="btn btn-ghost btn-xs"
				aria-label="Toggle metadata"
				onclick={() => {
					shouldShowMetadata = !shouldShowMetadata;
				}}
			>
				{#if shouldShowMetadata}
					<IconEyeOff width="16" height="16" />
				{:else}
					<IconEye width="16" height="16" />
				{/if}
			</button>
		</div>
		{#if shouldShowMetadata}
			<details open class="extended-meta">
				<summary>Metadata</summary>
				<div class="meta-chips">
					{#if noteData.dateCreated}
						<span class="tag muted">Created {formatDate(noteData.dateCreated)}</span>
					{/if}
					{#if noteData.language}
						<span class="tag muted">{toTitleCase('language')}: {noteData.language}</span>
					{/if}
					{#if noteData.keywords}
						<span class="tag muted">Keywords: {noteData.keywords}</span>
					{/if}
					{#if noteData.year}
						<span class="tag muted">Year: {noteData.year}</span>
					{/if}
				</div>
			</details>
		{/if}
		<div class="body">
			{#if noteData.type === 'text'}
				<Tiptap content={noteData.content} editable={false} />
			{:else if noteData.type === 'diagram'}
				<div class="diagram-wrap">
					<Excalidraw theme="dark" content={noteData.content} viewModeEnabled={true} />
				</div>
			{/if}
		</div>
	</div>
	<ShareModel slug={noteData.slug} />
{:else}
	<div class="reader">
		<p class="loading-note">Loading Note</p>
	</div>
{/if}

<style>
	.reader {
		--muted: color-mix(in srgb, var(--color-base-content) 60%, transparent);
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 8px 12px 8px;
		height: calc(100vh - 65px);
		overflow-y: auto;
	}
	.reader .meta {
		color: var(--muted);
		font-size: 0.85rem;
		margin-bottom: 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.reader .body {
		font-size: 1.1rem;
		line-height: 1.85;
	}
	.reader .body :global(img) {
		max-width: 100%;
		height: auto;
	}
	.tag {
		font-size: 0.7rem;
		padding: 2px 8px;
		border-radius: 4px;
		background: var(--color-base-200);
		color: var(--color-base-content);
		border: 1px solid var(--color-base-300);
	}
	.tag.accent {
		background: color-mix(in srgb, var(--color-primary) 15%, transparent);
		color: var(--color-primary);
		border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
	}
	.tag.muted {
		background: var(--color-base-200);
		color: var(--muted);
		border-color: var(--color-base-300);
	}
	.tag.info {
		background: color-mix(in srgb, var(--color-secondary) 15%, transparent);
		color: var(--color-secondary);
		border-color: color-mix(in srgb, var(--color-secondary) 30%, transparent);
	}
	.skeleton {
		background: linear-gradient(
			90deg,
			var(--color-base-200),
			var(--color-base-300),
			var(--color-base-200)
		);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
		border-radius: 4px;
	}
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
	.error-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		text-align: center;
		min-height: 40vh;
	}
	.error-message {
		color: var(--color-base-content);
	}
	.loading-note {
		text-align: center;
		color: var(--muted);
	}
	.diagram-wrap {
		min-height: 400px;
		height: calc(100vh - 65px);
	}
	.diagram-wrap :global(.root) {
		min-height: 400px;
	}
	.extended-meta {
		margin-bottom: 20px;
	}
	.extended-meta summary {
		cursor: pointer;
		color: var(--muted);
		font-size: 0.85rem;
	}
	.meta-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 8px;
	}
	.reader :global(.editor-container) {
		box-shadow: none;
	}
	.reader :global(.editor) {
		border: none;
	}
	.reader :global(.tiptap) {
		font-size: 1.1rem;
		line-height: 1.85;
	}
	.reader :global(.tiptap p) {
		margin: 0 0 14px;
	}
	.reader :global(.tiptap img) {
		max-width: 100%;
		height: auto;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	@media (max-width: 900px) {
		.reader {
			padding: 8px 12px;
		}
	}
	@media (max-width: 600px) {
		.reader {
			padding: 8px 12px;
		}
		.reader .body {
			font-size: 1rem;
		}
		.diagram-wrap {
			height: calc(100vh - 65px);
			min-height: 300px;
		}
	}
</style>

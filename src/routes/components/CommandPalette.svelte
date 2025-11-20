i<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { note } from '../types';

	// Props & State
	export let show = false;
	export let notes: note[] = [];
	let inputValue = '';
	let searchResults: note[] = [];
	let commandResults: { id: string; title: string; action: () => void; icon: string }[] = [];
	let activeIndex = 0;
	let inputElement: HTMLInputElement;

	const dispatch = createEventDispatcher();

	const availableCommands = [
		{
			id: 'new-note',
			title: 'Create New Note',
			action: () => (window.location.href = '/new-note'),
			icon: 'mage:edit'
		},
		{
			id: 'logout',
			title: 'Logout',
			action: () => (window.location.href = '/auth/logout'),
			icon: 'mage:logout'
		}
	];

	// When the component is shown, focus the input
	$: if (show && inputElement) {
		inputElement.focus();
	}

	// Main search/filter logic
	$: {
		if (inputValue.length > 0) {
			searchResults = notes
				.filter((note) => note.title.toLowerCase().includes(inputValue.toLowerCase()))
				.slice(0, 5); // Limit results for performance
			commandResults = availableCommands.filter((cmd) =>
				cmd.title.toLowerCase().includes(inputValue.toLowerCase())
			);
		} else {
			// Show default state (all commands, recent notes)
			searchResults = notes.slice(0, 5);
			commandResults = availableCommands;
		}
		activeIndex = 0; // Reset selection on new input
	}

	const combinedResults = $derived([...searchResults, ...commandResults]);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = (activeIndex + 1) % combinedResults.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = (activeIndex - 1 + combinedResults.length) % combinedResults.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const selected = combinedResults[activeIndex];
			if (selected) {
				if ('slug' in selected) {
					// It's a note
					document.getElementById(selected.slug)?.focus();
				} else {
					// It's a command
					selected.action();
				}
				close();
			}
		} else if (event.key === 'Escape') {
			close();
		}
	}

	function close() {
		show = false;
		inputValue = '';
		dispatch('close');
	}
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
		on:click={close}
		transition:fade={{ duration: 150 }}
	></div>
	<div
		class="fixed top-[20vh] left-1/2 z-50 w-[90vw] max-w-xl -translate-x-1/2 rounded-lg"
		transition:fly={{ y: -20, duration: 200 }}
	>
		<div class="bg-base-200 flex flex-col overflow-hidden rounded-lg shadow-2xl">
			<div class="flex items-center gap-3 border-b border-base-300 p-4">
				<Icon icon="mdi:magnify" class="text-base-content/70 h-5 w-5" />
				<input
					bind:this={inputElement}
					bind:value={inputValue}
					on:keydown={handleKeydown}
					type="text"
					placeholder="Search notes or type a command..."
					class="w-full bg-transparent text-lg focus:outline-none"
				/>
				<kbd class="kbd kbd-sm">esc</kbd>
			</div>

			<div class="max-h-[40vh] overflow-y-auto p-2">
				{#if commandResults.length > 0}
					<div class="px-2 pt-2 pb-1 text-xs font-semibold uppercase text-base-content/60">
						Commands
					</div>
					<ul>
						{#each commandResults as item, i (item.id)}
							{@const globalIndex = searchResults.length + i}
							<li
								class="flex cursor-pointer items-center gap-3 rounded-md p-3 {activeIndex === globalIndex
									? 'bg-primary text-primary-content'
									: 'hover:bg-base-300'}"
								on:click={() => {
									item.action();
									close();
								}}
							>
								<Icon icon={item.icon} class="h-5 w-5" />
								<span>{item.title}</span>
							</li>
						{/each}
					</ul>
				{/if}

				{#if searchResults.length > 0}
					<div class="px-2 pt-2 pb-1 text-xs font-semibold uppercase text-base-content/60">
						Notes
					</div>
					<ul>
						{#each searchResults as item, i (item.slug)}
							<li
								class="flex cursor-pointer items-center gap-3 rounded-md p-3 {activeIndex === i
									? 'bg-primary text-primary-content'
									: 'hover:bg-base-300'}"
								on:click={() => {
									document.getElementById(item.slug)?.focus();
									close();
								}}
							>
								<Icon icon="mdi:note-text-outline" class="h-5 w-5" />
								<span>{item.title}</span>
							</li>
						{/each}
					</ul>
				{/if}

				{#if combinedResults.length === 0}
					<div class="p-8 text-center text-base-content/70">No results found.</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
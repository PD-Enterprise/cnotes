
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { fly } from 'svelte/transition';
    import Icon from '@iconify/svelte';
    import { commandPaletteStore } from '$lib/stores/commandPaletteStore';
    import type { note } from '../routes/types';

    export let notes: note[] = [];

    let open = $state(false);
    let query = $state('');
    let filteredNotes = $state<note[]>([]);
    let selectedIndex = $state(0);
    let inputEl: HTMLInputElement;

    const unsubscribe = commandPaletteStore.subscribe(value => {
        open = value.isOpen;
    });

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectedIndex = (selectedIndex + 1) % filteredNotes.length;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectedIndex = (selectedIndex - 1 + filteredNotes.length) % filteredNotes.length;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (filteredNotes[selectedIndex]) {
                window.location.href = `/${filteredNotes[selectedIndex].slug}`;
                close();
            }
        }
    }

    function close() {
        commandPaletteStore.close();
    }

    $effect(() => {
        if (query) {
            filteredNotes = notes.filter(note =>
                note.title.toLowerCase().includes(query.toLowerCase())
            );
        } else {
            filteredNotes = [];
        }
        selectedIndex = 0;
    });

    onMount(() => {
        if (open) {
            inputEl?.focus();
        }
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if open}
    <div
        transition:fly={{ y: -20, duration: 300 }}
        class="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-start justify-center pt-20"
        on:click|self={close}>
        <div class="bg-base-100 rounded-lg shadow-xl w-1/2 max-w-2xl" role="dialog" aria-modal="true">
            <div class="p-4 border-b border-base-300">
                <div class="flex items-center">
                    <Icon icon="mdi:magnify" class="mr-3 text-base-content/60" />
                    <input
                        bind:this={inputEl}
                        type="text"
                        bind:value={query}
                        placeholder="Search notes..."
                        class="w-full bg-transparent focus:outline-none"
                        on:keydown={handleKeydown} />
                </div>
            </div>
            {#if filteredNotes.length > 0}
                <ul class="p-2 max-h-96 overflow-y-auto">
                    {#each filteredNotes as note, i}
                        <li>
                            <a
                                href={`/${note.slug}`}
                                class="block p-3 rounded-md hover:bg-base-200 {selectedIndex === i ? 'bg-base-200' : ''}"
                                on:mouseenter={() => (selectedIndex = i)}>
                                {note.title}
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
{/if}

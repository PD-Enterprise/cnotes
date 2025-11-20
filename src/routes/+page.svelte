
<script lang="ts">
    // Imports
    import { onDestroy, onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import type { note, searchResult } from './types';
    import Icon from '@iconify/svelte';
    import { notesStore } from '$lib/stores/store.svelte';
    import Note from './components/note.svelte';
    import { showToast } from '$lib/utils/svelteToastsUtil';
    import { commandPaletteStore } from '$lib/stores/commandPaletteStore';

    // Variables
    let errorMessage: string = $state('');
    let isDataInconsistent: boolean = $state(false);
    let loadingTimeout;
    let selectedGrade = $state('all');
    let selectedSubject = $state('all');
    let selectedSort = $state('title');
    let localNotes: note[] = [];
    let hasLocalNotes = false;
    let data = $props();

    // Functions
    async function getNotesFromLocalStorage() {
        let tempNotes: note[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('note:')) {
                hasLocalNotes = true;
                const encodedData = localStorage.getItem(key);
                let noteData: any;
                try {
                    const decodedString = atob(encodedData || '');
                    const uint8Array = new Uint8Array([...decodedString].map((c) => c.charCodeAt(0)));
                    noteData = JSON.parse(new TextDecoder().decode(uint8Array));
                } catch (e) {
                    try {
                        noteData = JSON.parse(encodedData || '{}');
                    } catch {
                        continue;
                    }
                }
                tempNotes.push(noteData);
            }
        }
        // Sort notes by date (latest first)
        localNotes = tempNotes.sort((a, b) => {
            const dateA = new Date(a.dateCreated || 0).getTime();
            const dateB = new Date(b.dateCreated || 0).getTime();
            return dateB - dateA;
        });
        if (hasLocalNotes) {
            notesStore.value = localNotes;
        }
    }
    async function getNotes() {
        const response = await fetch('/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();

        // Remove notes from localStorage that are not present in the server version
        if (result.data && Array.isArray(result.data)) {
            const serverSlugs = new Set(result.data.map((note) => note.slug));
            let changed = false;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('note:')) {
                    const slug = key.slice(5);
                    if (!serverSlugs.has(slug)) {
                        localStorage.removeItem(key);
                        changed = true;
                    }
                }
            }
            // Update notesStore to immediately reflect the change
            if (changed) {
                const updatedNotes = notesStore.value.filter((note) => serverSlugs.has(note.slug));
                notesStore.value = updatedNotes;
            }
        }

        if (result.status == 401) {
            errorMessage = 'You are not logged in. Please login to continue.';
            return;
        }

        if (result.data && result.data != undefined && result.data.length > 0) {
            const serverNotes: note[] = result.data.sort((a, b) => {
                const dateA = new Date(a.dateCreated || 0).getTime();
                const dateB = new Date(b.dateCreated || 0).getTime();
                return dateB - dateA;
            });
            notesStore.value = serverNotes;
            persistNotesInLocalStorage();
        }
    }
    async function persistNotesInLocalStorage() {
        for (const note of notesStore.value) {
            const encryptedNote = btoa(
                String.fromCharCode(...new TextEncoder().encode(JSON.stringify(note)))
            );
            localStorage.setItem(`note:${note.slug}`, encryptedNote);
        }
    }
    onMount(() => {
        if (data.data.session) {
            getNotesFromLocalStorage();
            getNotes();
        }
    });
    onDestroy(() => {
        clearTimeout(loadingTimeout);
    });
    function filter() {
        // This function can be repurposed or removed if filtering is fully handled by the palette
    }
    function getFilteredAndSortedNotes() {
        let filtered = notesStore.value;

        // Filter by grade
        if (selectedGrade && selectedGrade !== 'all' && selectedGrade !== '') {
            filtered = filtered.filter((note) => Number(note.academicLevel) === Number(selectedGrade));
        }
        // Filter by subject
        if (selectedSubject && selectedSubject !== 'all' && selectedSubject !== '') {
            filtered = filtered.filter((note) => note.topic === selectedSubject);
        }

        // Sort
        switch (selectedSort) {
            case 'academicLevel':
                filtered = filtered
                    .slice()
                    .sort((a, b) => (Number(a.academicLevel) ?? 0) - (Number(b.academicLevel) ?? 0));
                break;
            case 'topic':
                filtered = filtered.slice().sort((a, b) => (a.topic || '').localeCompare(b.topic || ''));
                break;
        }
        return filtered;
    }
</script>

<div class="main">
    <div class="header bg-base-200 flex gap-3 p-2">
        <button
            class="search-bar-btn bg-base-100 text-base-content/60 hover:bg-base-300 flex grow cursor-text items-center gap-2 rounded-md p-2.5 text-left"
            onclick={() => commandPaletteStore.open()}>
            <Icon icon="mdi:magnify" class="h-5 w-5" />
            <span>Search notes...</span>
            <div class="grow"></div>
            <kbd class="kbd kbd-sm">Ctrl</kbd>
            <kbd class="kbd kbd-sm">K</kbd>
        </button>
        {#if data.data.session}
            <div class="add-note">
                <a
                    class="addNoteButton btn border-base-content bg-accent text-accent-content border"
                    href="/new-note">Create <Icon icon="mage:edit" width="24" height="24" /></a>
            </div>
        {:else}
            <div class="add-note">
                <a
                    class="addNoteButton btn-disabled btn border-base-content bg-accent text-accent-content"
                    href="/new-note">Create <Icon icon="mage:edit" width="24" height="24" /></a>
            </div>
        {/if}
    </div>
    <div class="notes overflow-y-scroll p-3">
        {#if notesStore.value && notesStore.value.length > 0}
            <div class="notes-grid mb-17" in:fade={{ duration: 300, delay: 150 }}>
                {#each getFilteredAndSortedNotes() as note (note.slug)}
                    <div animate:flip={{ duration: 300 }}>
                        <Note {note} auth={data.data.session} />
                    </div>
                {:else}
                    <!-- This block is now part of the #each, so it shows when the array is empty -->
                    <div in:fade={{ duration: 200 }}>
                        <p class="loadingNotes">No notes match your filter.</p>
                    </div>
                {/each}
            </div>
        {:else if errorMessage}
            <p class="errorMessage">{errorMessage}</p>
        {:else}
            <p class="loadingNotes">No notes found.</p>
        {/if}
    </div>
</div>

<div class="search-button hidden"></div>

<style>
    .main {
        height: calc(100vh - 65px);
    }
    .notes {
        height: 100%;
    }
    .header {
        justify-content: space-between;
        align-items: center;
    }
    .search-bar-btn {
        transition:
            background-color 0.2s ease,
            box-shadow 0.2s ease;
    }
    .search-bar-btn:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .notes-grid {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
        width: 100%;
    }
    @media (max-width: 600px) {
        .search-input {
            width: 50%;
        }
        .notes-grid {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
        }
    }
    /* Add Note button styles moved to the left for cleaner layout */
    .addNoteButton {
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        transition:
            transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
            box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
    }
    .addNoteButton:hover {
        transform: translateY(-1px) scale(1.025);
    }
</style>

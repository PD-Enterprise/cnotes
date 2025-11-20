
<script lang="ts">
    import type { note } from '../types';
    import { fly } from 'svelte/transition';
    import { showToast } from '$lib/utils/svelteToastsUtil';
    import { notesStore } from '$lib/stores/store.svelte';
    import Icon from '@iconify/svelte';
    import { formatDate } from '$lib/utils/dateUtils';
    import { modalStore } from '$lib/stores/modalStore';

    let { note, auth } = $props();

    async function deleteNote() {
        const originalNotes = [...notesStore.value];

        // Optimistic UI update
        notesStore.value = notesStore.value.filter((n) => n.slug !== note.slug);

        try {
            const response = await fetch(`/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note })
            });

            if (!response.ok) {
                throw new Error('Failed to delete note on the server.');
            }

            localStorage.removeItem(`note:${note.slug}`);
            showToast('Success', `Note "${note.title}" deleted.`, 2500, 'success', {
                undo: () => {
                    notesStore.value = originalNotes;
                }
            });
        } catch (error) {
            console.error(error);
            // Revert UI change and show error
            notesStore.value = originalNotes;
            showToast(
                'Error',
                'Could not delete the note. Please try again.',
                3000,
                'error'
            );
        }
    }

    function openDeleteModal() {
        modalStore.open(
            'Delete Note',
            'Are you sure you want to delete this note?',
            deleteNote
        );
    }
</script>

<div
    role="button"
    tabindex="0"
    class="note card border-base-content flex gap-2.5 border shadow-2xl"
    out:fly={{ y: -20, duration: 250 }}
    id={note.slug}>
    <div class="card-body bg-base-300 flex flex-col rounded p-1">
        <div class="title-and-options flex flex-row justify-between gap-1">
            <a class="note-title card-title w-full p-1" href="{note.slug}/sharing">{note.title}</a>
            <div class="card-options">
                <div class="dropdown">
                    <div
                        tabindex="0"
                        role="button"
                        class="btn btn-circle hover:bg-base-100 focus:border-base-content hover:border-base-content m-1 hover:border focus:border"
                    >
                        <Icon icon="bi:three-dots-vertical" width="18" height="18" />
                    </div>
                    <ul
                        class="menu dropdown-content rounded-box bg-base-100 absolute top-8 right-8 flex flex-col gap-2 p-2 shadow-sm"
                    >
                        {#if auth}
                            <li>
                                <a class="btn btn-success" href={`/${note.slug}`}>
                                    Edit
                                    <Icon icon="mage:edit" width="20" height="20" />
                                </a>
                            </li>
                            <li>
                                <button class="btn btn-error" on:click={openDeleteModal}>
                                    Delete
                                    <Icon icon="mage:trash" width="20" height="20" />
                                </button>
                            </li>
                        {:else}
                            <li>
                                <button class="btn btn-success btn-disabled" disabled>Edit</button>
                            </li>
                            <li>
                                <button class="btn btn-error btn-disabled" disabled>Delete</button>
                            </li>
                        {/if}
                    </ul>
                </div>
            </div>
        </div>
        <div class="note-meta card-actions">
            <div class="badge badge-outline bg-base-200 border-base-content border p-2">
                {#if Number(note.academicLevel)}
                    {note.academicLevel}th grade
                {:else}
                    {note.academicLevel}
                {/if}
            </div>
            <div class="badge badge-outline bg-base-200 border-base-content p-2">{note.topic}</div>
            <div class="badge badge-outline bg-base-200 border-base-content p-2">
                {note.visibility[0].toUpperCase() + note.visibility.slice(1)}
            </div>
            <div class="badge badge-outline bg-base-200 border-base-content p-2">
                {formatDate(note.dateCreated)}
            </div>
            {#if note.type === 'diagram'}
                <div class="badge badge-outline border-base-content bg-base-300 p-2">Diagram</div>
            {/if}
        </div>
    </div>
</div>

<style>
    .note {
        --note-width: 16em;
        --note-height: 11em;
        width: var(--note-width);
        height: var(--note-height);
        flex-direction: column;
        overflow-y: hidden;
        cursor: pointer;
        transition: transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
    }
    .note:hover,
    .note:focus {
        transform: translateY(-1px) scale(1.025);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13), 0 1.5px 4px rgba(0, 0, 0, 0.08);
    }
    .note:focus {
        border: 2px solid #4a90e2;
    }
    @media (max-width: 600px) {
        .note {
            width: 100%;
        }
        .note-meta {
            justify-content: flex-end;
        }
    }
</style>

<script lang="ts">
	// Imports
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import config from '$lib/utils/apiConfig';
	import { isAuthenticated } from '$lib/stores/store.svelte';
	import DOMPurify from 'dompurify';
	import Tiptap from './tiptap.svelte';

	// Variables
	let newNote: note = {
		title: '',
		slug: '',
		notescontent: '',
		board: '',
		dateCreated: '',
		email: '',
		grade: undefined,
		subject: ''
	};
	let isValid: boolean = $state(false);

	// Functions
	async function addNote() {
		if (!$isAuthenticated) {
			showToast('Error', 'You must be logged in to save notes.', 3000, 'error');
			return;
		}
		if (!validateNote(newNote)) {
			console.error('Note is not in correct form to be added to database.');
			showToast(
				'Data type error.',
				'The note is not in correct form. Please recheck your data.',
				3000,
				'error'
			);
		} else {
			try {
				const rawHtml = editor.getHTML();
				newNote.notescontent = DOMPurify.sanitize(rawHtml);
				newNote.slug = newNote.title.replaceAll(' ', '-').toLowerCase();

				if (user.value) {
					// @ts-expect-error
					newNote.email = user.value.email;
				} else {
					newNote.email = null;
				}

				// console.log(newNote);
				const encryptedNote = btoa(JSON.stringify(newNote));
				// console.log(encryptedNote);
				const storableNote: { key: string; value: string } = {
					key: `note:${newNote.slug}`,
					value: encryptedNote
				};

				if (localStorage.getItem(`note:${newNote.slug}`)) {
					console.error('Another note with that name already exists.');
					showToast(
						'Title name Conflict',
						'Another note with that name already exists, please choose another name',
						3000,
						'error'
					);
				} else {
					localStorage.setItem(storableNote.key, storableNote.value);
					await addToDB(newNote);
					showToast('Successfully added note', 'Note added successfully', 1000, 'success');
					window.location.href = '/home';
				}
			} catch (error) {
				console.error('There was an error:', error);
			}
		}
	}
	async function addToDB(note: note) {
		console.log(note);
		const request = await fetch(`${config.apiUrl}notes/new-note/text`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: JSON.parse(atob(localStorage.getItem('user'))).email,
				note: note
			})
		});
		const result = await request.json();
		console.log(result);
	}
</script>

<dialog id="meta_data_modal" class="modal">
	<div class="modal-box flex w-96 flex-col">
		<div class="absolute right-2">
			<form method="dialog" onsubmit={(e) => e.preventDefault()}>
				<button
					class="btn btn-circle btn-ghost btn-sm top-2"
					onclick={(e) => {
						e.preventDefault();
						isValid = validateNote(newNote);
						if (isValid) {
							const meta_data_modal = document.getElementById(
								'meta_data_modal'
							) as HTMLDialogElement;
							meta_data_modal.close();
						} else {
							showToast(
								'Data type error.',
								'The note is not in correct form. Please recheck your data.',
								3000,
								'error'
							);
						}
						// console.log(newNote);
					}}>✕</button
				>
			</form>
		</div>
		<div class="flex flex-col gap-2">
			<h3>Enter Metadata for your Note Here:</h3>
			<div class="new-note-data flex flex-row flex-wrap gap-3">
				{#each Object.keys(newNote) as newNoteKey}
					{#if ['title', 'board', 'dateCreated', 'grade', 'subject'].includes(newNoteKey)}
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text">{newNoteKey}:</span>
							</div>
							{#if newNoteKey == 'dateCreated'}
								<input
									type="date"
									class="input input-bordered w-full max-w-xs"
									bind:value={newNote[newNoteKey]}
									required
									placeholder="Date Created"
								/>
							{:else}
								<input
									type="text"
									class="input input-bordered w-full max-w-xs"
									required
									bind:value={newNote[newNoteKey]}
									placeholder={newNoteKey}
								/>
							{/if}
						</label>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</dialog>
<div class="main-component">
	<div class="content flex h-full flex-col gap-3 p-2">
		<div class="header flex flex-col gap-3 p-2">
			<div class="header-box flex flex-col items-center justify-center">
				<div class="mb-1 flex items-center gap-3">
					<svg width="36" height="36" viewBox="0 0 24 24" fill="none" class="text-blue-600">
						<rect x="2" y="4" width="20" height="16" rx="3" fill="#3B82F6" />
						<rect x="5" y="7" width="14" height="10" rx="2" fill="#fff" />
						<path d="M8 10h8M8 13h5" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" />
					</svg>
					<h2 class="component-title mb-0 text-4xl font-extrabold drop-shadow">Add a Text Note</h2>
				</div>
			</div>
			<div class="buttons flex flex-row gap-2">
				<div class="metadata-btn w-40">
					<button
						class="btn h-12 border border-base-content"
						onclick={() => {
							const meta_data_modal = document.getElementById(
								'meta_data_modal'
							) as HTMLDialogElement;
							meta_data_modal.showModal();
						}}>Edit Metadata</button
					>
				</div>
				<div class="save-button-container w-40">
					{#if !isValid}
						<button
							class="btn btn-disabled btn-outline btn-accent h-12 border border-base-content"
							onclick={addNote}>Add Note</button
						>
					{:else}
						<button
							class="btn btn-outline btn-accent h-12 border border-base-content"
							onclick={addNote}>Add Note</button
						>
					{/if}
				</div>
			</div>
		</div>
		<div class="editor h-full">
			<Tiptap></Tiptap>
		</div>
	</div>
</div>

<style>
	.main-component {
		animation: fadeInDown 0.5s ease-in-out;
		height: calc(100vh - 130px);
	}
	.header-box {
		text-align: center;
		animation: fadeInDown 0.5s ease-in-out;
	}
	.header-box h2 {
		font-weight: bold;
		animation: fadeInDown 0.5s ease-in-out;
	}
	/* Form container */
	.new-note-data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
		/* Space between fields */
		animation: fadeInDown 0.5s ease-in-out;
	}
	@media (max-width: 600px) {
		.component-title {
			font-size: 1.5rem;
		}
	}

	/* Label styling */
	.form-control {
		width: 100%;
		/* Full width for inputs */
		display: flex;
		flex-direction: column;
	}

	.form-control .label-text {
		font-weight: 600;
		margin-bottom: 5px;
		transition: color 0.3s ease-in-out;
	}

	/* Input styling */
	.form-control input {
		padding: 10px;
		border: 2px solid #333333;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.3s ease-in-out;
	}

	.form-control input:focus {
		outline: none;
		box-shadow: 0 0 8px rgba(107, 136, 190, 0.4);
	}

	/* Button styling */
	.btn {
		padding: 10px 20px;
		font-size: 1rem;
		font-weight: 600;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.btn:active {
		transform: translateY(0);
		box-shadow: none;
	}

	/* Animations */
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-50px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

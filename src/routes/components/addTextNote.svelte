<script lang="ts">
	// Imports
	import { Tipex, type TipexEditor } from '@friendofsvelte/tipex';
	import '@friendofsvelte/tipex/styles/Tipex.css';
	import '@friendofsvelte/tipex/styles/ProseMirror.css';
	import '@friendofsvelte/tipex/styles/Controls.css';
	import '@friendofsvelte/tipex/styles/EditLink.css';
	import '@friendofsvelte/tipex/styles/CodeBlock.css';
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { user } from '$lib/stores/store.svelte';
	import config from '$lib/utils/apiConfig';

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
	let editor: TipexEditor = $state();

	// Functions
	// $effect(() => {
	// 	console.log(editor.getHTML());
	// });
	// Functions
	async function addNote() {
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
				newNote.notescontent = editor.getHTML();
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
					showToast('Successfully added note', 'Note added successfully', 3000, 'success');
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
	// const testNote = {
	// 	title: 'Test Note',
	// 	slug: 'test-note',
	// 	notescontent: 'This is a test note',
	// 	board: 'Test Board',
	// 	dateCreated: '2021-01-01',
	// 	email: 'test@test.com',
	// 	grade: 9,
	// 	subject: 'Test Subject'
	// };
	// addToDB(testNote);
</script>

<div class="main p-1">
	<dialog id="meta_data_modal" class="modal">
		<div class="modal-box flex w-96 flex-col">
			<div class="absolute right-2">
				<form method="dialog" onsubmit={(e) => e.preventDefault()}>
					<button
						class="btn btn-ghost btn-sm btn-circle top-2"
						onclick={(e) => {
							e.preventDefault();
							if (validateNote(newNote)) {
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
							console.log(newNote);
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
										class="input-bordered input w-full max-w-xs"
										bind:value={newNote[newNoteKey]}
										required
										placeholder="Date Created"
										onchange={() => {
											// console.log(newNote[newNoteKey]);
										}}
									/>
								{:else}
									<input
										type="text"
										class="input-bordered input w-full max-w-xs"
										required
										bind:value={newNote[newNoteKey]}
										placeholder={newNoteKey}
										oninput={() => {
											// console.log(newNote[newNoteKey]);
										}}
									/>
								{/if}
							</label>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</dialog>
	<div class="header-box">
		<h2 class="mb-6 text-3xl">Add a Text Note</h2>
	</div>
	<form class="flex flex-col gap-4">
		<div class="metadata-btn w-40">
			<button
				class="btn h-12"
				onclick={() => {
					const meta_data_modal = document.getElementById('meta_data_modal') as HTMLDialogElement;
					meta_data_modal.showModal();
				}}>Edit Metadata</button
			>
		</div>
		<div class="editor dark">
			<Tipex
				body=""
				controls
				floating
				focal
				oncreate={() => {
					console.log('editor created');
				}}
				onupdate={() => {
					// console.log(editor.getHTML());
				}}
				bind:tipex={editor}
				class="p-2"
				style="height: calc(100vh - 200px)"
			/>
		</div>
		<button class="btn btn-accent btn-outline h-14" onclick={addNote}>Add Note</button>
	</form>
</div>

<style>
	.main {
		padding: 20px;
		animation: fadeInDown 0.8s ease-in-out;
	}
	.header-box {
		text-align: center;
		animation: fadeInDown 0.6s ease-in-out;
	}
	.header-box h2 {
		font-size: 2.5rem;
		font-weight: bold;
		animation: fadeInDown 0.8s ease-in-out;
	}
	/* Form container */
	.new-note-data {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 20px;
		/* Space between fields */
		animation: fadeInDown 1s ease-in-out;
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

	/* Ensure responsiveness for both desktop and mobile */
	@media (max-width: 768px) {
		.main {
			padding: 10px;
		}

		.new-note-data {
			gap: 15px;
		}

		.header-box h2 {
			font-size: 2rem;
		}

		.btn {
			width: 100%;
			/* Full-width button on smaller screens */
		}
	}
</style>

<script lang="ts">
	import Icon from '@iconify/svelte';

	// import { onMount } from 'svelte';
	import AddTextNote from '../components/addTextNote.svelte';
	import Diagram from '../components/diagram.svelte';
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { toTitleCase } from '$lib/utils/toTitleCase';
	import { onMount } from 'svelte';

	// Variables
	let option = $state('text');
	let newNote: note = $state({
		title: '',
		content: '',
		dateCreated: '',
		academicLevel: '',
		topic: '',
		type: 'text',
		visibility: 'private',
		year: '',
		language: '',
		keywords: ''
	});
	let isValid: boolean = $state(false);
	let isK_12: string = $state('true');
</script>

<dialog id="meta_data_modal" class="modal">
	<div class="modal-box flex flex-col">
		<div class="absolute right-2">
			<form method="dialog" onsubmit={(e) => e.preventDefault()}>
				<button
					class="btn btn-ghost btn-sm btn-circle top-2"
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
		<div class="flex flex-col gap-4">
			<h2 class="text-2xl">Enter Metadata for your Note Here:</h2>
			<div class="new-note-data flex flex-row flex-wrap gap-3">
				{#each Object.keys(newNote) as newNoteKey}
					{#if ['title', 'dateCreated', 'academicLevel', 'topic', 'visibility', 'language', 'keywords'].includes(newNoteKey)}
						<label class="form-control">
							<div class="label">
								<span class="label-text">{toTitleCase(newNoteKey)}:</span>
							</div>
							{#if newNoteKey == 'dateCreated'}
								<input
									type="date"
									class="input-bordered input metadata-input-field w-full max-w-xs"
									bind:value={newNote[newNoteKey]}
									required
									placeholder="Date Created"
								/>
							{:else if newNoteKey == 'academicLevel'}
								<div class="academicLevel flex gap-5">
									<select
										class="select select-bordered metadata-input-field"
										bind:value={isK_12}
										required
									>
										<option value="true">K-12</option>
										<option value="false">Not K-12</option>
									</select>
									{#if isK_12 == 'true'}
										<input
											type="text"
											class="input-bordered input metadata-input-field"
											required
											bind:value={newNote[newNoteKey]}
											placeholder={toTitleCase(newNoteKey)}
										/>
									{:else}
										<select
											class="select select-bordered metadata-input-field"
											bind:value={newNote[newNoteKey]}
											required
										>
											<option value="UG">Undergraduate (UG)</option>
											<option value="G">Graduate (G)</option>
											<option value="PG">Postgraduate (PG)</option>
										</select>
									{/if}
								</div>
							{:else if newNoteKey == 'visibility'}
								<select
									class="select select-bordered metadata-input-field"
									bind:value={newNote[newNoteKey]}
									required
								>
									<option value="private">Private</option>
									<option value="public">Public</option>
								</select>
							{:else}
								<input
									type="text"
									class="input-bordered input metadata-input-field"
									required
									bind:value={newNote[newNoteKey]}
									placeholder={toTitleCase(newNoteKey)}
								/>
							{/if}
						</label>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</dialog>

<div class="main">
	<div class="dropdown p-2">
		<select
			bind:value={option}
			class="menu bg-base-200 border-base-content z-[1] m-1 w-52 rounded border p-2 shadow-xl"
		>
			<option value="text">Text</option>
			<option value="diagram">Diagram</option>
		</select>
	</div>
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-xs btn-circle text-info">
			<Icon icon="material-symbols:info" width="24" height="24" />
		</div>
		<div class="compact dropdown-content card rounded-box bg-base-100 z-[1] w-64 shadow">
			<div class="card-body">
				<h2 class="card-title">component state is not held!!</h2>
				<p>Save your work before switching</p>
			</div>
		</div>
	</div>
	<div class="header flex flex-col pl-3">
		<div class="buttons flex flex-row gap-3">
			<div class="metadata-btn">
				<button
					class="btn border-base-content h-12 border"
					onclick={() => {
						const meta_data_modal = document.getElementById('meta_data_modal') as HTMLDialogElement;
						meta_data_modal.showModal();
					}}>Metadata</button
				>
			</div>
		</div>
	</div>
	{#if option === 'text'}
		<div class="text">
			<AddTextNote {newNote} />
		</div>
	{:else if option === 'diagram'}
		<div class="diagram mt-1 p-2">
			<Diagram {newNote} />
		</div>
	{/if}
</div>

<style>
	.main {
		height: calc(100vh - 65px);
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
	.metadata-input-field {
		width: 200px;
	}
	/* Label styling */
	.form-control {
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
</style>

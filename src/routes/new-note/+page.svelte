<script lang="ts">
	import Icon from '@iconify/svelte';

	// import { onMount } from 'svelte';
	import AddTextNote from '../components/addTextNote.svelte';
	import Diagram from '../components/diagram.svelte';
	import type { note } from '../types';
	import { validateNote } from '$lib/utils/validateNote';
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
		type: '',
		visibility: 'private',
		year: '',
		language: '',
		keywords: ''
	});
	let isK_12: string = $state('true');
</script>

<div class="main">
	<div class="drawer lg:drawer-open">
		<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col gap-2">
			<div class="flex flex-row gap-2">
				<div class="sidebar-toggle hidden p-1">
					<label for="my-drawer-4" aria-label="open sidebar" class="btn btn-ghost">
						<Icon icon="meteor-icons:sidebar" width="22" height="22" />
					</label>
				</div>

				<div class="type-selector p-2">
					<div class="dropdown">
						<select
							bind:value={option}
							class="menu bg-base-200 border-base-content z-1 w-52 rounded border p-2 shadow-xl"
						>
							<option value="text">Text</option>
							<option value="diagram">Diagram</option>
						</select>
					</div>
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn btn-ghost info-text">
							<Icon icon="material-symbols:info" width="22" height="22" />
						</div>
						<div class="compact dropdown-content card rounded-box bg-base-100 z-1 w-64 shadow">
							<div class="card-body">
								<h2 class="card-title">component state is not held!!</h2>
								<p>Save your work before switching</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="editors">
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
		</div>
		<div class="drawer-side is-drawer-close:overflow-visible">
			<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
			<div
				class="bg-base-200 is-drawer-close:w-82 is-drawer-open:w-82 flex min-h-full w-82 flex-col items-start"
			>
				<div class="flex flex-col gap-4 p-2">
					<div class="top-bar flex flex-row gap-2">
						<h2 class="font-bold">Enter Metadata for your Note Here:</h2>
					</div>
					<div class="new-note-data flex w-72 flex-row flex-wrap gap-3">
						{#each Object.keys(newNote) as newNoteKey}
							{#if ['title', 'dateCreated', 'academicLevel', 'topic', 'visibility', 'language', 'keywords'].includes(newNoteKey)}
								<label class="form-control">
									<div class="label">
										<span class="label-text">{toTitleCase(newNoteKey)}:</span>
									</div>
									{#if newNoteKey == 'dateCreated'}
										<input
											type="date"
											class="input-bordered input metadata-input-field"
											bind:value={newNote[newNoteKey]}
											required
											placeholder="Date Created"
										/>
									{:else if newNoteKey == 'academicLevel'}
										<div class="academicLevel flex flex-wrap gap-5">
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
		</div>
	</div>
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	/* Form container */
	.new-note-data {
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
		width: 300px;
	}
	.form-control select {
		width: 300px;
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
	@media (max-width: 1023px) {
		.sidebar-toggle {
			display: block;
		}
		.type-selector {
			padding: 0.25rem;
		}
		.drawer-side {
			height: calc(100vh - 64px);
			margin-top: 64px;
		}
	}
</style>

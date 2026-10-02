<script lang="ts">
	import IconSidebar from '~icons/material-symbols/left-panel-open';

	import { onMount } from 'svelte';
	import AddTextNote from '../components/addTextNote.svelte';
	import Diagram from '../components/diagram.svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';
	import { newNoteData, sidebarOpen } from '$lib/stores/store.svelte';
	// Variables
	let option = $state('text');
	let addNote = $state<() => Promise<void>>(async () => {});
	let isK_12: string = $state('true');
	let isDrawerOpen = $state(true);

	function closeDrawer() {
		isDrawerOpen = false;
		sidebarOpen.value = false;
		const drawer = document.getElementById('my-drawer-4') as HTMLInputElement;
		drawer.checked = false;
	}

	onMount(() => {
		const drawer = document.getElementById('my-drawer-4') as HTMLInputElement;
		drawer.checked = true;
		drawer.addEventListener('change', () => {
			isDrawerOpen = drawer.checked;
			sidebarOpen.value = drawer.checked;
		});
	});
</script>

<div class="main">
	<div class="note flex h-full flex-col gap-2 rounded-md">
		<div class="drawer drawer-end lg:drawer-open h-full" class:drawer-closed={!sidebarOpen.value}>
			<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content flex h-full flex-col">
				<div class="editors flex min-h-0 flex-1 overflow-y-auto">
					{#if option === 'text'}
						<div class="text w-full">
							<AddTextNote bind:addNote />
						</div>
					{:else if option === 'diagram'}
						<div class="diagram w-full">
							<Diagram bind:addNote />
						</div>
					{/if}
				</div>
			</div>
			<div class="drawer-side is-drawer-close:overflow-visible">
				<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
				<div
					class="bg-base-200 is-drawer-close:w-82 is-drawer-open:w-82 flex h-full w-82 flex-col"
				>
					<div class="flex items-center gap-2 p-2">
						<button
							class="btn btn-ghost btn-sm"
							aria-label="close sidebar"
							onclick={closeDrawer}
						>
							<IconSidebar width="22" height="22" />
						</button>
						<div class="save-button flex flex-1 gap-2">
							<button
								class="btn btn-accent btn-outline flex-1 shadow-xl"
								onclick={() => addNote()}
							>
								Add Note
							</button>
						</div>
					</div>
					<div class="flex min-h-0 flex-1 flex-col p-2">
						<div class="flex flex-col gap-4">
							<div class="type-selector">
								<label class="form-control">
									<div class="label">
										<span class="label-text">Note Type:</span>
									</div>
									<select
										bind:value={option}
										onchange={() => {
											newNoteData.value.content = '';
										}}
										class="select select-bordered w-full min-w-0 grow"
									>
										<option value="text">Text</option>
										<option value="diagram">Diagram</option>
									</select>
								</label>
							</div>
							<div class="top-bar flex flex-row gap-2">
								<h2 class="font-bold">Enter Metadata for your Note Here:</h2>
							</div>
							<div class="metadata h-[calc(100vh-200px)] overflow-y-auto">
								<div class="new-note-data flex w-72 flex-row flex-wrap gap-3">
									{#each Object.keys(newNoteData.value) as newNoteKey}
										{#if ['title', 'dateCreated', 'academicLevel', 'topic', 'visibility', 'language', 'keywords'].includes(newNoteKey)}
											<label class="form-control">
												<div class="label">
													<span class="label-text">{toTitleCase(newNoteKey)}:</span>
												</div>
												{#if newNoteKey == 'dateCreated'}
													<input
														type="date"
														class="input-bordered input metadata-input-field"
														bind:value={newNoteData.value[newNoteKey]}
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
																bind:value={newNoteData.value[newNoteKey]}
																placeholder={toTitleCase(newNoteKey)}
															/>
														{:else}
															<select
																class="select select-bordered metadata-input-field"
																bind:value={newNoteData.value[newNoteKey]}
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
														bind:value={newNoteData.value[newNoteKey]}
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
														bind:value={newNoteData.value[newNoteKey]}
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
		</div>
	</div>
</div>

<style>
	.main {
		height: calc(100vh - 65px);
	}
	@media (max-width: 1023px) {
		.drawer-side {
			height: calc(100vh - 64px);
			margin-top: 64px;
		}
	}
	.note {
		padding: 5px;
	}
	.drawer-closed .drawer-side {
		display: none;
	}
	.editors {
		flex: 1;
		overflow-y: auto;
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
	.type-selector select {
		width: 100%;
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

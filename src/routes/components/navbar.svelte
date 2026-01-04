<script lang="ts">
	// Imports
	import { theme } from '$lib/stores/store.svelte';
	import { onMount } from 'svelte';
	import SvelteToast from './svelteToast.svelte';
	import type { PageData } from '../$types';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';
	import UserComponent from './user-component.svelte';
	import {
		notesStore,
		searchQuery,
		searchResults,
		selectedAcademicLevel,
		selectedTopic
	} from '$lib/stores/store.svelte';

	let { data }: { data: PageData } = $props();
	let isHome = $state(true);
	let title = $state('Home');
	let shouldShowSearchResults: boolean = $state(false);
	let shouldShowFilterMenu: boolean = $state(false);

	onMount(() => {
		const localTheme = localStorage.getItem('theme');
		if (localTheme === 'light') {
			theme.value = true;
		} else {
			theme.value = false;
		}
		$effect(() => {
			// console.log(theme.value)
			if (theme.value == true) {
				document.documentElement.setAttribute('data-theme', 'light');
				localStorage.setItem('theme', 'light');
			} else {
				localStorage.setItem('theme', 'dark');
				document.documentElement.setAttribute('data-theme', 'dark');
			}

			// console.log($page.url.pathname);
			if ($page.url.pathname == '/') {
				isHome = true;
				title = 'Home';
			} else {
				isHome = false;
				// console.log($page.url.pathname);
				if (
					$page.url.pathname.split('/')[1] == 'new-note' ||
					$page.url.pathname.split('/')[1] == 'login' ||
					$page.url.pathname.split('/')[1] == 'logout'
				) {
					title = $page.url.pathname.split('/')[1].replaceAll('-', ' ');
				} else {
					title = $page.url.pathname.split('/')[1].replaceAll('-', ' ').slice(0, -6);
				}
			}
		});

		document.addEventListener('click', (event) => {
			const searchBar = document.querySelector('.search-bar');
			if (searchBar && !searchBar.contains(event.target as Node)) {
				shouldShowSearchResults = false;
			}

			const filterDropdown = document.querySelector('.filter-dropdown');
			if (shouldShowFilterMenu && filterDropdown && !filterDropdown.contains(event.target as Node)) {
				shouldShowFilterMenu = false;
			}
		});
	});
	function search() {
		if (searchQuery.value.length > 0 && notesStore.value) {
			shouldShowSearchResults = true;
			setTimeout(() => {
				const matches = notesStore.value
					.filter((note) => note.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
					.map((note) => ({
						title: note.title,
						slug: note.slug
					}));
				searchResults.value = matches;
				// console.log(searchResults);
			}, 500);
		} else {
			shouldShowSearchResults = false;
			searchResults.value = [];
		}
	}
	$effect(() => {
		search();
	});
</script>

<SvelteToast />

<div class="navbar bg-base-200 z-1 shadow-sm">
	<div class="navbar-start">
		{#if isHome}
			<div class="dropdown">
				<button
					class="btn btn-ghost"
					onclick={() => {
						const menuElement = document.getElementById('menu') as HTMLDivElement;
						menuElement.classList.toggle('hidden');
					}}
				>
					<Icon icon="tabler:align-left" width="24" height="24" />
				</button>
				<ul
					class="menu dropdown-content menu-sm rounded-box bg-base-100 z-1 mt-3 hidden gap-2 p-2 shadow-md"
					id="menu"
				>
					<li>
						<UserComponent {data} />
					</li>
					<li>
						<label class="flex cursor-pointer gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="5" />
								<path
									d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
								/>
							</svg>
							<input
								type="checkbox"
								value="light"
								class="theme-controller toggle"
								bind:checked={theme.value}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
							</svg>
						</label>
					</li>
					<div class="menu-buttons menu-login-buttons w-full" id="menu-login-buttons">
						{#if data.session}
							<a href="/logout" class="btn btn-error w-full">Logout</a>
						{:else}
							<a href="/login" class="btn btn-accent w-full">Login</a>
						{/if}
					</div>
				</ul>
			</div>
		{:else}
			<button
				onclick={() => {
					history.back();
				}}
				class="btn btn-ghost btn-circle"
			>
				<Icon icon="ep:back" class="h-5 w-5" />
			</button>
		{/if}

		<a class="btn btn-ghost text-2xl" href="/">{toTitleCase(title)}</a>
	</div>
	<div class="navbar-end">
		{#if isHome}
			<div class="header bg-base-200 flex grow gap-3 p-2">
				<div class="search-bar bg-base-100 grow rounded-md p-1">
					<div class="flex items-center gap-2 rounded-md p-1">
						<input
							type="text"
							class="search-input grow focus:border-none focus:outline-none"
							placeholder="Search for a note"
							bind:value={searchQuery.value}
							onkeydown={(e) => {
								if (e.key === 'Enter' && searchResults.value && searchResults.value.length === 1) {
									// Automatically select the only result
									const onlyResult = searchResults[0];
									if (onlyResult && onlyResult.slug) {
										document.getElementById(onlyResult.slug).focus();
									}
								}
							}}
						/>
						<div class="filter-dropdown">
							<button
								title="Filter Notes"
								class="filter-notes btn btn-circle border-base-content bg-base-100 hover:bg-base-300 border"
								onclick={() => {
									shouldShowFilterMenu = !shouldShowFilterMenu;
								}}
							>
								<Icon icon="fa6-solid:filter" />
							</button>
							{#if shouldShowFilterMenu}
								<div
									class="filter-menu dropdown-content menu search-results bg-base-100 absolute right-0 mt-2 flex flex-row gap-2 rounded-md p-3 shadow"
								>
									<fieldset
										class="filter-section fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4"
									>
										<legend class="fieldset-legend">Academic Level:</legend>
										{#each Array.from(new Set(notesStore.value.map((note) => note.academicLevel))) as grade, i}
											<label class="hover:bg-base-300 flex items-center gap-2 rounded p-1">
												<input
													type="radio"
													name="grade-filter"
													value={grade}
													class="radio radio-sm"
													bind:group={selectedAcademicLevel.value}
												/>
												<span class="text-base">{grade}</span>
											</label>
										{/each}
										<label class="hover:bg-base-300 flex items-center gap-2 rounded p-1">
											<input
												type="radio"
												name="grade-filter"
												value="all"
												class="radio radio-sm"
												checked
												bind:group={selectedAcademicLevel.value}
											/>
											<span class="text-base">All Academic Levels</span>
										</label>
									</fieldset>

									<fieldset
										class="filter-section fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4"
									>
										<legend class="fieldset-legend">Topics:</legend>
										{#each Array.from(new Set(notesStore.value.map((note) => note.topic))) as subject, i}
											<label class="hover:bg-base-300 flex items-center gap-2 rounded p-1">
												<input
													type="radio"
													name="subject-filter"
													value={subject}
													class="radio radio-sm"
													bind:group={selectedTopic.value}
												/>
												<span class="text-base">{subject}</span>
											</label>
										{/each}
										<label class="hover:bg-base-300 flex items-center gap-2 rounded p-1">
											<input
												type="radio"
												name="subject-filter"
												value="all"
												class="radio radio-sm"
												checked
												bind:group={selectedTopic.value}
											/>
											<span class="text-base">All Topics</span>
										</label>
									</fieldset>
								</div>
							{/if}
						</div>
					</div>
					{#if shouldShowSearchResults}
						<div class="search-results bg-base-100 absolute flex flex-col gap-2 rounded-md p-2">
							{#if searchResults.value.length > 0}
								{#each searchResults.value as searchResult}
									<a
										href={`#${searchResult.slug}`}
										tabindex="0"
										onclick={() => {
											event.preventDefault();
											document.getElementById(searchResult.slug).focus();
										}}
									>
										<p class="text-lg font-bold">
											{searchResult.title}
										</p>
									</a>
									{#if searchResults.value.length > 1}
										<hr />
									{/if}
								{/each}
							{:else}
								<p>No notes found.</p>
							{/if}
						</div>
					{/if}
				</div>
				{#if data.session}
					<div class="add-note">
						<a
							class="addNoteButton btn border-base-content bg-accent text-accent-content border"
							href="/new-note">Create <Icon icon="mage:edit" width="24" height="24" /></a
						>
					</div>
				{:else}
					<div class="add-note">
						<a
							class="addNoteButton btn-disabled btn border-base-content bg-accent text-accent-content"
							href="/new-note">Create <Icon icon="mage:edit" width="24" height="24" /></a
						>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.navbar {
		cursor: default;
		position: fixed;
	}
	.header {
		justify-content: space-between;
		align-items: center;
	}
	.search-bar {
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-bar:hover {
		box-shadow: 0 6px 15px rgba(77, 96, 116, 0.5);
	}
	.search-input {
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
		min-width: 100px;
		max-width: 100%;
	}
	.filter-notes {
		border-radius: 6px;
		cursor: pointer;
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.filter-notes:hover {
		transform: scale(1.05);
	}
	.search-results {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.18s cubic-bezier(0.4, 0.2, 0.2, 1),
			box-shadow 0.18s cubic-bezier(0.4, 0.2, 0.2, 1);
	}
	.search-results a:hover {
		transform: scale(1.015);
	}
	@media (max-width: 600px) {
		.search-input {
			width: 50%;
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
	.header {
		justify-content: space-between;
		align-items: center;
	}
</style>

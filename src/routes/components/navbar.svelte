<script lang="ts">
	// Imports
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { toTitleCase } from '$lib/utils/toTitleCase';

	let { data }: { data: PageData } = $props();

	// State
	let isHome = $state(true);
	let title = $state('Home');
	let currentTheme = $state('dark');

	const themes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];

	// Update title and home status based on URL
	$effect(() => {
		const path = $page.url.pathname;
		isHome = path === '/';
		if (isHome) {
			title = 'Home';
		} else {
			const pathSegment = path.split('/')[1];
			if (['new-note', 'login', 'logout'].includes(pathSegment)) {
				title = pathSegment.replaceAll('-', ' ');
			} else if (pathSegment) {
				// Handle dynamic routes like [noteslug]
				title = 'Note';
			}
		}
	});

	// Function to change the theme
	function changeTheme(theme: string) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('cnotes-theme', theme);
		currentTheme = theme;
	}

	// Set initial theme on mount
	onMount(() => {
		const savedTheme = localStorage.getItem('cnotes-theme') || 'dark';
		currentTheme = savedTheme;
	});
</script>

<div class="navbar bg-base-100/80 backdrop-blur-sm fixed z-10">
	<!-- Navbar Start (Back button and Title) -->
	<div class="navbar-start">
		{#if !isHome}
			<button onclick={() => history.back()} class="btn btn-ghost btn-circle">
				<Icon icon="ep:back" class="h-5 w-5" />
			</button>
		{/if}
		<a class="btn btn-ghost text-xl" href="/">{toTitleCase(title)}</a>
	</div>

	<!-- Navbar End (Actions) -->
	<div class="navbar-end flex items-center gap-2">
		<!-- New Note Button -->
		{#if data.session}
			<a href="/new-note" class="btn btn-ghost btn-circle">
				<Icon icon="mdi:plus" class="h-6 w-6" />
			</a>
		{/if}

		<!-- Theme Switcher -->
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
				<Icon icon="mdi:palette-swatch" class="h-6 w-6" />
			</div>
			<ul
				tabindex="0"
				class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 h-64 overflow-y-auto"
			>
				{#each themes as theme}
					<li>
						<button
							class:btn-active={currentTheme === theme}
							on:click={() => changeTheme(theme)}>{toTitleCase(theme)}</button
						>
					</li>
				{/each}
			</ul>
		</div>

		<!-- User Menu -->
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
				<Icon icon="mdi:dots-vertical" class="h-6 w-6" />
			</div>
			<ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
				{#if data.session}
					<li class="menu-title">
						<span>Signed in as {data.session.user?.name}</span>
					</li>
					<li>
						<form action="/logout" method="POST">
							<button type="submit" class="w-full text-left">
								<Icon icon="mdi:logout" class="h-5 w-5 mr-2" />
								Logout
							</button>
						</form>
					</li>
				{:else}
					<li>
						<a href="/login" class="w-full">
							<Icon icon="mdi:login" class="h-5 w-5 mr-2" />
							Login
						</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</div>

<style>
	.navbar {
		cursor: default;
	}
</style>

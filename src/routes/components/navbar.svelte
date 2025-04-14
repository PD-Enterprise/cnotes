<script lang="ts">
	// Imports
	import icon from '../images/icon.png';
	import { autoLogin } from '$lib/stores/store';
	import { onMount } from 'svelte';
	import { showModal } from '$lib/stores/store';
	import { isAuthenticated, auth0Client } from '$lib/stores/store';
	import AutoLogin from './autoLogin.svelte';
	import { goto } from '$app/navigation';
	import auth from '$lib/utils/authService';
	import { themeStore, toggleTheme, currentTheme, type Theme } from '$lib/stores/themeStore';

	let theme: Theme;

	// Subscribe to theme changes
	currentTheme.subscribe(value => {
		theme = value;
	});

	// Functions
	onMount(() => {
		// Selecting elements for navbar and menu login and dashboard buttons
		const navbarLoginButtonsElement = document.getElementById(
			'navbar-login-buttons'
		) as HTMLElement;
		const menuLoginButtonsElement = document.getElementById('menu-login-buttons') as HTMLElement;
		const navbarDashboardButtonsElement = document.getElementById(
			'navbar-button-dashboard'
		) as HTMLElement;
		const menuDashboardButtonsElement = document.getElementById(
			'menu-button-dashboard'
		) as HTMLElement;

		// Checking if the user is logged in and adjusting the visibility of buttons accordingly
		isAuthenticated.subscribe((value) => {
			if (value) {
				navbarLoginButtonsElement.classList.add('hidden');
				menuLoginButtonsElement.classList.add('hidden');
				navbarDashboardButtonsElement.classList.remove('hidden');
				menuDashboardButtonsElement.classList.remove('hidden');
			}
			if (value && $autoLogin) {
				goto('/home');
			}
		});

		// Initialize theme store
		themeStore.initialize();
	});
	
	function login() {
		auth.loginWithPopup($auth0Client, {});
	}
	
	function handleThemeToggle() {
		toggleTheme();
	}
</script>

<div class="navbar bg-base-300">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<ul class="menu dropdown-content menu-sm z-[1] mt-3 rounded-box bg-base-100 p-2 shadow">
				<li><a href="#home">Home</a></li>
				<li>
					<a href="#features">Features</a>
				</li>
				<li>
					<a href="/themes">Theme Gallery</a>
				</li>
				<li>
					<a href="#contact-us">Contact</a>
				</li>
				<li>
					<button 
						class="flex items-center gap-2 btn btn-ghost" 
						on:click={handleThemeToggle}
						aria-label="Toggle theme"
					>
						{#if theme?.type === 'light'}
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
							<span>Dark Mode</span>
						{:else}
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
								<line x1="12" y1="1" x2="12" y2="3" />
								<line x1="12" y1="21" x2="12" y2="23" />
								<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
								<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
								<line x1="1" y1="12" x2="3" y2="12" />
								<line x1="21" y1="12" x2="23" y2="12" />
								<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
								<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
							</svg>
							<span>Light Mode</span>
						{/if}
					</button>
				</li>
				<AutoLogin type="nav" />
				<div class="menu-buttons menu-login-buttons" id="menu-login-buttons">
					<li class="mb-2">
						<button class="btn btn-accent" on:click={login}>Login</button>
					</li>
					<li>
						<button class="btn" on:click={login}>Sign up</button>
					</li>
				</div>
				<div class="menu-button-dashboard hidden" id="menu-button-dashboard">
					<a class="btn btn-accent" href="/home">Go to App</a>
				</div>
			</ul>
		</div>
		<img src={icon} alt="logo" id="navbar-logo" class="filter" />
		<a href="/" class="btn btn-ghost text-2xl"> Cnotes </a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal text-xl">
			<li><a href="#home">Home</a></li>
			<li>
				<a href="#features">Features</a>
			</li>
			<li>
				<a href="/themes">Theme Gallery</a>
			</li>
			<li>
				<a href="#contact-us">Contact Us</a>
			</li>
			<li>
				<button 
					class="flex items-center gap-2 btn btn-ghost" 
					on:click={handleThemeToggle}
					aria-label="Toggle theme"
				>
					{#if theme?.type === 'light'}
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
						<span>Dark Mode</span>
					{:else}
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
							<line x1="12" y1="1" x2="12" y2="3" />
							<line x1="12" y1="21" x2="12" y2="23" />
							<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
							<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
							<line x1="1" y1="12" x2="3" y2="12" />
							<line x1="21" y1="12" x2="23" y2="12" />
							<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
							<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
						</svg>
						<span>Light Mode</span>
					{/if}
				</button>
			</li>
		</ul>
	</div>
	<div class="navbar-buttons navbar-login-buttons navbar-end mr-2 gap-2" id="navbar-login-buttons">
		<button class="btn btn-accent" on:click={login}>Login</button>
		<button class="btn" on:click={login}>Sign up</button>
	</div>
	<div class="navbar-buttons navbar-end mr-2 hidden gap-2" id="navbar-button-dashboard">
		<a class="btn btn-accent" href="/home">Go to App</a>
	</div>
</div>

<style>
	#navbar-logo {
		width: 70px;
		border-radius: 100px;
		cursor: pointer;
		margin-bottom: 10px;
	}
	.navbar {
		cursor: default;
		position: fixed;
		z-index: 1000;
		background-color: var(--background);
		backdrop-filter: blur(30px);
		transition: background-color 0.3s ease;
	}
	@media (max-width: 466px) {
		.navbar-buttons {
			display: none;
		}
		.menu-buttons {
			display: block;
		}
	}
</style>

<script lang="ts">
	// Imports
	import icon from '../images/icon.png'; // Importing the icon image for the navbar
	import { theme } from '$lib/stores/store.svelte'; // Importing the theme store for theme management
	import { onMount } from 'svelte'; // Importing onMount lifecycle method from Svelte
	import AutoLogin from './autoLogin.svelte'; // Importing the AutoLogin component for auto-login functionality
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import SignInButton from 'clerk-sveltekit/client/SignInButton.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';

	// Functions
	onMount(async () => {
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
		// console.log('isAuthenticated: ', $isAuthenticated);
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
		});
	});
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
			<ul class="menu dropdown-content menu-sm z-[1] mt-3 gap-2 rounded-box bg-base-100 p-2 shadow">
				<li><a href="#home">Home</a></li>
				<li>
					<a href="#features">Features</a>
				</li>
				<li>
					<a href="#contact-us">Contact</a>
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
				<AutoLogin type="nav" />
				<div class="menu-buttons menu-login-buttons" id="menu-login-buttons">
					<li class="mb-2">
						<SignedIn>
							<a class="btn btn-accent" href="/home">Go to Home</a>
						</SignedIn>
						<SignedOut>
							<SignInButton class="btn btn-accent" mode="modal" />
						</SignedOut>
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
				<a href="#contact-us">Contact Us</a>
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
		</ul>
	</div>
	<div class="navbar-buttons navbar-login-buttons navbar-end mr-2 gap-3" id="navbar-login-buttons">
		<SignedIn>
			<a class="btn btn-accent" href="/home">Go to Home</a>
			<UserButton />
		</SignedIn>
		<SignedOut>
			<SignInButton class="btn btn-accent" mode="modal" />
		</SignedOut>
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
		background-color: var(--base-300);
		backdrop-filter: blur(30px);
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

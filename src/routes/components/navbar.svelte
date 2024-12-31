<script lang="ts">
	// Imports
	import logo from '../images/logo.png';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import Form from './form.svelte';
	import { goto } from '$app/navigation';
	import { showModal } from '$lib/stores/showLoginForm';

	// Variables
	let cookieValue: string;
	let loggedIn: boolean = false;
	let formMode: 'register' | 'login' = 'register';

	// Functions
	onMount(async () => {
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

		theme.subscribe((value) => {
			const logo = document.getElementById('navbar-logo');
			if (logo != null) {
				if (value) {
					logo.classList.remove('filter');
					logo.classList.add('no-filter');
				} else {
					logo.classList.remove('no-filter');
					logo.classList.add('filter');
				}
			}
		});

		const response = await fetch('/api/cookie', {
			method: 'GET',
			credentials: 'include'
		});
		const result = await response.json();
		if (result.message == 'success') {
			cookieValue = result.cookieValue;
			if (cookieValue) {
				await renewCookie();
			}
		} else {
			// console.error('Failed to fetch cookie.', result.message);
		}
		if (loggedIn) {
			navbarLoginButtonsElement.classList.add('hidden');
			menuLoginButtonsElement.classList.add('hidden');
			navbarDashboardButtonsElement.classList.remove('hidden');
			menuDashboardButtonsElement.classList.remove('hidden');
		}
	});
	async function renewCookie() {
		const response = await fetch('/api/database', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				session_id: cookieValue
			})
		});
		const result = await response.json();
		if (result.message == 'success') {
			loggedIn = true;
		}
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
					<a href="#about-us">About Us</a>
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
							bind:checked={$theme}
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

				<div class="menu-buttons menu-login-buttons" id="menu-login-buttons">
					<li class="mb-2">
						<a
							class="btn btn-accent"
							href="#form"
							on:click={() => {
								formMode = 'login';
								showModal.set(true);
							}}>Login</a
						>
					</li>
					<li>
						<a
							class="btn"
							href="#form"
							on:click={() => {
								formMode = 'register';
								showModal.set(true);
							}}>Sign up</a
						>
					</li>
				</div>
				<div class="menu-button-dashboard hidden" id="menu-button-dashboard">
					<a class="btn btn-accent" href="/admin-dashboard">Dashboard</a>
				</div>
			</ul>
		</div>
		<img src={logo} alt="logo" id="navbar-logo" class="filter" />
		<a href="/" class="btn btn-ghost text-2xl"> PD Enterprise </a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal text-xl">
			<li><a href="#home">Home</a></li>
			<li>
				<a href="#about-us">About Us</a>
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
						bind:checked={$theme}
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
	<div class="navbar-buttons navbar-login-buttons navbar-end mr-2 gap-2" id="navbar-login-buttons">
		<a
			class="btn btn-accent"
			href="#form"
			on:click={() => {
				formMode = 'login';
				showModal.set(true);
			}}>Login</a
		>
		<a
			href="#form"
			class="btn"
			on:click={() => {
				formMode = 'register';
				showModal.set(true);
			}}>Sign up</a
		>
	</div>
	<div class="navbar-buttons navbar-end mr-2 hidden gap-2" id="navbar-button-dashboard">
		<a class="btn btn-accent" href="/admin-dashboard">Dashboard</a>
	</div>
</div>

{#if $showModal}
	<div class="modal modal-bottom sm:modal-middle" role="dialog" id="form">
		<div class="modal-box">
			<Form type={formMode} />
		</div>
	</div>
{/if}

<style>
	:root {
		--image-size: 70px;
	}
	#navbar-logo {
		width: var(--image-size);
		border-radius: 100px;
		cursor: pointer;
		margin-bottom: 10px;
	}
	.filter {
		filter: brightness(0) invert(1);
	}
	.no-filter {
		filter: none;
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

<script lang="ts">
	// Imports
	import { theme, user, auth0Client } from '$lib/stores/store.svelte';
	import { onMount } from 'svelte';
	import auth from '$lib/utils/authService';
	import AutoLogin from './autoLogin.svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { goto } from '$app/navigation';
	import SvelteToast from './svelteToast.svelte';
	import Sync from './sync.svelte';

	let userPictureUrl: string = $state('');
	let userName: string = $state('');

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
		});
		console.log(user.value);
		if (user.value) {
			// @ts-expect-error
			userPictureUrl = user.value.picture;
			// @ts-expect-error
			userName = user.value.name;
		}
	});

	function logout() {
		auth.logout(auth0Client);
		localStorage.setItem('isAuthenticated', 'false');
		goto('/');
	}
</script>

<SvelteToast />

<div class="navbar bg-base-300">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost">
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
			<ul
				class="dropdown-content menu menu-sm z-[1] mt-3 flex gap-2 rounded-box bg-base-100 p-2 shadow"
			>
				<li>
					<a
						href="https://pd-enterprise.pages.dev/admin-dashboard"
						title="Admin Dashboard"
						class="flex justify-center"
					>
						<img
							src={userPictureUrl}
							alt="profile"
							title={userName}
							class="w-15 h-10 cursor-pointer rounded-full"
						/>
						{userName}
					</a>
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
				<AutoLogin type="inapp" />
				<Sync />
				<div class="menu-buttons menu-login-buttons" id="menu-login-buttons">
					<li class="mb-2">
						<a
							class="btn btn-accent"
							href="#form"
							onclick={() => {
								const logout_modal = document.getElementById('logout_modal') as HTMLDialogElement;
								logout_modal.showModal();
							}}>Log Out</a
						>
					</li>
				</div>
				<dialog id="logout_modal" class="modal">
					<div class="modal-box">
						<form method="dialog">
							<button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">✕</button>
						</form>
						<h1 class="text-2xl">Log out</h1>
						<p class="py-4">Are you sure you want to log out?</p>
						<div class="modal-action">
							<button
								class="btn btn-info"
								onclick={() => {
									const logout_modal = document.getElementById('logout_modal') as HTMLDialogElement;
									logout_modal.close();
								}}>Cancel</button
							>
							<button
								class="btn btn-error"
								onclick={() => {
									logout();
									const logout_modal = document.getElementById('logout_modal') as HTMLDialogElement;
									logout_modal.close();
								}}
								>Log Out
							</button>
						</div>
					</div>
				</dialog>
			</ul>
		</div>
		<a class="btn btn-ghost text-2xl" href="/home">Home</a>
	</div>
</div>

<style>
	.navbar {
		cursor: default;
		position: fixed;
		z-index: 1000;
		background-color: var(--base-300);
		backdrop-filter: blur(30px);
	}
	@media (max-width: 466px) {
		.menu-buttons {
			display: block;
		}
	}
</style>

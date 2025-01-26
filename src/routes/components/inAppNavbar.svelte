<script lang="ts">
	// Imports
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { loggedIn } from '$lib/stores/loggedIn';
	import AutoLogin from './autoLogin.svelte';
	import { showToast } from '$lib/utils/svelteToastsUtil';
	import { goto } from '$app/navigation';
	import SvelteToast from './svelteToast.svelte';

	// Functions
	function logout() {
		loggedIn.set(false);
		sessionStorage.removeItem('Email');
		localStorage.removeItem('LoggedIn');
		showToast('Success', 'Logged out successfully', 2500, 'success');
		setTimeout(() => {
			goto('/');
		}, 2500);
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
			<ul class="menu dropdown-content menu-sm z-[1] mt-3 rounded-box bg-base-100 p-2 shadow">
				<!-- <li><a href="#home">Settings</a></li> -->
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
				<AutoLogin type="inapp" />
				<div class="menu-buttons menu-login-buttons" id="menu-login-buttons">
					<li class="mb-2">
						<a
							class="btn btn-accent"
							href="#form"
							on:click={() => {
								delete_modal.showModal();
							}}>Log Out</a
						>
					</li>
				</div>
				<dialog id="delete_modal" class="modal">
					<div class="modal-box">
						<form method="dialog">
							<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
						</form>
						<h1 class="text-2xl">Log out</h1>
						<p class="py-4">Are you sure you want to log out?</p>
						<div class="modal-action">
							<button
								class="btn btn-info"
								on:click={() => {
									delete_modal.close();
								}}>Cancel</button
							>
							<button
								class="btn btn-error"
								on:click={() => {
									logout();
									delete_modal.close();
								}}
								>Log Out
							</button>
						</div>
					</div>
				</dialog>
			</ul>
		</div>
		<div class="btn btn-ghost text-2xl">Home</div>
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
		.navbar-buttons {
			display: none;
		}
		.menu-buttons {
			display: block;
		}
	}
</style>

<script lang="ts">
	// Imports
	import { theme, isAuthenticated } from '$lib/stores/store.svelte';
	import { onMount } from 'svelte';
	import AutoLogin from './autoLogin.svelte';
	import SvelteToast from './svelteToast.svelte';
	import Sync from './sync.svelte';
	import { UserButton, SignOutButton, SignedIn, SignInButton, SignedOut } from 'svelte-clerk';

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
	});
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
				class="menu dropdown-content menu-sm z-[1] mt-3 flex gap-2 rounded-box bg-base-100 p-2 shadow"
			>
				<li>
					<UserButton />
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
				<div class="menu-buttons menu-login-buttons w-full" id="menu-login-buttons">
					<SignedIn>
						<SignOutButton class="btn btn-error w-full" />
					</SignedIn>
					<SignedOut>
						<SignInButton class="btn btn-accent w-full" />
					</SignedOut>
				</div>
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

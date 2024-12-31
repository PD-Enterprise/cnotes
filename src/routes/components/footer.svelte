<script lang="ts">
	import logo from '../images/logo.png'; //imports logo image from images
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	onMount(() => {
		theme.subscribe((value) => {
			const logo = document.getElementById('footer-logo');
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
	});
</script>

<footer class="footer bg-base-300 p-10 text-base-content">
	<aside>
		<img src={logo} alt="logo" id="footer-logo" class="filter" />
		<p>
			PD Enterprise
			<br />
			Providing reliable tech tools for students since 2024
		</p>
	</aside>
	<nav>
		<!-- <h6 class="footer-title">Services</h6> -->
		<!-- <a href="https://grade-app.pages.dev" class="link-hover link">Grade App</a>
		<a href="https://cnotes.pages.dev" class="link-hover link">Cnotes</a> -->
	</nav>
	<nav>
		<h6 class="footer-title">Company</h6>
		<a href="#about-us" class="link-hover link">About us</a>
		<a href="#contact" class="link-hover link">Contact</a>
	</nav>
</footer>

<style>
	:root {
		--image-size: 70px;
	}
	#footer-logo {
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
</style>

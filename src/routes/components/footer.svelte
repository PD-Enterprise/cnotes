<script lang="ts">
	import icon from '../images/icon.png'; //imports logo image from images
</script>

<footer class="footer bg-base-300 p-3 text-base-content">
	<aside class="flex items-center">
		<img src={icon} alt="logo" id="footer-logo" class="filter" />
		<p>
			PD Enterprise
			<br />
			Providing reliable tech tools for students since 2024
		</p>
	</aside>
	<div class="flex flex-row gap-10">
		<nav class="flex flex-col gap-2">
			<h6 class="footer-title">Services</h6>
			<a href="https://grade-app.pages.dev" class="link-hover link">Grade App</a>
			<a href="https://cnotes.pages.dev" class="link-hover link">Cnotes</a>
		</nav>
		<nav class="flex flex-col gap-2">
			<h6 class="footer-title">Company</h6>
			<a href="https://pd-enterprise.pages.dev/#about-us" class="link-hover link">About us</a>
			<a href="https://pd-enterprise.pages.dev/#contact-us" class="link-hover link">Contact Us</a>
		</nav>
	</div>
</footer>

<style>
	#footer-logo {
		width: 60px;
		border-radius: 100px;
		cursor: pointer;
		margin-bottom: 10px;
	}
</style>

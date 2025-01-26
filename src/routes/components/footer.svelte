<script lang="ts">
	import icon from '../images/icon.png'; //imports logo image from images
</script>

<footer class="footer bg-base-300 p-10 text-base-content">
	<aside>
		<img src={icon} alt="logo" id="footer-logo" class="filter" />
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
	#footer-logo {
		width: 70px;
		border-radius: 100px;
		cursor: pointer;
		margin-bottom: 10px;
	}
</style>

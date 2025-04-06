<script lang="ts">
	import { showModal } from '$lib/stores/store';

	let formMode: 'register' | 'login' = 'register';
</script>

<div class="main">
	<div class="hero min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse gap-8">
			<div class="app-image">
				<img src="/images/cnotes-preview.png" alt="Cnotes App Interface" class="rounded-lg shadow-xl" />
			</div>
			<div id="home" class="text-center lg:text-left">
				<h1 class="title">
					Cnotes
				</h1>
				<p class="hero-text">
					Your personal notes, organized and accessible anywhere. Start your journey now by logging
					in or creating an account.
				</p>
			</div>
		</div>
	</div>

	<div class="features-section" id="features">
		<h2 class="section-title">Features</h2>
		<div class="features">
			<div class="feature-card">
				<div class="card-body items-center text-center">
					<div class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<h2 class="card-title">Intuitive Interface</h2>
					<p>
						Experience seamless note-taking with our clean, modern interface. Designed for both
						simplicity and efficiency to enhance your productivity.
					</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="card-body items-center text-center">
					<div class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
					</div>
					<h2 class="card-title">Secure Cloud Storage</h2>
					<p>
						Your notes are automatically synced and encrypted in the cloud, ensuring your data is
						protected while remaining accessible across all your devices.
					</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="card-body items-center text-center">
					<div class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
						</svg>
					</div>
					<h2 class="card-title">Smart Organization</h2>
					<p>
						Organize notes with tags, and categories. Use our powerful search and filter system to
						find exactly what you need, when you need it.
					</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="card-body items-center text-center">
					<div class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</div>
					<h2 class="card-title">Collaborative Sharing</h2>
					<p>
						Share notes and collaborate in real-time with team members. Control access levels and
						track changes to maintain document integrity.
					</p>
				</div>
			</div>
			<div class="feature-card">
				<div class="card-body items-center text-center">
					<div class="icon-wrapper">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</div>
					<h2 class="card-title">Rich Text Formatting</h2>
					<p>
						Create beautiful notes with support for rich text, code snippets, images, and attachments.
						Express your ideas exactly how you envision them.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="contact-section" id="contact-us">
		<div class="contact-content">
			<h2 class="section-title">Contact us!</h2>
			<p>
				Have questions, need assistance, or want to share feedback? We'd love to hear from you! Reach
				out anytime.
			</p>
			<a href="https://pd-enterprise.pages.dev/contact-us" class="btn btn-outline">Contact us</a>
		</div>
	</div>
</div>

<style>
	.main {
		background: linear-gradient(to bottom, var(--base-100), var(--base-200));
	}

	.hero {
		background: var(--base-100);
		position: relative;
		overflow: hidden;
	}

	.title {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.2;
		color: #4a90e2;
	}

	.hero-text {
		font-size: 1.25rem;
		margin: 1.5rem 0;
		font-family: 'Poppins', sans-serif;
		opacity: 0.8;
		max-width: 600px;
		color: var(--base-content);
	}

	.section-title {
		font-size: 2rem;
		font-weight: 600;
		text-align: center;
		margin-bottom: 2rem;
		color: #4a90e2;
	}

	.features-section {
		padding: 4rem 2rem;
		background: var(--base-100);
	}

	.features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.feature-card {
		background: var(--base-200);
		border-radius: 1rem;
		padding: 2rem;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.feature-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
	}

	.icon-wrapper {
		background: #4a90e2;
		color: white;
		padding: 1rem;
		border-radius: 1rem;
		margin-bottom: 1rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.card-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 1rem 0;
		color: #4a90e2;
	}

	.contact-section {
		padding: 4rem 2rem;
		background: var(--base-200);
		text-align: center;
	}

	.contact-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.contact-content p {
		font-size: 1.25rem;
		margin: 1.5rem 0;
		opacity: 0.8;
	}

	.btn-outline {
		padding: 0.5rem 1.5rem;
		font-size: 1rem;
		border: 2px solid #4a90e2;
		color: #4a90e2;
		transition: all 0.3s ease;
	}

	.btn-outline:hover {
		background: #4a90e2;
		color: white;
	}

	.app-image {
		flex: 1;
		max-width: 600px;
		margin: 0 auto;
	}

	.app-image img {
		width: 100%;
		height: auto;
		border: 1px solid rgba(74, 144, 226, 0.1);
		transition: transform 0.3s ease;
	}

	.app-image img:hover {
		transform: scale(1.02);
	}

	@media (max-width: 768px) {
		.title {
			font-size: 2.5rem;
		}

		.hero-text {
			font-size: 1.1rem;
		}

		.features {
			grid-template-columns: 1fr;
		}

		.section-title {
			font-size: 1.75rem;
		}

		.app-image {
			max-width: 100%;
			margin: 2rem auto;
		}
	}

	@media (max-width: 480px) {
		.title {
			font-size: 2rem;
		}

		.hero-text {
			font-size: 1rem;
		}

		.feature-card {
			padding: 1.5rem;
		}
	}
</style>

<script lang="ts">
	import { showModal } from '$lib/stores/store';
	import { fade, fly } from 'svelte/transition';
	
	let formMode: 'register' | 'login' = 'register';

	interface Feature {
		title: string;
		description: string;
		icon: string;
	}

	const features: Feature[] = [
		{
			title: "Intuitive Interface",
			description: "Experience seamless note-taking with our clean, modern interface. Designed for both simplicity and efficiency.",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
			</svg>`
		},
		{
			title: "Secure Cloud Storage",
			description: "Your notes are automatically synced and encrypted in the cloud, ensuring your data is protected.",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
			</svg>`
		},
		{
			title: "Smart Organization",
			description: "Organize notes with tags and categories. Use our powerful search and filter system.",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
			</svg>`
		},
		{
			title: "Collaborative Sharing",
			description: "Share notes and collaborate in real-time with team members. Control access levels easily.",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
			</svg>`
		},
		{
			title: "Rich Text Formatting",
			description: "Create beautiful notes with support for rich text, code snippets, images, and attachments.",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
			</svg>`
		},
		{
			title: "Cross-Platform Sync",
			description: "Access your notes from any device, with real-time synchronization across platforms.",
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
			</svg>`
		}
	];
</script>

<div class="main bg-base-100">
	<!-- Hero Section -->
	<div class="hero min-h-screen bg-base-200" in:fade>
		<div class="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row-reverse gap-12">
			<!-- Hero Image/Illustration -->
			<div class="flex-1 relative" in:fly="{{ x: 100, duration: 1000 }}">
				<div class="w-full h-[400px] bg-primary/10 rounded-2xl overflow-hidden relative">
					<img
						src="/hero-illustration.svg"
						alt="Cnotes Hero"
						class="w-full h-full object-cover"
					/>
					<!-- Decorative Elements -->
					<div class="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
					<div class="absolute bottom-4 left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
				</div>
			</div>

			<!-- Hero Content -->
			<div class="flex-1 text-center lg:text-left" in:fly="{{ x: -100, duration: 1000 }}">
				<h1 class="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
					Cnotes
				</h1>
				<p class="py-8 text-lg text-base-content/80 leading-relaxed max-w-2xl">
					Your personal notes, organized and accessible anywhere. Experience the future of note-taking with our 
					intuitive platform designed for modern professionals and students.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<button 
						class="btn btn-primary btn-lg"
						on:click={() => {
							formMode = 'register';
							showModal.set(true);
						}}
					>
						Get Started
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</button>
					<button 
						class="btn btn-outline btn-lg"
						on:click={() => {
							formMode = 'login';
							showModal.set(true);
						}}
					>
						Sign In
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="py-24 bg-base-100" id="features" in:fade>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-base-content mb-4">Powerful Features</h2>
				<p class="text-lg text-base-content/70">Everything you need for efficient note-taking and organization</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each features as feature}
					<div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
						<div class="card-body">
							<div class="text-4xl mb-4">{@html feature.icon}</div>
							<h3 class="card-title text-xl mb-3">{feature.title}</h3>
							<p class="text-base-content/80">{feature.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Contact Section -->
	<div class="py-24 bg-base-200" id="contact-us" in:fade>
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<h2 class="text-4xl font-bold text-base-content mb-6">Get in Touch</h2>
			<p class="text-lg text-base-content/70 mb-8">
				Have questions, need assistance, or want to share feedback? We'd love to hear from you!
			</p>
			<a 
				href="https://pd-enterprise.pages.dev/contact-us" 
				class="btn btn-primary btn-lg"
			>
				Contact Us
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			</a>
		</div>
	</div>
</div>

<style>
	.hero {
		background-image: 
			radial-gradient(circle at top right, var(--primary-content/5) 0%, transparent 60%),
			radial-gradient(circle at bottom left, var(--secondary-content/5) 0%, transparent 60%);
	}

	.card {
		backdrop-filter: blur(10px);
		border: 1px solid var(--base-content/10);
	}

	.btn {
		transition: all 0.3s ease;
	}

	.btn:hover {
		transform: translateY(-2px);
	}

	/* Gradient text animation */
	h1 {
		background-size: 200% auto;
		animation: gradient 4s ease infinite;
	}

	@keyframes gradient {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}

	/* Smooth scrolling */
	html {
		scroll-behavior: smooth;
	}

	/* Card hover effects */
	.card:hover .text-4xl {
		transform: scale(1.1);
		transition: transform 0.3s ease;
	}

	/* Add styles for SVG icons */
	.card:hover svg {
		transform: scale(1.1);
		transition: transform 0.3s ease;
	}

	svg {
		transition: all 0.3s ease;
	}

	.card:hover svg {
		filter: drop-shadow(0 0 8px var(--primary));
	}
</style>

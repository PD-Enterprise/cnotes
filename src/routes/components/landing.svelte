<script lang="ts">
	import Icon from '@iconify/svelte';

	const features = [
		{
			icon: 'material-symbols:description-outline',
			title: 'Organization',
			subtitle: 'Categorize your notes.',
			description:
				'Tag and organize your notes into folder to make it easy to find what you need when you need it.'
		},
		{
			icon: 'material-symbols:search',
			title: 'Powerful Search',
			subtitle: 'Find anything instantly.',
			description:
				'Advanced search capabilities that scan through all your notes, to help you locate information in seconds.'
		},
		{
			icon: 'material-symbols:edit-note-outline',
			title: 'Powerful Editor',
			subtitle: 'Customize your notes your way',
			description:
				'Format your notes using a variety of tools with our powerful text editor to personalize every note, making your study materials as unique as you are.'
		},
		{
			icon: 'material-symbols:share-outline',
			title: 'Note Sharing',
			subtitle: 'Share your notes with a simple link.',
			description:
				'Instantly generate a shareable link for any note and send it to classmates, study groups, or anyone you choose.'
		}
	];

	const tiers = [
		{
			name: 'Tier 1',
			price: '$0',
			cardClass: 'bg-[#d0bcff] text-[#1f1830]',
			features: ['Organize', 'Search', 'Editor', 'Share'],
			cta: 'Selected',
			ctaClass: 'bg-[#9a7fd1]/40 text-[#1f1830]/70 cursor-default',
			disabled: true
		},
		{
			name: 'Tier 2',
			price: '$0.11',
			cardClass: 'bg-[#ccc2dc] text-[#1f1830]',
			features: ['AI Generated Summaries', 'Image Notes', 'OCR', 'AI Generated Quizzes'],
			cta: 'Learn More',
			ctaClass: 'bg-[#7a7585] text-white hover:bg-[#6a6575]',
			disabled: false
		},
		{
			name: 'Tier 3',
			price: '$0.21',
			cardClass: 'bg-[#efb8c8] text-[#2e1820]',
			features: ['Higher rate limits for all Tier 2 features', 'Voice Transcriptions'],
			cta: 'Learn More',
			ctaClass: 'bg-[#a06a7a] text-white hover:bg-[#8f5a6a]',
			disabled: false
		}
	];
</script>

<div class="min-h-screen w-full overflow-y-auto bg-[#141218] text-gray-100">
	<!-- Navbar -->
	<header class="sticky top-0 z-40 w-full border-b border-white/5 bg-[#33313a]/95 backdrop-blur">
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-3">
				<div class="h-7 w-7 rounded-full bg-gradient-to-br from-[#cdbcff] to-[#b29bf2]"></div>
				<span class="text-2xl font-semibold text-white">Cnotes</span>
			</div>
			<nav class="flex items-center gap-8 text-base text-gray-200">
				<a href="#features" class="transition-colors hover:text-white">products</a>
				<a href="#pricing" class="transition-colors hover:text-white">about</a>
				<a href="/blog" class="transition-colors hover:text-white">blog</a>
			</nav>
		</div>
	</header>

	<!-- Hero -->
	<section class="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
		<h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
			Organize Your Notes. Amplify Your Productivity.
		</h1>
		<p class="mt-4 max-w-2xl text-sm text-gray-400 sm:text-base">
			Cnotes helps students, turn scattered notes into structured knowledge.
		</p>
		<div class="mt-8 flex items-center gap-3">
			<a
				href="/login"
				class="rounded-md bg-[#cdbcff] px-4 py-2 text-xs font-medium text-[#1f1830] transition-colors hover:bg-[#bca8f7]"
			>
				Start Taking Notes
			</a>
			<a
				href="#features"
				class="rounded-md bg-[#e8e0ff] px-4 py-2 text-xs font-medium text-[#1f1830] transition-colors hover:bg-white"
			>
				See Features
			</a>
		</div>
	</section>

	<!-- Features -->
	<section id="features" class="mx-auto max-w-5xl px-6 py-16">
		<h2 class="text-center text-3xl font-semibold text-white">
			Everything You Need to Stay Organized
		</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-400">
			Powerful features designed to enhance your note-taking experience and boost productivity.
		</p>
		<div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature}
				<div
					class="rounded-xl border border-white/5 bg-[#1c1b22] p-5 transition-colors hover:border-white/10"
				>
					<div class="flex items-start gap-3">
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#cdbcff]/15 text-[#cdbcff]"
						>
							<Icon icon={feature.icon} class="h-6 w-6" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-white">{feature.title}</h3>
							<p class="text-xs text-[#cdbcff]/80">{feature.subtitle}</p>
						</div>
					</div>
					<p class="mt-4 text-sm leading-relaxed text-gray-400">{feature.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Pricing -->
	<section id="pricing" class="mx-auto max-w-5xl px-6 py-16">
		<h2 class="text-center text-3xl font-semibold text-white">Pricing</h2>
		<p class="mt-3 text-center text-sm text-gray-400">Switch Plans or Cancel any time</p>
		<div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each tiers as tier}
				<div class="flex flex-col rounded-2xl p-6 {tier.cardClass}">
					<h3 class="text-xl font-semibold">{tier.name}</h3>
					<p class="mt-1">
						<span class="text-3xl font-semibold">{tier.price}</span>
						<span class="ml-1 text-xs opacity-70">Per Month</span>
					</p>
					<ul class="mt-5 flex-1 space-y-2 text-sm">
						{#each tier.features as item}
							<li class="flex items-start gap-2">
								<span class="mt-0.5">•</span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
					<button
						class="mt-6 rounded-lg px-4 py-2 text-sm font-medium transition-colors {tier.ctaClass}"
						disabled={tier.disabled}
					>
						{tier.cta}
					</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-white/5 px-6 py-12">
		<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			<div class="lg:col-span-1">
				<div class="flex items-center gap-3">
					<div class="h-7 w-7 rounded-full bg-gradient-to-br from-[#cdbcff] to-[#b29bf2]"></div>
					<span class="text-xl font-semibold text-white">Cnotes</span>
				</div>
				<p class="mt-3 max-w-xs text-xs leading-relaxed text-gray-400">
					The smart note taking platform designed for modern productivity. Organize, search, and
					collaborate like never before.
				</p>
			</div>
			<div>
				<h4 class="text-sm font-semibold text-white">Product</h4>
				<ul class="mt-3 space-y-2 text-xs text-gray-400">
					<li><a href="#features" class="hover:text-white">Features</a></li>
					<li><a href="#pricing" class="hover:text-white">Pricing</a></li>
				</ul>
			</div>
			<div>
				<h4 class="text-sm font-semibold text-white">Resources</h4>
				<ul class="mt-3 space-y-2 text-xs text-gray-400">
					<li><a href="/blog" class="hover:text-white">Blog</a></li>
				</ul>
			</div>
			<div>
				<h4 class="text-sm font-semibold text-white">Company</h4>
				<ul class="mt-3 space-y-2 text-xs text-gray-400">
					<li>
						<a href="https://pd-enterprise.pages.dev" class="hover:text-white">About Us</a>
					</li>
					<li>
						<a href="https://pd-enterprise.pages.dev/contact-us" class="hover:text-white"
							>Contact Us</a
						>
					</li>
				</ul>
			</div>
		</div>
		<div
			class="mx-auto mt-10 flex max-w-6xl items-center justify-between border-t border-white/5 pt-6"
		>
			<p class="text-xs text-gray-500">© 2026 PD Enterprise. All rights reserved.</p>
			<a
				href="https://github.com/PD-Enterprise/cnotes"
				class="text-gray-400 transition-colors hover:text-white"
				aria-label="GitHub"
			>
				<Icon icon="mdi:github" class="h-6 w-6" />
			</a>
		</div>
	</footer>
</div>

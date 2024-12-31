<script lang="ts">
	import Form from './components/form.svelte';
	import { showModal } from '$lib/stores/showLoginForm';

	let formMode: 'register' | 'login' = 'register';
</script>

<div class="main">
	<div class="hero min-h-screen">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<div id="home">
				<h8 id="grade-app" class="title text-5xl font-bold">Cnotes</h8>
				<p class="py-6" id="homep">
					Your personal notes, organized and accessible anywhere. Start your journey now by logging
					in or creating an account.
				</p>
				<div class="buttons">
					<a
						class="loginButton btn btn-outline btn-primary"
						href="#form"
						data-sveltekit-preload-data>Login</a
					>
					<a
						class="registerButton btn btn-outline btn-primary"
						href="#form"
						data-sveltekit-preload-data>Register</a
					>
				</div>
			</div>
		</div>
	</div>
	<hr />
	<div class="features" id="features">
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Intuitive Interface</h2>
				<p>
					Experience seamless note-taking with our clean, modern interface. Designed for both
					simplicity and efficiency to enhance your productivity.
				</p>
			</div>
		</div>
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Secure Cloud Storage</h2>
				<p>
					Your notes are automatically synced and encrypted in the cloud, ensuring your data is
					protected while remaining accessible across all your devices.
				</p>
			</div>
		</div>
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Smart Organization</h2>
				<p>
					Organize notes with tags, and categories. Use our powerful search and filter system to
					find exactly what you need, when you need it.
				</p>
			</div>
		</div>
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Collaborative Sharing</h2>
				<p>
					Share notes and collaborate in real-time with team members. Control access levels and
					track changes to maintain document integrity.
				</p>
			</div>
		</div>
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body items-center text-center">
				<h2 class="card-title">Rich Text Formatting</h2>
				<p>
					Create beautiful notes with support for rich text, code snippets, images, and attachments.
					Express your ideas exactly how you envision them.
				</p>
			</div>
		</div>
	</div>
	<hr />
	<div class="contact" id="contact-us">
		<h2>Contact us!</h2>
		<p>
			Have questions, need assistance, or want to share feedback? We'd love to hear from you! Reach
			out anytime.
		</p>
		<a href="https://pd-enterprise.pages.dev/contact-us" class="nav-button">Contact us</a>
	</div>
	<hr />
</div>

{#if $showModal}
	<div class="modal modal-bottom sm:modal-middle" role="dialog" id="form">
		<div class="modal-box">
			<Form type={formMode} />
		</div>
	</div>
{/if}

<style>
	a:hover {
		text-decoration: underline;
	}
	p {
		font-size: 1.3rem;
	}
	.title {
		font-size: 4rem;
		font-weight: 700;
		margin-bottom: 20px;
	}
	.buttons {
		display: flex;
		gap: 20px;
	}
	.hero {
		box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
	}
	.hero p {
		font-size: 16px;
		margin: 20px 0;
		font-family: 'Poppins', sans-serif;
	}
	.features {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20px;
		padding: 50px 20px;
		box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
	}
	.contact {
		padding: 50px 20px;
		text-align: center;
		box-shadow: inset 0 0 10px rgba(128, 128, 128, 0.5);
	}
	.contact h2 {
		font-size: 24px;
		margin-bottom: 20px;
		font-family: 'Poppins', sans-serif;
		font-weight: 700;
	}
</style>

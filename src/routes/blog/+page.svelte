<script lang="ts">
	// imports
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import type { Post } from '../types';
	import formatDate from './utils';

	// variables
	let error: string = '';
	let posts: Post[] = [];

	// function to get Posts from Database
	async function getPosts() {
		const reponse = await fetch('../api/', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await reponse.json();

		if (result.status === 200) {
			posts = result.data.sort(
				(a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
		} else {
			error = result.message;
		}
	}
	onMount(() => {
		getPosts();
	});
</script>

<div class="main">
	<div class="posts">
		{#if posts.length > 0}
			{#each posts as post}
				<a class="post card m-5 w-96 bg-base-200 shadow-xl" href="/blog/{post.slug}">
					<div class="card-body">
						<div class="title">
							<h1 class="card-title">{post.title}</h1>
						</div>
						<div class="flex-2 card-actions inline-flex">
							<div class="author flex-1">
								By <b>
									{post.author_id}
								</b>
							</div>
							<svg
								width="25px"
								viewBox="0 0 512 512"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
							>
								<title>arrow-right</title>
								<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									<g id="add" fill="#000000" transform="translate(106.680107, 134.255147)">
										<polygon
											id="arrow-right"
											points="1.42108547e-14 143.073067 216.973013 143.073067 146.7232 213.32288 176.889813 243.489707 298.639787 121.739733 176.889813 0 146.7232 30.1668267 216.970453 100.4064 1.42108547e-14 100.4064"
										>
										</polygon>
									</g>
								</g>
							</svg>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			<div class="post">
				{#if error}
					<h1>{error}</h1>
				{:else}
					<center>
						<h1>Loading posts...</h1>
					</center>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	h1 {
		font-size: 1.5em;
	}
	.posts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1em;
	}
	.card-body {
		display: flex;
		flex-direction: column;
		min-height: 400px;
		justify-content: space-between;
	}
	.post {
		transition:
			transform 0.3s,
			box-shadow 0.3s;
		min-width: 300px;
	}
	svg {
		transition: transform 0.3s;
	}
	.post:hover {
		transform: translateY(-5px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
		.card-title {
			text-decoration: underline;
		}
		svg {
			transform: translateX(10px);
		}
		svg g {
			fill: #1a73e8;
		}
	}
</style>

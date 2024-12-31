<script lang="ts">
	// imports
	import { onMount } from 'svelte';
	import type { Post } from '../../types';
	import formatDate from '../utils';
	import Editor from '@tinymce/tinymce-svelte';
	import { theme } from '$lib/stores/theme';

	// variables
	let slug: string = '';
	let post: Post[] = [];
	let error: string = '';
	let conf = {
		height: 700,
		menubar: false,
		shortcuts: false,
		skin: 'oxide-dark',
		content_css: 'dark',
		editable_root: false
	};
	let editorVisible = true;

	// function to get Post from Database
	async function getPost(slug: string) {
		const response = await fetch('../../api', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug: slug })
		});
		const result = await response.json();

		if (result.status === 200) {
			post = result.data;
		} else {
			error = result.message;
		}
	}

	onMount(() => {
		slug = window.location.href.split('/blog/')[1];
		getPost(slug);

		theme.subscribe((value) => {
			if (value) {
				conf.skin = 'oxide';
				conf.content_css = 'light';
			} else {
				conf.skin = 'oxide-dark';
				conf.content_css = 'dark';
			}
			editorVisible = false;
			setTimeout(() => {
				editorVisible = true;
			}, 0);
		});
	});
</script>

<div class="main">
	<div class="post bg-base-200">
		{#if post.length > 0}
			<h1 class="post-title mb-5">{post[0].title}</h1>
			<p class="mb-2">{formatDate(post[0].created_at)}</p>
			<h2>By <b>{post[0].author_id}</b></h2>
			<div class="content mt-10">
				{#if editorVisible}
					<Editor
						bind:value={post[0].content}
						apiKey="i0gnsxdotawlh0aflioykbvzvckv55kfarrdfheeqq2g4yrm"
						channel="7"
						{conf}
					/>
				{/if}
			</div>
		{:else}
			<div class="post">
				{#if error}
					<h1>{error}</h1>
				{:else}
					<center>
						<h1>Loading Post...</h1>
					</center>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.post-title {
		font-size: 3.5rem;
	}
	.post {
		margin: 15px;
		padding: 10px;
		min-width: 300px;
	}
</style>

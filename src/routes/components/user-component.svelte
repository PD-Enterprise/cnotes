<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	const { data } = $props();
	let userObject: { name: string; image: string } = $state({
		name: 'User Name',
		image: ''
	});
	onMount(() => {
		if (data.session.user) {
			userObject = {
				name: data.session.user.name,
				image: data.session.user.image
			};
		}
	});
</script>

<div class="user flex items-center gap-3 rounded p-1">
	<div class="avatar">
		<div class="bg-base-300 h-10 rounded-full">
			{#if userObject.image == ''}
				<Icon icon="mdi:user" width="40" height="40" />
			{:else}
				<img src={userObject.image} alt="user-icon" />
			{/if}
		</div>
	</div>
	<div class="name">
		<span>
			{userObject.name}
		</span>
	</div>
</div>

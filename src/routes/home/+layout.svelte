<script lang="ts">
	import InAppNavbar from '../components/inAppNavbar.svelte';

	let { children } = $props();
</script>

<div class="main">
	<div class="navbar mb-5 mt-3">
		<InAppNavbar />
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

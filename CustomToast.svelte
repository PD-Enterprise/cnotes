<script lang="ts">
	import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-svelte';

	export let title: string;
	export let description: string;
	export let type: 'info' | 'success' | 'warning' | 'error' = 'info';

	const typeConfig = {
		info: { class: 'alert-info', icon: Info },
		success: { class: 'alert-success', icon: CircleCheck },
		warning: { class: 'alert-warning', icon: TriangleAlert },
		error: { class: 'alert-error', icon: CircleX }
	};

	const config = typeConfig[type];
</script>

<div class="alert {config.class} shadow-lg">
	<svelte:component this={config.icon} class="h-6 w-6 flex-shrink-0 stroke-current" />
	<div>
		<h3 class="font-bold">{title}</h3>
		<div class="text-xs">{description}</div>
	</div>
</div>
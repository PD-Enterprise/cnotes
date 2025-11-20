// Imports
import { toasts } from 'svelte-toasts';
import CustomToast from '$lib/components/CustomToast.svelte';

// Functions
const showToast = (
	title: string,
	description: string,
	type: 'info' | 'success' | 'warning' | 'error' = 'info',
	duration: number = 5000
) => {
	toasts.add({
		component: CustomToast,
		props: { title, description, type },
		duration: duration,
		placement: 'bottom-right'
	});
};

export { showToast };

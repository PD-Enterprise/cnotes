// Imports
import { toasts } from 'svelte-toasts';

// Functions
const showToast = (
	title: string,
	description: string,
	type: 'info' | 'success' | 'warning' | 'error' = 'info',
	duration: number = 5000
) => {
	toasts.add({
		title: title,
		description: description,
		type: type,
		duration: duration,
		placement: 'bottom-right'
	});
};

export { showToast };

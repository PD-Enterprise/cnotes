// Imports
import { toast } from '@zerodevx/svelte-toast';

// Variables
const toastThemes = {
	success: {
		'--toastBackground': '#38a169',
		'--toastColor': 'white',
		'--toastBarBackground': '#2f855a'
	},
	info: {
		'--toastBackground': '#3182ce',
		'--toastColor': 'white',
		'--toastBarBackground': '#2b6cb0'
	},
	error: {
		'--toastBackground': '#e53e3e',
		'--toastColor': 'white',
		'--toastBarBackground': '#c53030'
	}
};

// Functions
export const showToast = (message: string, type: 'success' | 'info' | 'error') => {
	toast.push(message, { theme: toastThemes[type] });
};

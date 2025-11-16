import type { LayoutServerLoad } from './$types';
import config from '$lib/utils/apiConfig';
import { isAuthenticated } from '$lib/stores/store.svelte';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (session) {
		// console.log(session);
		try {
			const request = await fetch(`${config.apiUrl}user/new-user`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: session.user.name,
					email: session.user.email
				})
			});
			const result = await request.json();
			// console.log(result);
		} catch (error) {
			return {
				status: 500,
				message: 'Error adding user to database'
			};
		}
	}

	return {
		session
	};
};

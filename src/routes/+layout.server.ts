import type { LayoutServerLoad } from './$types';
import config from '$lib/utils/apiConfig';
import { isAuthenticated } from '$lib/stores/store.svelte';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (session) {
		try {
			const cookieHeader = event.cookies
				.getAll()
				.map(({ name, value }) => `${name}=${value}`)
				.join('; ');
			const request = await fetch(`${config.apiUrl}users/new-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cookie': cookieHeader
				},
			});
			const result = await request.json();
			console.log(result)
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

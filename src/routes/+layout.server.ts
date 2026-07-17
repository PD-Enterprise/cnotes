import type { UserData } from './types';
import config from '$lib/utils/apiConfig';
import type { RequestEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	let membership: UserData['membership'] | undefined;

	if (session && session.user) {
		const userRole = await getUserRole(event);
		if (!(userRole instanceof Error)) {
			membership = userRole;
		}

		return {
			session,
			membership
		};
	}

	return {
		session: null
	};
};

async function getUserRole(event: RequestEvent) {
	try {
		const request = await event.fetch(`${config.apiUrl}users/roles/get-role`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Cookie: event.request.headers.get('cookie') ?? ''
			}
		});
		const result = await request.json();
		return result.data;
	} catch (error) {
		return new Error('Error getting user role' + error);
	}
}
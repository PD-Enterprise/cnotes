import { returnJson } from '$lib/utils/returnJsonUtil';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	return returnJson('success', 'Note Found successfully.', body);
};

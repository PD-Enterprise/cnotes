import { notesSql } from '$lib/utils/notedb';
import { returnJson } from '$lib/utils/returnJsonUtil';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const slug = body.slug;

	if (slug) {
		const query = await notesSql`select * from notes where slug = ${slug}`;
		if (query) {
			return returnJson('success', 'Note Found successfully.', query);
		} else {
			return returnJson('error', 'Note not found.', body);
		}
	} else {
		return returnJson('error', 'Slug was not provided.', body);
	}
};

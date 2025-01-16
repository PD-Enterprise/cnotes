import { notesSql } from '$lib/utils/notedb';
import { json, type RequestHandler } from '@sveltejs/kit';
import { returnJson } from '$lib/utils/returnJsonUtil';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (body.noteSlug) {
		const query = await notesSql`delete from notes where slug = ${body.noteSlug}`;
		if (query) {
			return returnJson('success', 'Note deleted successfully', query);
		} else {
			return returnJson('error', 'Error deleting note', body);
		}
	}
};

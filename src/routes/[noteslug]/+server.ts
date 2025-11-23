import { getNote } from '$lib/api/get-note.js';
import { updateNote } from '$lib/api/update-note';
import config from '$lib/utils/apiConfig';
import { returnJson } from '$lib/utils/returnJson';

export async function GET({ url, locals }) {
	const slug = url.pathname.split('/')[1];

	const [success, error, _, data] = await getNote(slug);
	if (error || !success) {
		return returnJson(500, 'Error fetching note', null, error);
	}
	return returnJson(200, 'Note fetched successfully', data, null);
}

export async function POST({ locals, request }) {
	const body = await request.json();
	if (!body) {
		return returnJson(400, 'Invalid request body', null, null);
	}
	const noteData = body.data;

	const session = await locals.getSession();
	if (!session) {
		return returnJson(401, 'Unauthorized', null, null);
	}
	const email = session.user.email;

	const [success, error, _, data] = await updateNote(email, noteData);
	if (error || !success) {
		return returnJson(500, 'Error updating note', null, error);
	}
	return returnJson(200, 'Note updated successfully', data, null);
}

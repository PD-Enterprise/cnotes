import config from '$lib/utils/apiConfig';
import { returnJson } from '$lib/utils/returnJson.js';
import { getNotes } from '$lib/api/get-notes';
import { deleteNote } from '$lib/api/delete-note';

export async function GET({ url, locals }) {
	const session = await locals.getSession();
	if (!session) {
		return returnJson(401, 'Unauthorized', null, null);
	}

	const email = session.user.email;

	const [success, error, _, data] = await getNotes(email);
	if (error || !success) {
		return returnJson(500, 'Error fetching notes', null, error);
	}
	return returnJson(200, 'Notes fetched successfully', data, null);
}

export async function DELETE({ locals, request }) {
	const body = await request.json();
	if (!body) {
		return returnJson(400, 'Invalid request body', null, null);
	}
	const session = await locals.getSession();
	if (!session) {
		return returnJson(401, 'Unauthorized', null, null);
	}

	const email = session.user.email;
	const slug = body.note.slug;

	const [success, error] = await deleteNote(email, slug);
	if (error || !success) {
		return returnJson(500, 'Error deleting note', null, error);
	}
	return returnJson(200, 'Note deleted successfully', null, null);
}

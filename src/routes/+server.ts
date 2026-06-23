import { returnJson } from '$lib/utils/returnJson.js';
import { getNotes } from '$lib/api/get-notes';
import { deleteNote } from '$lib/api/delete-note';
import config from '$lib/utils/apiConfig.js';

export async function GET({ url, locals, request }) {
	const session = await locals.getSession();
	if (!session) {
		return returnJson(401, 'Unauthorized', null, null);
	}

	const cookieHeader = request.headers.get('cookie') || '';
	try {
		const [success, error, _, data] = await getNotes(cookieHeader);
		if (error || !success) {
			return returnJson(500, 'Error fetching notes', null, error);
		}
		return returnJson(200, 'Notes fetched successfully', data, null);
	} catch (e) {
		console.error('Error calling backend:', e);
		return returnJson(503, 'Backend service unavailable', null, e);
	}
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

	const slug = body.note.slug;
	const cookieHeader = request.headers.get('cookie') || '';

	try {
		const [success, error] = await deleteNote(cookieHeader, slug);
		if (error || !success) {
			return returnJson(500, 'Error deleting note', null, error);
		}
		return returnJson(200, 'Note deleted successfully', null, null);
	} catch (e) {
		console.error('Error calling backend:', e);
		return returnJson(503, 'Backend service unavailable', null, e);
	}
}

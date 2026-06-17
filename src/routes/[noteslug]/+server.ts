import { getNote } from '$lib/api/get-note.js';
import { updateNote } from '$lib/api/update-note';
import config from '$lib/utils/apiConfig';
import { returnJson } from '$lib/utils/returnJson';

let email: string;

export async function GET({ url, locals, request }) {
	const slug = url.pathname.split('/')[1];

	try {
		const session = await locals.getSession();
		if (!session) {
			email = 'null';
		}
		email = session.user.email;
	} catch (error) {
		email = 'null';
	}

	const cookieHeader = request.headers.get('cookie') || '';
	try {
		const [success, error, message, data] = await getNote(cookieHeader, slug);
		if (error || !success) {
			return returnJson(data, message, null, error);
		}
		return returnJson(200, 'Note fetched successfully', data, null);
	} catch (e) {
		console.error('Error calling backend:', e);
		return returnJson(503, 'Backend service unavailable', null, e);
	}
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

	const cookieHeader = request.headers.get('cookie') || '';
	try {
		const [success, error, _, data] = await updateNote(cookieHeader, noteData);
		if (error || !success) {
			return returnJson(500, 'Error updating note', null, error);
		}
		return returnJson(200, 'Note updated successfully', data, null);
	} catch (e) {
		console.error('Error calling backend:', e);
		return returnJson(503, 'Backend service unavailable', null, e);
	}
}

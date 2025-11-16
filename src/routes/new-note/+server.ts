import { returnJson } from '$lib/utils/returnJson';
import type { returnData } from '../interfaces';
import { newNote } from '$lib/api/new-note';

export async function POST({ url, locals, request }) {
	const session = await locals.getSession();
	if (!session) {
		return returnJson(401, 'Unauthorized', null, null);
	}

	const body = await request.json();
	if (!body) {
		return returnJson(400, 'Invalid request body', null, null);
	}

	const email = session.user.email;

	const year = new Date(body.note.dateCreated).getFullYear();
	body.note.year = year;

	const [success, error] = await newNote(email, body.note);
	if (error || !success) {
		return returnJson(500, 'Error creating note', null, error);
	}
	return returnJson(200, 'Note created successfully', null, null);
}

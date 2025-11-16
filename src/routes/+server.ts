import config from '$lib/utils/apiConfig';
import { returnJson } from '$lib/utils/returnJson.js';
import { getNotes } from '$lib/api/get-notes';

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
		return new Response(
			JSON.stringify({
				status: 400
			})
		);
	}
	const slug = body.note.slug;
	const session = await locals.getSession();
	if (!session) {
		return new Response(
			JSON.stringify({
				status: 401
			})
		);
	}
	const email = session.user.email;
	try {
		const deleteNoteRequest = await fetch(`${config.apiUrl}notes/note/${slug}/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email: email })
		});

		const result = await deleteNoteRequest.json();
		// console.log(result);

		if (result.status == 200) {
			return new Response(
				JSON.stringify({
					status: 200
				})
			);
		} else {
			return new Response(
				JSON.stringify({
					status: 500
				})
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				status: 500
			})
		);
	}
}

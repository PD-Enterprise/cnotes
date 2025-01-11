import { notesSql } from '$lib/utils/notedb';
import { returnJson } from '$lib/utils/returnJsonUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { checkIfUserExists } from '$lib/utils/userExits';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (body.email) {
		const userExists = await checkIfUserExists(body.email);
		if (userExists) {
			const noteData = await getNote(body.slug);
			if (noteData) {
				return returnJson('success', 'Note Found successfully.', noteData);
			} else {
				return returnJson('error', 'Note not found.', body);
			}
		} else {
			return returnJson('error', 'Invalid email.', body);
		}
	} else {
		return returnJson('error', 'Email was not provided.', body);
	}
};

async function getNote(slug: string) {
	const query = await notesSql`select * from notes where slug = ${slug}`;
	return query;
}

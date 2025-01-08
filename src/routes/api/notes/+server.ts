import { returnJson } from '$lib/utils/returnJsonUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from '../../../db.server';
import { notesSql } from '$lib/utils/notedb';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	if (body.Email) {
		const query = await notesSql`select * from notes where email = ${body.Email}`;
		console.log(query);
		if (query) {
			return returnJson('success', 'Notes Found successfully.', query);
		} else {
			return returnJson('error', 'No notes found.', body);
		}
	} else {
		return returnJson('error', 'Email was not provided.', body);
	}
};

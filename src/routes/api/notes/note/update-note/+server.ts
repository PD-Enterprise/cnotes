import { returnJson } from '$lib/utils/returnJsonUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { checkIfUserExists } from '$lib/utils/userExits';
import { notesSql } from '$lib/utils/notedb';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	if (body.email) {
		const userExists = await checkIfUserExists(body.email);
		if (userExists) {
			const updated = await updateNote(body.data);
			if (updated) {
				return returnJson('success', 'Note Updated successfully.', body);
			} else {
				return returnJson('error', 'Failed to update note.', body);
			}
		} else return returnJson('error', 'Invalid email.', body);
	} else {
		return returnJson('error', 'Email was not provided.', body);
	}
};

async function updateNote(data: any) {
	const query = await notesSql`
        UPDATE notes 
        SET title = ${data[0].title}, 
            note_content = ${data[0].note_content}, 
            board = ${data[0].board}, 
            grade = ${data[0].grade}, 
            school = ${data[0].school}, 
            subject = ${data[0].subject} 
        WHERE note_id = ${data[0].note_id}`;
	if (query) {
		return true;
	} else {
		return false;
	}
}

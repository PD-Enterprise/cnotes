import config from '$lib/utils/apiConfig';
import { functionReturn } from '../utils/functionReturn';

export async function deleteNote(email: string, slug: string) {
	const deleteNoteRequest = await fetch(`${config.apiUrl}cnotes/note/${slug}/delete`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email
		})
	});

	const result = await deleteNoteRequest.json();

	if (result.status != 200) {
		return functionReturn(false, true, result.message, result.status, result.error);
	} else {
		return functionReturn(true, false, result.message, result.data, null);
	}
}

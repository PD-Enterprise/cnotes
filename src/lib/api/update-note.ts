import config from '$lib/utils/apiConfig';
import type { note } from '../../routes/types';
import { functionReturn } from '../utils/functionReturn';

export async function updateNote(email: string, note: note) {
	const updateNoteRequest = await fetch(`${config.apiUrl}cnotes/note/${note.slug}/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			note: note
		})
	});

	const result = await updateNoteRequest.json();

	if (result.status != 200) {
		return functionReturn(false, true, result.message, result.status, result.error);
	} else {
		return functionReturn(true, false, result.message, result.data, null);
	}
}

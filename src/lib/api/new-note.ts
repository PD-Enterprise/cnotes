import config from '$lib/utils/apiConfig';
import type { note } from '../../routes/types';
import { functionReturn } from '../utils/functionReturn';

export async function newNote(email: string, note: note) {
	const newNoteRequest = await fetch(`${config.apiUrl}cnotes/new-note/${note.type}`, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			email: email,
			note: note
		})
	});

	const result = await newNoteRequest.json();

	if (result.status != 200) {
		return functionReturn(false, true, result.message, result.status, result.error);
	} else {
		return functionReturn(true, false, result.message, result.data, null);
	}
}

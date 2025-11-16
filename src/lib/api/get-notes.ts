import config from '$lib/utils/apiConfig';
import { functionReturn } from '../utils/functionReturn';

export async function getNotes(email: string) {
	const getNotesRequest = await fetch(`${config.apiUrl}cnotes/notes`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: email
		})
	});

	const result = await getNotesRequest.json();

	if (result.status != 200) {
		return functionReturn(false, true, result.message, result.status, result.error);
	} else {
		return functionReturn(true, false, result.message, result.data, null);
	}
}

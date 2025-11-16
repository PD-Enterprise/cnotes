import config from '$lib/utils/apiConfig';
import { functionReturn } from '../utils/functionReturn';

export async function getNote(slug: string) {
	const getNoteRequest = await fetch(`${config.apiUrl}cnotes/note/${slug}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	const result = await getNoteRequest.json();

	if (result.status != 200) {
		return functionReturn(false, true, result.message, result.status, result.error);
	} else {
		return functionReturn(true, false, result.message, result.data, null);
	}
}

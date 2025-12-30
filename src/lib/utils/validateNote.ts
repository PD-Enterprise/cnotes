import type { note } from '../../routes/types';

export function validateNote(note: note): boolean {
	if (
		note.title &&
		note.content &&
		note.dateCreated &&
		note.academicLevel &&
		note.topic &&
		note.type &&
		note.visibility
	) {
		return true;
	} else {
		return false;
	}
}

import type { note } from '../../routes/types';

export function validateNote(note: note): boolean {
	if (note?.title && note?.dateCreated && note?.academicLevel && note?.topic && note?.visibility) {
		return true;
	} else {
		return false;
	}
}

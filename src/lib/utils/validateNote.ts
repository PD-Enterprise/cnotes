export function validateNote(note) {
	if (
		note?.title &&
		note?.dateCreated &&
		note?.academicLevel &&
		note?.topic &&
		note?.visibility &&
		note?.language &&
		note?.keywords
	) {
		return true;
	} else {
		return false;
	}
}

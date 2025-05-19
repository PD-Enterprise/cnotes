export function validateNote(note) {
    if (
        note?.title &&
        note?.board &&
        note?.dateCreated &&
        note?.grade &&
        note?.subject
    ) {
        return true;
    } else {
        return false;
    }
};
/**
 * Handles the POST request for adding a new note.
 *
 * This function is a RequestHandler that processes the POST request to add a new note.
 * It expects the request body to contain the note details and the email of the user.
 *
 * @param {RequestEvent} event - The event object representing the request.
 * @returns {Response} - A JSON response indicating the success or failure of the operation.
 */
import { returnJson } from '$lib/utils/returnJsonUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { notesSql } from '$lib/utils/notedb';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	// Check if the email is provided in the request body
	if (body.email) {
		// Attempt to upload the note
		const query = await uploadNote(body.note, body.email);
		if (query) {
			// If the note is uploaded successfully, return a success response
			return returnJson('success', 'Note added successfully', query);
		} else {
			// If the note upload fails, return an error response
			return returnJson('error', 'Error adding note', body);
		}
	} else {
		// If the email is not provided, return an error response
		return returnJson('error', 'Email is required', body);
	}
};

/**
 * Generates a slug from a given note title.
 *
 * This function takes a note title and converts it into a slug by replacing spaces with dashes and converting to lowercase.
 *
 * @param {string} noteTitle - The title of the note.
 * @returns {string} - The generated slug.
 */
function generateSlug(noteTitle) {
	return noteTitle.toLowerCase().replace(/\s+/g, '-') + Math.random().toString(36).substr(2, 9);
}

/**
 * Uploads a note to the database.
 *
 * This function takes a note and the email of the user, generates a slug for the note, and inserts the note into the database.
 *
 * @param {object} note - The note to be uploaded.
 * @param {string} email - The email of the user.
 * @returns {object|boolean} - The inserted note if successful, otherwise false.
 */
async function uploadNote(note, email) {
	if (
		!note[0].title ||
		!note[0].note_content ||
		!note[0].subject ||
		!note[0].grade ||
		!note[0].board ||
		!note[0].school ||
		!note[0].date_created
	) {
		return returnJson('error', 'Missing required fields for note upload.', note);
	}

	const slug = generateSlug(note[0].title);
	const query =
		await notesSql`insert into notes (title, slug, note_content, subject, grade, board, school, date_created, email) values (${note[0].title}, ${slug}, ${note[0].note_content}, ${note[0].subject}, ${note[0].grade}, ${note[0].board}, ${note[0].school}, ${note[0].date_created}, ${email}) returning *`;

	if (query.length > 0) {
		return query[0];
	} else {
		return false;
	}
}

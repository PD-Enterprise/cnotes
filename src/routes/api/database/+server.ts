import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from '../../../db.server';
import { newCookie } from '$lib/utils/newCookieUtil';

/**
 * API endpoint handler for database operations related to user sessions
 *
 * @route POST /api/database
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with session update status
 */
export const POST: RequestHandler = async ({ request }) => {
	// Parse the request body
	const body = await request.json();

	// Check if user exists with the provided session_id
	const query = await sql`select * from users where session_id = ${body.session_id}`;

	if (query[0]) {
		// If user exists, generate new session cookie
		const headers = newCookie('Session_id');
		const cookieID = headers['Set-cookie'].split('=')[1].split(';')[0];

		// Update user's session_id in database with new cookie
		const updateSession =
			await sql`update users set session_id = ${cookieID} where session_id = ${body.session_id}`;

		// Return success response with new cookie headers
		return json({ status: 200, data: headers, message: 'success' }, { headers: headers });
	} else {
		// Return error if user not found
		return json({ status: 500, data: query, message: 'error' });
	}
};

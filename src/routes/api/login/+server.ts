import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from '../../../db.server';
import stringHash from 'string-hash';
import { newCookie } from '$lib/utils/newCookieUtil';
import { returnJson } from '$lib/utils/returnJsonUtil';

/**
 * POST endpoint handler for user login
 * @route POST /api/login
 * @param {Request} request - The incoming request object containing email and password
 * @returns {Promise<Response>} JSON response with login status and session data
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		const userExists = await checkUserExists(body.email);
		return userExists ? loginUser(body) : returnJson('error', 'user not found.', userExists);
	} catch (error) {
		return returnJson('error', 'Something went wrong.', error);
	}
};

/**
 * Checks if a user exists in the database
 * @param {string} email - The email address to check
 * @returns {Promise<boolean>} True if user exists, false otherwise
 */
async function checkUserExists(email: string) {
	const checkUser = await sql`select * from users where email = ${email}`;
	if (checkUser[0]) {
		return true;
	} else {
		return false;
	}
}

/**
 * Authenticates user credentials and creates a new session
 * @param {Object} body - Request body containing user credentials
 * @param {string} body.email - User's email address
 * @param {string} body.password - User's password
 * @returns {Promise<Response>} JSON response with session data or error message
 */
async function loginUser(body: any) {
	const userPassword = await sql`select * from users where email = ${body.email}`;

	if (userPassword[0].user_password == stringHash(body.password)) {
		const result = await createNewSession(body);
		if ('cookieID' in result) {
			return returnJson('success', 'success', result.cookieID, result.headers);
		}
		return result;
	} else {
		return returnJson('error', 'invalid credentials.', userPassword);
	}
}

/**
 * Creates a new session for authenticated user
 * @param {Object} body - Request body containing session information
 * @param {string} body.session_id - Current session ID
 * @returns {Promise<Object>} Object containing new session headers and cookie ID
 */
async function createNewSession(body: any) {
	const headers = newCookie('Session_id');
	const cookieID = headers['Set-cookie'].split('=')[1].split(';')[0];

	const updateSession =
		await sql`update users set session_id = ${cookieID} where email = ${body.email}`;

	return { headers, cookieID };
}

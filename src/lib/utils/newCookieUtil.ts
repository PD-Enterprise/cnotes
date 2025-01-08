import * as cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new HTTP cookie with a UUID value
 *
 * @param {string} name - The name of the cookie to create
 * @returns {object} Headers object containing the Set-Cookie header
 */
export function newCookie(name: string) {
	// Generate a new UUID for the cookie value
	const cookieID = uuidv4();

	// Create headers object with cookie configuration
	const headers = {
		'Set-cookie': cookie.serialize(name, cookieID, {
			httpOnly: true, // Prevents JavaScript access to cookie
			secure: true, // Only sent over HTTPS
			sameSite: 'strict', // Strict same-site policy
			path: '/', // Cookie available for entire site
			maxAge: 60 * 60 * 24 * 30 // Cookie expires in 30 days
		})
	};
	return headers;
}

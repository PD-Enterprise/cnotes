import { json } from '@sveltejs/kit';

/**
 * Handles the GET request to retrieve a specific cookie value.
 *
 * @param {RequestEvent} event - The event object containing the request.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response.
 */
export async function GET({ request }) {
	try {
		// Retrieve the 'cookie' header from the request.
		const cookies = request.headers.get('cookie');

		// If no cookies are found, return a 404 error response.
		if (!cookies) {
			return json({ message: 'No cookies found' }, { status: 404 });
		} else {
			// Parse the cookies into a more manageable format.
			const parsedCookies = Object.fromEntries(
				cookies.split('; ').map((cookie) => {
					// Split each cookie into its name and value, decode the value, and return as an array.
					const [name, value] = cookie.split('=');
					return [name, decodeURIComponent(value)];
				})
			);

			// Retrieve the value of the 'Session_id' cookie.
			const cookieValue = parsedCookies.Session_id;

			// If the 'Session_id' cookie is found, return a success response with its value.
			if (cookieValue) {
				return json({ status: 200, message: 'success', cookieValue });
			} else {
				// If the 'Session_id' cookie is not found, return a 404 error response.
				return json({ message: 'Cookie not found', status: 404 });
			}
		}
	} catch (error) {
		// If an error occurs during processing, return a 500 error response.
		return json({ message: 'Internal Server Error', status: 500 });
	}
}

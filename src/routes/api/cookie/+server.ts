import { json } from '@sveltejs/kit';

export async function GET({ request }) {
    try {
        const cookies = request.headers.get('cookie');

        if (!cookies) {
            return json({ message: 'No cookies found' }, { status: 404 });
        } else {
            const parsedCookies = Object.fromEntries(cookies.split('; ').map(cookie => {
                const [name, value] = cookie.split('=');
                return [name, decodeURIComponent(value)];
            }));

            const cookieValue = parsedCookies.Session_id;

            if (cookieValue) {
                return json({ status: 200, message: "success", cookieValue });
            } else {
                return json({ message: 'Cookie not found', status: 404 });
            }
        }
    } catch (error) {
        return json({ message: 'Internal Server Error', status: 500 });
    }
}

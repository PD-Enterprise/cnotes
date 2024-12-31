import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from '../../../db.server';
import { newCookie } from '$lib/utils/newCookieUtil';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const query = await sql`select * from users where session_id = ${body.session_id}`;
    if (query[0]) {
        const headers = newCookie('Session_id');
        const cookieID = headers['Set-cookie'].split('=')[1].split(';')[0];

        const updateSession = await sql`update users set session_id = ${cookieID} where session_id = ${body.session_id}`;
        return json({ status: 200, data: headers, message: 'success' }, { headers: headers });
    } else {
        return json({ status: 500, data: query, message: 'error' });
    }
}
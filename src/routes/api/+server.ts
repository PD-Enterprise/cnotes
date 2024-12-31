import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from '../../db.server';

export const GET: RequestHandler = async ({ request }) => {
    const query = await sql`SELECT * FROM posts`;
    if (query) {
        return json({ status: 200, data: query, message: "success" });
    } else {
        return json({ status: 500, data: query, message: "error" });
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const query = await sql`SELECT * FROM posts WHERE slug = ${body.slug}`;
    if (query) {
        return json({ status: 200, data: query, message: "success" });
    } else {
        return json({ status: 500, data: query, message: "error" });
    }
}
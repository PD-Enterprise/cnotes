import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma.server';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const users = await prisma.users.findMany();
        return json({ users });
    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Failed to connect to database',
            fullError: error,
            name: error.name,
            message: error.message,
            code: error.code,
            meta: error.meta
        }), { status: 500 });
    }
}
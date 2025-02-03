import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/utils/prisma.server';

export const GET: RequestHandler = async ({ url }) => {
    const users = await prisma.users.findMany();
    return json({ users });
}
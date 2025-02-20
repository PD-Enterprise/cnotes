import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (({ params }) => {
    if (!params.noteslug) {
        throw error(404, 'Note not found');
    }

    return {
        slugData: {
            slug: params.noteslug
        }
    };
}) satisfies PageServerLoad;

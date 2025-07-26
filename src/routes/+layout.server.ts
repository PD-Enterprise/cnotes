import { buildClerkProps } from 'svelte-clerk/server';

export const load = async ({ locals }) => {
    return {
        ...buildClerkProps(locals.auth())
    };
};
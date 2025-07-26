import { CLERK_SECRET_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from "clerk-sveltekit/server"

export const handle: Handle = sequence(
    async ({ event, resolve }) => {
        // Define the path pattern you want to exclude from protection
        const publicSharingPathPattern = /^\/home\/[^/]+\/sharing\/?$/;

        // Check if the current URL matches the public sharing path pattern
        if (publicSharingPathPattern.test(event.url.pathname)) {
            // If it's the public sharing page, resolve the request without Clerk protection
            return resolve(event);
        }

        // Otherwise, proceed with the Clerk handler
        return handleClerk(CLERK_SECRET_KEY, {
            // debug: true,
            protectedPaths: ['/home'], // Or more specific paths if you have them
            signInUrl: '/sign-in',
        })({ event, resolve });
    }
);
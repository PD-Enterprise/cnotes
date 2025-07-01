import config from "$lib/utils/apiConfig";
import { clerkClient } from "svelte-clerk/server";

export const load = async ({ locals }) => {
    const user = await clerkClient.users.getUser(locals.auth().userId)
    const email = user.emailAddresses[0].emailAddress

    const response = await fetch(`${config.apiUrl}notes/snotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    });
    const result = await response.json();

    if (result.status == 200) {
        return {
            data: result.data
        }
    } else {
        return {
            data: undefined
        }
    }
}

import { redirect } from "@sveltejs/kit";
import { clerkClient } from "svelte-clerk/server";
export const load = async ({ locals }) => {
    const { userId } = locals.auth()

    if (!userId) {
        redirect(302, "/")
    }

    const user = await clerkClient.users.getUser(userId)

    return {
        user: JSON.parse(JSON.stringify(user))
    }
}

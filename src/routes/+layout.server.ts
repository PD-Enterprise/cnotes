import { CLERK_SECRET_KEY } from "$env/static/private";
import jwt from "jsonwebtoken"

export const load = async ({ locals }) => {
    // console.log(locals)

    return {
        session: locals.session
    }
}
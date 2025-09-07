import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET, AUTH_TRUST_HOST } from "$env/static/private"
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"

export const { handle, signIn } = SvelteKitAuth({
    providers: [
        Google({
            clientId: AUTH_GOOGLE_ID,
            clientSecret: AUTH_GOOGLE_SECRET,
        })
    ],
    secret: AUTH_SECRET,
    trustHost: true,
})
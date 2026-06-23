import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET } from "$env/static/private"
import type { Provider } from "@auth/core/providers"
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"
import config from "./apiConfig"

const providers: Provider[] = [
    Google({
        clientId: AUTH_GOOGLE_ID,
        clientSecret: AUTH_GOOGLE_SECRET,
    })
]

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers,
    secret: AUTH_SECRET,
    trustHost: true,
    callbacks: {
        async signIn({ user }) {
            await fetch(`${config.apiUrl}users/new-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    name: user.name,
                    image: user.image
                })
            })

            return true
        }
    }
})
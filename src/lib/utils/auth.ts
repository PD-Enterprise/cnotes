import { AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET, AUTH_TRUST_HOST } from "$env/static/private"
import type { Provider } from "@auth/core/providers"
import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/sveltekit/providers/google"

const providers: Provider[] = [
    Google({
        clientId: AUTH_GOOGLE_ID,
        clientSecret: AUTH_GOOGLE_SECRET,
    })
]

export const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider()
        return { id: providerData.id, name: providerData.name }
    } else {
        return { id: provider.id, name: provider.name }
    }
})

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers,
    secret: AUTH_SECRET,
    trustHost: true,
})
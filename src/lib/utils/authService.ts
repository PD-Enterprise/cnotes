import { createAuth0Client } from "@auth0/auth0-spa-js";
import { user, isAuthenticated, popupOpen } from "$lib/stores/store.svelte";
import authConfig from "./authConfig"

async function createClient() {
    let auth0Client = await createAuth0Client({
        domain: authConfig.domain,
        clientId: authConfig.clientId,
    })

    return auth0Client;
}

async function loginWithPopup(client, options) {
    popupOpen.value = true;
    try {
        await client.loginWithPopup(options);

        user.value = await client.getUser();
        isAuthenticated.set(true);
    } catch (e) {
        // eslint-disable-next-line
        console.error(e);
    } finally {
        popupOpen.value = false;
    }
}

async function logout(client) {
    try {
        const logout = await client.logout({
            logoutParams: {
                returnTo: "/"
            }
        });
        isAuthenticated.set(false);
        return logout
    } catch (e) {
        console.error(e)
    }
}

const auth = {
    createClient,
    loginWithPopup,
    logout
};

export default auth;
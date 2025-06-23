import { Auth0Client, createAuth0Client } from "@auth0/auth0-spa-js";
import { user, isAuthenticated, popupOpen, sync, autoLogin } from "$lib/stores/store.svelte";
import authConfig from "./authConfig"
import config from "./apiConfig";

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
        localStorage.setItem('AutoLogin', 'true');
        autoLogin.value = true;
        localStorage.setItem('syncState', 'true');
        sync.set(true);
        const request = await fetch(`${config.apiUrl}user/new-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // @ts-expect-error
                email: user.value.email
            })
        });
        const result = await request.json();
    } catch (e) {
        // eslint-disable-next-line
        console.error(e);
    } finally {
        popupOpen.value = false;
    }
}

async function logout(client: Auth0Client) {
    try {
        const logout = await client.logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
        isAuthenticated.set(false);
        localStorage.setItem('isAuthenticated', 'false');
        autoLogin.value = false;
        localStorage.setItem('role', 'tier-1');
        sync.set(false);
        localStorage.setItem('syncState', 'false');
        localStorage.setItem('AutoLogin', 'false');
        localStorage.removeItem('user');
        // Remove all localStorage items that start with "note"
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('note')) {
                localStorage.removeItem(key);
            }
        });
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
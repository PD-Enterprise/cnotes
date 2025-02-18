import { loggedIn } from "$lib/stores/loggedIn";
import config from "./apiConfig";

/**
     * Function to renew the cookie.
     * This function sends a POST request to the '/api/database' endpoint with the session_id in the body.
     * If the response is successful, it sets the loggedIn store to true, sets the 'LoggedIn' item in localStorage to "true",
     * and sets the 'Email' item in sessionStorage to the email from the response data.
     */
export async function renewCookie(cookieValue: string) {
    const response = await fetch(`${config.apiUrl}users/renew_session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sessionId: cookieValue
        })
    });
    const result = await response.json();
    if (result.status == 200) {
        const cookie = result.headers['Set-cookie'].split(';')[0];
		document.cookie = `${cookie}; path=/`;
        loggedIn.set(true);
        sessionStorage.setItem("LoggedIn", true);
        sessionStorage.setItem("Email", result.data.email);
    } else {
        loggedIn.set(false);
    }
}
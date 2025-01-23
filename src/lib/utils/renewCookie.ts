import { loggedIn } from "$lib/stores/loggedIn";

/**
     * Function to renew the cookie.
     * This function sends a POST request to the '/api/database' endpoint with the session_id in the body.
     * If the response is successful, it sets the loggedIn store to true, sets the 'LoggedIn' item in localStorage to "true",
     * and sets the 'Email' item in sessionStorage to the email from the response data.
     */
async function renewCookie(cookieValue: string) {
    const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: cookieValue
        })
    });
    const result = await response.json();
    if (result.message == 'success') {
        loggedIn.set(true);
        localStorage.setItem('LoggedIn', "true");
        sessionStorage.setItem('Email', result.data.email);
    }
}

export default renewCookie;
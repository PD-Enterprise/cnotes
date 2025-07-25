import config from "$lib/utils/apiConfig";

export async function GET({ url, locals }) {
    if (locals.auth().userId) {
        const user = await locals.currentUser()
        const email = user.emailAddresses[0].emailAddress
        // console.log(email)

        const response = await fetch(`${config.apiUrl}notes/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });
        const result = await response.json();
        // console.log(result);

        if (result.status == 200) {
            return new Response(JSON.stringify(
                {
                    data: result.data
                }
            ))
        } else {
            return new Response(JSON.stringify(
                {
                    data: undefined
                }
            ))
        }
    } else {
        return new Response(JSON.stringify(
            {
                data: undefined
            }
        ))
    }
}
import config from "$lib/utils/apiConfig";
import type { note } from "../types";

export async function POST({ url, locals, request }) {
    const body = await request.json();
    // console.log(body.note);

    const session = await locals.getSession();
    if (!session) {
        return new Response(JSON.stringify(
            {
                status: 401
            }
        ))
    }

    const email = session.user.email

    try {
        const addNoteRequest = await fetch(`${config.apiUrl}notes/new-note/text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                note: body.note
            })
        });
        const result = await addNoteRequest.json();
        // console.log(result);

        return new Response(JSON.stringify(
            {
                status: 200
            }
        ))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(
            {
                status: 500
            }
        ))
    }
}
import config from "$lib/utils/apiConfig";
import type { note } from "../../types";

export async function POST({ url, locals, request }) {
    const body = await request.json();
    // console.log(body.note);

    try {
        const addNoteRequest = await fetch(`${config.apiUrl}notes/new-note/text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: locals.session.claims.userEmail,
                note: body.note
            })
        });
        const result = await addNoteRequest.json();
        console.log(result);

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
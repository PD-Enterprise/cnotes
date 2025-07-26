import config from "$lib/utils/apiConfig";

export async function GET({ url, locals }) {
    if (locals.session.userId) {
        const email = locals.session.claims.userEmail
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
export async function DELETE({ locals, request }) {
    const body = await request.json();
    if (!body) {
        return new Response(JSON.stringify(
            {
                status: 400
            }
        ))
    }
    const slug = body.note.title.replaceAll(' ', '-').toLowerCase();

    try {
        const deleteNoteRequest = await fetch(
            `${config.apiUrl}notes/note/${slug}/delete`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: locals.session.claims.userEmail })
            }
        );

        const result = await deleteNoteRequest.json();
        // console.log(result);

        if (result.status == 200) {
            return new Response(JSON.stringify(
                {
                    status: 200
                }
            ))
        } else {
            return new Response(JSON.stringify(
                {
                    status: 500
                }
            ))
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(
            {
                status: 500
            }
        ))
    }
}
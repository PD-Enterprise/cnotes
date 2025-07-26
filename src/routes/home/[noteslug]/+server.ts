import config from "$lib/utils/apiConfig";

export async function GET({ url, locals }) {
    const slug = url.pathname.split('/home/')[1].split('/sharing')[0];

    try {
        const response = await fetch(`${config.apiUrl}notes/note/${slug}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
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
                    message: "coudln't fetch note data."
                }
            ))
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(
            {
                message: "Could not fetch note data. Probably a server error."
            }
        ))
    }
}
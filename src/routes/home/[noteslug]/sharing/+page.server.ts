import config from "$lib/utils/apiConfig";

export const load = async ({ locals, params }) => {
    const slug = params.noteslug

    const response = await fetch(`${config.apiUrl}notes/note/${slug}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    // console.log(result);

    if (result.status == 200) {
        return {
            data: result.data
        }
    } else {
        return {
            data: undefined
        }
    }
}
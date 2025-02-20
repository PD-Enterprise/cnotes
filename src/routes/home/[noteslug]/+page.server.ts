import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.noteslug;
    console.log(slug)
    return { slug }
}

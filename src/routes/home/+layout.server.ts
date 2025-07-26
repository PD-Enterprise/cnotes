import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
    // const { userId } = locals.auth()

    // console.log(url)
    const isSharingPage = url.pathname.endsWith('/sharing')
    // console.log(isSharingPage)

    // if (!userId && !isSharingPage) {
    // redirect(302, "/")
    // }

    return {
    }
}

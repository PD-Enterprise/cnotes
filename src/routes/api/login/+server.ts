import { json, type RequestHandler } from "@sveltejs/kit"
import { sql } from "../../../db.server";
import stringHash from "string-hash";
import { newCookie } from "$lib/utils/newCookieUtil";
import { returnJson } from "$lib/utils/returnJsonUtil";

//@ts-ignore
export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    try {
        const userExists = await checkUserExists(body.email);
        return userExists ? loginUser(body) : returnJson("error", "user not found.", userExists);
    } catch (error) {
        return returnJson("error", "Something went wrong.", error);
    }
}

async function checkUserExists(email: string) {
    const checkUser = await sql`select * from users where email = ${email}`;
    if (checkUser[0]) {
        return true;
    } else {
        return false;
    }
}

async function loginUser(body: any) {
    const userPassword = await sql`select * from users where email = ${body.email}`;

    if (userPassword[0].user_password == stringHash(body.password)) {
        const { headers, cookieID } = await createNewSession(body);
        return returnJson("success", "success", cookieID, headers);
    } else {
        return returnJson("error", "invalid credentials.", userPassword);
    }
}

async function createNewSession(body: any) {
    const headers = newCookie("Session_id");
    const cookieID = headers["Set-cookie"].split("=")[1].split(";")[0];

    if (!body.session_id) {
        console.error("No session_id provided.");
        return returnJson("error", "session_id is required.", null);
    }

    const updateSession = await sql`update users set session_id = ${cookieID} where session_id = ${body.session_id}`;

    return { headers, cookieID }
}
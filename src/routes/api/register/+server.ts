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
        return userExists
            ? returnJson("error", "User already exists.", userExists)
            : await registerUser(body);
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

async function registerUser(body: any) {
    const headers = newCookie("Session_id");
    const cookieID = headers["Set-cookie"].split("=")[1].split(";")[0];

    const response = await sql`insert into users (name, email, user_password, session_id, membership)
    values (${body.username}, ${body.email}, ${stringHash(body.password)}, ${cookieID}, ${"tier-1"})`;

    return returnJson("success", "New user created.", response, headers);
}
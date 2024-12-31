import { json } from "@sveltejs/kit";

export function returnJson(status: string, message: string, response: any, headers?: any) {
    return json({ status: status, message: message, response: response }, { headers: headers });
}
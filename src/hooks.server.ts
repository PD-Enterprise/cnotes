export { handle } from "./lib/utils/auth"
import { AUTH_GOOGLE_ID, AUTH_SECRET, AUTH_GOOGLE_SECRET, AUTH_TRUST_HOST, AUTH_URL } from "$env/static/private";

console.log("AUTH_SECRET:", AUTH_SECRET);
console.log("AUTH_GOOGLE_ID:", AUTH_GOOGLE_ID);
console.log("AUTH_GOOGLE_SECRET:", AUTH_GOOGLE_SECRET);
console.log("AUTH_TRUST_HOST:", AUTH_TRUST_HOST);
console.log("AUTH_URL:", AUTH_URL);
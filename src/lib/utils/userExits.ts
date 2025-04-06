import { sql } from '../../db.server';

async function checkIfUserExists(email: string) {
	const query = await sql`select * from users where email = ${email}`;
	if (query && query.length > 0) {
		return true;
	} else {
		return false;
	}
}

export { checkIfUserExists };

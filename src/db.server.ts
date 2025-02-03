import { neon } from '@neondatabase/serverless';

const connectionString: string =
	import.meta.env.VITE_DATABASE_URL;

const sql = neon(connectionString);
export { sql };

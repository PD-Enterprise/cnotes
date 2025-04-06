import { neon } from '@neondatabase/serverless';
import { sql } from '../../db.server';

const query = await sql`select * from apikeys where key_name = 'CnotesDatabase'`;
const connectionString: string = query[0].api_key;

const notesSql = neon(connectionString);
export { notesSql };

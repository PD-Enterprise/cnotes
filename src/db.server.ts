import { neon } from '@neondatabase/serverless';

const connectionString: string =
	'postgresql://neondb_owner:6HBpU3GFrvwN@ep-broad-surf-a1mc50uh.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const sql = neon(connectionString);
export { sql };

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		
		if (!file) {
			return json({ error: 'No file uploaded' }, { status: 400 });
		}

		// Generate a unique filename
		const ext = file.name.split('.').pop();
		const filename = `${uuidv4()}.${ext}`;
		
		// Create uploads directory if it doesn't exist
		const uploadDir = join(process.cwd(), 'static', 'uploads');
		await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
		
		// Return the URL of the uploaded file
		return json({
			location: `/uploads/${filename}`
		});
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Upload failed' }, { status: 500 });
	}
}; 
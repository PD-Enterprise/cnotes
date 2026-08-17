import type { OCRStreamChunk } from '$lib/types';
import config from '$lib/utils/apiConfig';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function getOcr(file: File | undefined, onChunk: (chunk: OCRStreamChunk) => void) {
	if (!file) {
		throw new Error('No file selected');
	}
	if (!ALLOWED_TYPES.includes(file.type)) {
		throw new Error('Only JPEG, PNG, and WebP files are accepted');
	}
	if (file.size >= MAX_FILE_SIZE) {
		throw new Error('File must be smaller than 20MB');
	}

	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch(`${config.apiUrl}beav-ocr/upload`, {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		const result: { error?: string } = await response.json();
		throw new Error(result.error ?? `Request failed with status ${response.status}`);
	}

	if (!response.body) {
		throw new Error('No response body');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });

		const lines = buffer.split('\n');
		buffer = lines.pop() || '';

		for (const line of lines) {
			if (!line.trim()) continue;
			try {
				const json = JSON.parse(line);
				onChunk(json);
			} catch (err) {
				console.error('JSON parse error:', err, line);
			}
		}
	}
}

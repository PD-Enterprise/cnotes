import config from '$lib/utils/apiConfig';

export async function uploadImage(imageBase64: string, publicId: string): Promise<string> {
	const response = await fetch(`${config.apiUrl}cnotes/upload-image`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ image: imageBase64, publicId })
	});

	const result = await response.json();

	if (!response.ok || result.status !== 200) {
		throw new Error(result.message || 'Image upload failed');
	}

	return result.data.url;
}

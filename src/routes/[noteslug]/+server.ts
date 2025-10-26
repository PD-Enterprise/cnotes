import config from '$lib/utils/apiConfig';

export async function GET({ url, locals }) {
	const slug = url.pathname.split('/')[1];
	// console.log(slug)

	try {
		const response = await fetch(`${config.apiUrl}notes/note/${slug}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		// console.log(result);

		if (result.status == 200) {
			// console.log(result.data);
			return new Response(
				JSON.stringify({
					status: 200,
					data: result.data
				})
			);
		} else {
			return new Response(
				JSON.stringify({
					status: result.status,
					message: "coudln't fetch note data."
				})
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				message: 'Could not fetch note data. Probably a server error.'
			})
		);
	}
}

export async function POST({ locals, request }) {
	const body = await request.json();
	if (!body) {
		return new Response(
			JSON.stringify({
				status: 400
			})
		);
	}
	const noteData = body.data;

	const session = await locals.getSession();
	if (!session) {
		return new Response(
			JSON.stringify({
				status: 401
			})
		);
	}

	const email = session.user.email;
	const response = await fetch(`${config.apiUrl}notes/note/text/${noteData.slug}/update`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			data: noteData
		})
	});
	const result = await response.json();
	// console.log(result);

	if (result.status !== 200) {
		return new Response(
			JSON.stringify({
				status: result.status
			})
		);
	}

	return new Response(
		JSON.stringify({
			status: 200
		})
	);
}

import type { returnData } from '../../routes/interfaces';

export function returnJson(status: number, message: string, data: any, error: any) {
	return new Response(
		JSON.stringify({
			status: status,
			message: message,
			data: data,
			error: error
		})
	);
}

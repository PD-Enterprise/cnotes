import type { functionReturnData } from '../../routes/interfaces';

export function functionReturn(
	successState: boolean,
	errorState: boolean,
	message: string,
	data: any = null,
	error: any = null
) {
	return [successState, errorState, message, data, error];
}

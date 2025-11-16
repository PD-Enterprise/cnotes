export const toTitleCase = (str: string) => {
	return str
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.trim()
		.replace(/^./, (str) => str.toUpperCase());
};

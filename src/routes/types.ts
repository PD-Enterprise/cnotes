type note = {
	note_id: number;
	title: string;
	slug: string;
	notescontent: string;
	subject: string;
	grade: number;
	email: string;
	board: string;
	school: string;
	date_created: string;
	date_updated: string;
};

type searchResult = {
	title: string;
	slug: string;
};

export type { note, searchResult };
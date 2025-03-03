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
	dateCreated: string;
	dateUpdated: string;
};

type searchResult = {
	title: string;
	slug: string;
};

export type { note, searchResult };
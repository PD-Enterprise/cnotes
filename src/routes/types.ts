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
type userType = {
	email: string;
	email_verified: boolean;
	family_name: string;
	given_name: string;
	name: string;
	nickname: string;
	picture: string;
	sub: string;
	updated_at: string;
}

export type { note, searchResult, userType };
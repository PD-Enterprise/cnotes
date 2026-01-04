export type note = {
	noteId?: number;
	title: string;
	slug?: string;

	content: string;

	dateCreated: string;
	dateUpdated: string;
	academicLevel: string;
	topic: string;

	type: string;
	visibility: string;
	year: string;
	language: string;
	keywords: string;
};

export type searchResult = {
	title: string;
	slug: string;
};
export type userType = {
	email: string;
	email_verified: boolean;
	family_name: string;
	given_name: string;
	name: string;
	nickname: string;
	picture: string;
	sub: string;
	updated_at: string;
};

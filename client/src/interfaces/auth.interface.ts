export interface RegisterInterface {
	first_name: string,
	last_name: string,
	email_id: string,
	phone_number: string,
	password: string,
	role: string,
}

export interface LoginInterface {
	email_id: string,
	password: string,
}
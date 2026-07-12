export interface GetAgencyInterface {
	id: string,
	name: string,
	slug: string,
	description: string,
	logo: string,
	email_id: string,
	phone_number: string,
	website: string,
	address: string,
	city: string,
	state: string,
	country: string,
	is_active: boolean,
	password: string,
	created_at: string,
	updated_at: string,
	owner_id: string,
}

export interface CreateAgencyInterface {
	name: string,
	slug?: string,
	description?: string,
	email_id: string,
	phone_number: string,
	password: string,
	website?: string,
	address: string,
	city: string,
	state: string,
	country: string,
	is_active: boolean,
	user_id: string,
}

export interface UpdateAgencyData {
	name?: string,
	slug?: string,
	description?: string,
	email_id?: string,
	phone_number?: string,
	password?: string,
	website?: string,
	address?: string,
	city?: string,
	state?: string,
	country?: string,
	is_active?: boolean,
	user_id?: string,
}

export interface GetAgencyParams {
	agency_id?: string,
	user_id?: string,
	email_id?: string
}
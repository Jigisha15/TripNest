import type { GetAgencyInterface } from "./agency.interface";
import type { GetBookingInterface } from "./booking.interface";

export interface GetUserInterface {
	id: string,
	first_name: string,
	last_name: string,
	email_id: string,
	phone_number: string,
	password: string,
	role: string,
	profile_image: string | File | null,
	created_at: string,
	updated_at: string,
	bookings: GetBookingInterface,
	agencies: GetAgencyInterface
}

export interface UpdateUserData {
	first_name?: string,
	last_name?: string,
	email_id?: string,
	phone_number?: string,
	password?: string,
	role?: string,
	profile_image?: string | File | null,
}

export interface GetUserParams {
	user_id?: string;
	email_id?: string;
}
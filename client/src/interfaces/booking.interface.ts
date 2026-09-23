export interface GetBookingInterface {
	id: string,
	total_amount: number,
	booking_status: string
	payment_status: string
	special_request: string
	booked_at: string,
	created_at: string,
	updated_at: string,
	user_id: string,
	trip_id: string,
	reviews: any[],
	cancellation: any,
	trip: {
		title: string,
		end_date: string
	}
}

export interface CretaeBookingInterface {
	total_amount: number,
	special_request: string,
	user_id: string,
	trip_id: string
}

export interface UpdateBookingInterface {
	total_amount?: number,
	booking_status?: string,
	payment_status?: string,
	special_request?: string,
	user_id?: string,
	trip_id: string
}

export interface GetBookingParams {
	id?: string
	user_id?: string,
	trip_id?: string,
}
export interface GetItineraryParams {
	id?: string,
	trip_id?: string
}

export interface GetItineraryInterface {
	id: string,
	day_number: number,
	title: string,
	description: string
	created_at: string,
	updated_at: string,
	trip_id: string
}

export interface CreateItineraryItemInterface {
	day_number: string,
	title: string,
	description?: string,
}

export interface CreateItineraryInterface {
	trip_id: string,
	itineraries: CreateItineraryItemInterface[]
}

export interface UpdateItineraryItemInterface {
	id: string,
	day_number: string,
	title: string,
	description?: string
}

export interface UpdateItineraryInterface {
	itineraries: UpdateItineraryItemInterface[]
}

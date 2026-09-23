export interface GetItineraryParams {
	id?: string;
	trip_id?: string;
}

export interface ItineraryItemInterface {
	id: string;
	title: string;
	description: string | null;
	sequence: number;
	itinerary_id: string;
	created_at: string;
	updated_at: string;
}

export interface GetItineraryInterface {
	id: string;
	type: "DAY" | "NIGHT";
	day_number: number | null;
	night_number: number | null;
	title: string;
	description: string | null;
	created_at: string;
	updated_at: string;
	trip_id: string;
	items: ItineraryItemInterface[];
}


// ================= CREATE =================
export interface ItineraryItemValidation {
	title: string;
	description?: string | null;
}

export type ItineraryValidation =
	| {
		type: "DAY";
		day_number: number;
		night_number?: never;
		title: string;
		description?: string | null;
		items: ItineraryItemValidation[];
	}
	| {
		type: "NIGHT";
		night_number: number;
		day_number?: never;
		title: string;
		description?: string | null;
		items: ItineraryItemValidation[];
	};

export interface CreateItineraryInterface {
	trip_id: string;
	itineraries: ItineraryValidation[];
}

// ================= UPDATE =================
export interface UpdateItineraryItemInterface {
	id?: string;
	title: string;
	description?: string | null;
}

export interface UpdateItinerarySection {
	id?: string;
	type: "DAY" | "NIGHT";
	day_number?: number;
	night_number?: number;
	title: string;
	description?: string | null;
	items: UpdateItineraryItemInterface[];
}

export interface UpdateItineraryInterface {
	itineraries: UpdateItinerarySection[];
}
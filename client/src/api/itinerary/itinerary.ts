import type { CreateItineraryInterface, GetItineraryParams, UpdateItineraryInterface } from "../../interfaces/itinerary.interface";
import { api } from "../axios";

export const getItinerary = async (params?: GetItineraryParams) => {
	const response = await api.get("/itinerary/get", {
		params,
	});
	return response.data;
};

export const createItinerary = async (data: CreateItineraryInterface) => {
	const response = await api.post("/itinerary/create", data)
	return response.data
}

export const updateItinerary = async (trip_id: string, data: Partial<UpdateItineraryInterface>) => {
	const response = await api.patch(`/itinerary/update/${trip_id}`, data)
	return response.data
}

export const deleteItinerary = async (itinerary_id: string) => {
	const response = await api.delete(`/itinerary/delete/${itinerary_id}`)
	return response.data
}
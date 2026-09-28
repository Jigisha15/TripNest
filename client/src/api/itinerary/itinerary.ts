import type { CreateItineraryInterface, GetItineraryParams, UpdateItineraryInterface } from "../../interfaces/itinerary.interface";
import { api } from "../axios";

export const getItinerary = async (params?: GetItineraryParams) => {
	const token = localStorage.getItem("token");

	const response = await api.get(
		"/itinerary/get", {
		params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const createItinerary = async (data: CreateItineraryInterface) => {
	const token = localStorage.getItem("token");

	const response = await api.post(
		"/itinerary/create",
		data,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}

export const updateItinerary = async (trip_id: string, data: Partial<UpdateItineraryInterface>) => {
	const token = localStorage.getItem("token");

	const response = await api.patch(
		`/itinerary/update/${trip_id}`,
		data,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}

export const deleteItinerary = async (itinerary_id: string) => {
	const token = localStorage.getItem("token");

	const response = await api.delete(
		`/itinerary/delete/${itinerary_id}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}
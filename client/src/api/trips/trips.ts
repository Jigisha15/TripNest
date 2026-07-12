import type { CreateTripInterface, GetTripParams, UpdateTripInterface } from "../../interfaces/trips.interface";
import { api } from "../axios";

export const getTrip = async (params?: GetTripParams) => {
	const response = await api.get("/trip/get", {
		params,
	});
	return response.data;
};

export const createTrip = async (data: CreateTripInterface) => {
	const response = await api.post("/trip/create", data)
	return response.data
}

export const updateTrip = async (trip_id: string, data: UpdateTripInterface) => {
	const response = await api.patch(`/trip/update/${trip_id}`, data)
	return response.data
}

export const deleteTrip = async (trip_id: string) => {
	const response = await api.delete(`/trip/delete/${trip_id}`)
	return response.data
}
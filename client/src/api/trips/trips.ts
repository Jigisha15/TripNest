import type { CreateTripInterface, GetTripParams, UpdateTripInterface } from "../../interfaces/trips.interface";
import { api } from "../axios";

export const getTrip = async (params?: GetTripParams) => {
	const token = localStorage.getItem("token");

	const response = await api.get("/trip/get", {
		params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const createTrip = async (data: CreateTripInterface) => {
	const token = localStorage.getItem("token");

	const response = await api.post(
		"/trip/create",
		data,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}

export const updateTrip = async (trip_id: string, data: UpdateTripInterface) => {
	const token = localStorage.getItem("token");

	const response = await api.patch(
		`/trip/update/${trip_id}`,
		data,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}

export const deleteTrip = async (trip_id: string) => {
	const token = localStorage.getItem("token");

	const response = await api.delete(
		`/trip/delete/${trip_id}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}
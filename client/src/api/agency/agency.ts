import type { CreateAgencyInterface, GetAgencyParams, UpdateAgencyData } from "../../interfaces/agency.interface";
import { api } from "../axios";

export const getAgency = async (params?: GetAgencyParams) => {
	const token = localStorage.getItem("token");


	const response = await api.get("/agency/get", {
		params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const createAgency = async (data: CreateAgencyInterface) => {
	const token = localStorage.getItem("token");

	const response = await api.post(
		"/agency/create",
		data,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}

export const updateAgency = async (agency_id: string, data: UpdateAgencyData) => {
	const token = localStorage.getItem("token");

	const response = await api.patch(
		`/agency/update/${agency_id}`,
		data,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}

export const deleteAgency = async (agency_id: string) => {
	const token = localStorage.getItem("token");

	const response = await api.delete(
		`/agency/delete/${agency_id}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			}
		},
	)
	return response.data
}
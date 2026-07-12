import type { CreateAgencyInterface, GetAgencyParams, UpdateAgencyData } from "../../interfaces/agency.interface";
import { api } from "../axios";

export const getAgency = async (params?: GetAgencyParams) => {
	const response = await api.get("/agency/get", {
		params,
	});
	return response.data;
};

export const createAgency = async (data: CreateAgencyInterface) => {
	const response = await api.post("/agency/create", data)
	return response.data
}

export const updateAgency = async (agency_id: string, data: UpdateAgencyData) => {
	const response = await api.patch(`/agency/update/${agency_id}`, data)
	return response.data
}

export const deleteAgency = async (agency_id: string) => {
	const response = await api.delete(`/agency/delete/${agency_id}`)
	return response.data
}
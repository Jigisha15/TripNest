import type { GetUserParams, UpdateUserData } from "../../interfaces/user.inteface";
import { api } from "../axios";

export const getUser = async ({ email_id, user_id }: GetUserParams) => {
	const response = await api.get("/user/get", {
		params: {
			user_id,
			email_id
		}
	})
	return response.data
}

export const updateUser = async (user_id: string, data: Partial<UpdateUserData>) => {
	const response = await api.patch(`/user/update/${user_id}`, data)
	return response.data
}

export const deleteUser = async (user_id: string) => {
	const response = await api.delete(`/user/delete/${user_id}`)
	return response.data
}
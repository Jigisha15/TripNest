import type { LoginInterface, RegisterInterface } from "../../interfaces/auth.interface";
import { api } from "../axios";

export const register = async (registerData: RegisterInterface) => {
	const response = await api.post("/auth/register", registerData);
	return response.data;
}

export const login = async (loginData: LoginInterface) => {
	const response = await api.post("/auth/login", loginData);
	return response.data;
}
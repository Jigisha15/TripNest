import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login, register } from "./auth"

export const useRegister = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["auth-register"]
			})
		},
		onError: (error) => {
			console.error("Error while registration : ", error)
		}
	})
}

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: login,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["auth-login"]
			})
		},
		onError: (error) => {
			console.error("Error while logging in : ", error)
		}
	})
}
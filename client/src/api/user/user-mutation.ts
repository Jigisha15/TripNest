import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUser, updateUser } from "./user";
import type { GetUserParams, UpdateUserData } from "../../interfaces/user.inteface";

export const useGetUser = (params: GetUserParams) => {
	const enabled = !!params.user_id || !!params.email_id;

	return useQuery({
		queryKey: ["user", params.user_id, params.email_id],
		queryFn: () => getUser(params),
		enabled,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ user_id, updateData }: {
			user_id: string,
			updateData: Partial<UpdateUserData>
		}) => updateUser(user_id, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user"]
			})
		},
		onError: (error) => {
			console.error("Error updating user : ", error)
		}
	})
}

export const useDeleteUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (user_id: string) => deleteUser(user_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user"]
			})
		},
		onError: (error) => {
			console.log("Error deleting user : ", error)
		}
	})
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetAgencyParams, UpdateAgencyData } from "../../interfaces/agency.interface";
import { createAgency, deleteAgency, getAgency, updateAgency } from "./agency";

export const useGetAgency = (params?: GetAgencyParams) => {
	return useQuery({
		queryKey: ["agency", params],
		queryFn: () => getAgency(params),
	});
};

export const useCreateAgency = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createAgency,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["agency"]
			})
		},
		onError: (error) => {
			console.error("Error creating agency : ", error)
		}
	})
}

export const useUpdateAgency = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ agency_id, updateData }: {
			agency_id: string,
			updateData: Partial<UpdateAgencyData>
		}) => updateAgency(agency_id, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["agency"]
			})
		},
		onError: (error) => {
			console.error("Error updating agency : ", error)
		}
	})
}

export const useDeleteAgency = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (agency_id: string) => deleteAgency(agency_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["agency"]
			})
		},
		onError: (error) => {
			console.log("Error deleting agency : ", error)
		}
	})
}
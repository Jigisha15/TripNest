import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTrip, deleteTrip, getTrip, updateTrip } from "./trips";
import type { GetTripParams, UpdateTripInterface } from "../../interfaces/trips.interface";

export const useGetTrip = (params?: GetTripParams) => {
	return useQuery({
		queryKey: ["trip", params],
		queryFn: () => getTrip(params),
	});
};

export const useCreateTrip = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createTrip,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["trip"]
			})
		},
		onError: (error) => {
			console.error("Error creating trip : ", error)
		}
	})
}

export const useUpdateTrip = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ trip_id, updateData }: {
			trip_id: string,
			updateData: Partial<UpdateTripInterface>
		}) => updateTrip(trip_id, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["trip"]
			})
		},
		onError: (error) => {
			console.error("Error updating trip : ", error)
		}
	})
}

export const useDeleteTrip = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (trip_id: string) => deleteTrip(trip_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["trip"]
			})
		},
		onError: (error) => {
			console.log("Error deleting trip : ", error)
		}
	})
}
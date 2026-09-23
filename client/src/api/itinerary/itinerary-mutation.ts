import { type GetItineraryParams, type UpdateItineraryInterface } from './../../interfaces/itinerary.interface';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItinerary, deleteItinerary, getItinerary, updateItinerary } from './itinerary';

export const useGetItinerary = (params?: GetItineraryParams) => {
	return useQuery({
		queryKey: ["itinerary", params],
		queryFn: () => getItinerary(params),
	});
};

export const useCreateItinerary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createItinerary,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["itinerary"]
			})
		},
		onError: (error) => {
			console.error("Error creating itinerary : ", error)
		}
	})
}

export const useUpdateItinerary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ trip_id, updateData }: {
			trip_id: string,
			updateData: Partial<UpdateItineraryInterface>
		}) => updateItinerary(trip_id, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["itinerary"]
			})
		},
		onError: (error) => {
			console.error("Error updating itinerary : ", error)
		}
	})
}

export const useDeleteItinerary = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (itinerary_id: string) => deleteItinerary(itinerary_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["itinerary"]
			})
		},
		onError: (error) => {
			console.log("Error deleting itinerary : ", error)
		}
	})
}
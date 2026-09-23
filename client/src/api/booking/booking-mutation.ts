import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetBookingInterface, UpdateBookingInterface } from "../../interfaces/booking.interface";
import { createBooking, deleteBooking, getBooking, updateBooking } from "./booking";

export const useGetBooking = (params?: GetBookingInterface) => {
	return useQuery({
		queryKey: ["booking", params],
		queryFn: () => getBooking(params),
	});
};

export const useCreateBooking = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createBooking,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["booking"]
			})
		},
		onError: (error) => {
			console.error("Error creating booking : ", error)
		}
	})
}

export const useUpdateBooking = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ booking_id, updateData }: {
			booking_id: string,
			updateData: Partial<UpdateBookingInterface>
		}) => updateBooking(booking_id, updateData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["booking"]
			})
		},
		onError: (error) => {
			console.error("Error updating booking : ", error)
		}
	})
}

export const useDeleteBooking = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (booking_id: string) => deleteBooking(booking_id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["booking"]
			})
		},
		onError: (error) => {
			console.log("Error deleting booking : ", error)
		}
	})
}
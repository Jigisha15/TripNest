import type { CretaeBookingInterface, GetBookingParams, UpdateBookingInterface } from "../../interfaces/booking.interface";
import { api } from "../axios";

// get all booking
export const getBooking = async (params?: GetBookingParams) => {
	const response = await api.get("/booking/get", {
		params,
	});
	return response.data;
};

// create booking
export const createBooking = async (data: CretaeBookingInterface) => {
	const response = await api.post("/booking/create", data)
	return response.data
}

// update booking
export const updateBooking = async (booking_id: string, data: Partial<UpdateBookingInterface>) => {
	const response = await api.patch(`/booking/update/${booking_id}`, data)
	return response.data
}

// delete booking
export const deleteBooking = async (booking_id: string) => {
	const response = await api.delete(`/booking/delete/${booking_id}`)
	return response.data
}

// verify booking
export const verifyBookingPayment = async (
	data: {
		booking_id: string;
		razorpay_payment_id: string;
		razorpay_order_id: string;
		razorpay_signature: string;
	}
) => {

	const response = await api.post(
		"/booking/verify",
		data
	);

	return response.data;
};
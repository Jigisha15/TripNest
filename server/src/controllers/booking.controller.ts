import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateBookingValidation, UpdateBookingValidation } from "../validations/booking.validation";

// get
export const getBooking = async (req: Request, res: Response) => {
	const { id, user_id, trip_id } = req.query;

	try {

		const reviews = await prisma.review.findMany({
			where: {
				...(trip_id && {
					trip_id: trip_id as string,
				}),
				...(user_id && {
					user_id: user_id as string,
				}),
				...(id && {
					id: id as string,
				}),
			},
		});

		// return response
		return res.status(200).json({
			success: true,
			message: reviews.length > 0 ? "Data fetched successfully." : "No bookings exist.",
			data: reviews
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error
		})
	}
};

// create
export const createBooking = async (req: Request, res: Response) => {
	try {
		// Validate payload
		const { error, value } = CreateBookingValidation.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload",
				error,
			});
		}

		// Check user
		const existingUser = await prisma.user.findUnique({
			where: {
				id: value.user_id,
			},
		});

		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Check trip
		const existingTrip = await prisma.trip.findUnique({
			where: {
				id: value.trip_id,
			},
		});

		if (!existingTrip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found",
			});
		}

		// Check booking deadline
		if (new Date() > existingTrip.booking_deadline) {
			return res.status(400).json({
				success: false,
				message: "Booking deadline has passed.",
			});
		}

		// Prevent duplicate booking
		const existingBooking = await prisma.booking.findFirst({
			where: {
				user_id: value.user_id,
				trip_id: value.trip_id,
			},
		});

		if (existingBooking) {
			return res.status(409).json({
				success: false,
				message: "User already booked this trip.",
			});
		}

		// Calculate seats required
		const seatsRequired =
			value.number_of_adults + (value.number_of_children ?? 0);

		// Check seat availability
		if (existingTrip.available_seats < seatsRequired) {
			return res.status(400).json({
				success: false,
				message: "Not enough seats available.",
			});
		}

		// Calculate amount
		const tripPrice = Number(existingTrip.price);

		const totalAmount =
			tripPrice * value.number_of_adults +
			tripPrice * (value.number_of_children ?? 0);

		// Transaction
		const booking = await prisma.$transaction(async (tx) => {
			const newBooking = await tx.booking.create({
				data: {
					number_of_adults: value.number_of_adults,
					number_of_children: value.number_of_children,
					total_amount: totalAmount,
					booking_status: value.booking_status,
					payment_status: value.payment_status,
					special_request: value.special_request,
					booked_at: value.booked_at,
					user_id: value.user_id,
					trip_id: value.trip_id,
				},
			});

			await tx.trip.update({
				where: {
					id: value.trip_id,
				},
				data: {
					available_seats: {
						decrement: seatsRequired,
					},
				},
			});

			return newBooking;
		});

		return res.status(201).json({
			success: true,
			message: "Booking created successfully.",
			data: booking,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

// update
export const updateBooking = async (req: Request, res: Response) => {
	const booking_id = req.params.id;

	try {
		// Validate payload
		const { error, value } = UpdateBookingValidation.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload",
				error,
			});
		}

		// Existing booking
		const existingBooking = await prisma.booking.findUnique({
			where: {
				id: booking_id as string,
			},
			include: {
				trip: true,
			},
		});

		if (!existingBooking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found",
			});
		}

		// Check user
		const existingUser = await prisma.user.findUnique({
			where: {
				id: value.user_id,
			},
		});

		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Check trip
		const existingTrip = await prisma.trip.findUnique({
			where: {
				id: value.trip_id,
			},
		});

		if (!existingTrip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found",
			});
		}

		// Check active
		if (!existingTrip.is_active) {
			return res.status(400).json({
				success: false,
				message: "Trip is inactive.",
			});
		}

		// Booking deadline
		if (new Date() > existingTrip.booking_deadline) {
			return res.status(400).json({
				success: false,
				message: "Booking deadline has passed.",
			});
		}

		const oldSeats =
			existingBooking.number_of_adults +
			(existingBooking.number_of_children ?? 0);

		const newSeats =
			value.number_of_adults +
			(value.number_of_children ?? 0);

		const seatDifference = newSeats - oldSeats;

		// Check seat availability only if increasing seats
		if (seatDifference > 0 && existingTrip.available_seats < seatDifference) {
			return res.status(400).json({
				success: false,
				message: "Not enough seats available.",
			});
		}

		const totalAmount =
			Number(existingTrip.price) * newSeats;

		const updatedBooking = await prisma.$transaction(async (tx) => {

			// Same trip
			if (existingBooking.trip_id === value.trip_id) {

				if (seatDifference > 0) {
					await tx.trip.update({
						where: {
							id: value.trip_id,
						},
						data: {
							available_seats: {
								decrement: seatDifference,
							},
						},
					});
				}

				if (seatDifference < 0) {
					await tx.trip.update({
						where: {
							id: value.trip_id,
						},
						data: {
							available_seats: {
								increment: Math.abs(seatDifference),
							},
						},
					});
				}

			} else {

				// Restore seats to old trip
				await tx.trip.update({
					where: {
						id: existingBooking.trip_id,
					},
					data: {
						available_seats: {
							increment: oldSeats,
						},
					},
				});

				// Deduct seats from new trip
				await tx.trip.update({
					where: {
						id: value.trip_id,
					},
					data: {
						available_seats: {
							decrement: newSeats,
						},
					},
				});
			}

			return await tx.booking.update({
				where: {
					id: booking_id as string,
				},
				data: {
					number_of_adults: value.number_of_adults,
					number_of_children: value.number_of_children,
					total_amount: totalAmount,
					booking_status: value.booking_status,
					payment_status: value.payment_status,
					special_request: value.special_request,
					booked_at: value.booked_at,
					user_id: value.user_id,
					trip_id: value.trip_id,
				},
			});
		});

		return res.status(200).json({
			success: true,
			message: "Booking updated successfully.",
			data: updatedBooking,
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error,
		});
	}
};

// delete
export const deleteBooking = async (req: Request, res: Response) => {
	const booking_id = req.params.id;

	try {
		// Check if booking exists
		const existingBooking = await prisma.booking.findUnique({
			where: {
				id: booking_id as string,
			},
		});

		if (!existingBooking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found.",
			});
		}

		// Calculate seats to restore
		const seatsToRestore =
			existingBooking.number_of_adults +
			(existingBooking.number_of_children ?? 0);

		// Transaction
		await prisma.$transaction(async (tx) => {
			// Restore seats
			await tx.trip.update({
				where: {
					id: existingBooking.trip_id,
				},
				data: {
					available_seats: {
						increment: seatsToRestore,
					},
				},
			});

			// Delete booking
			await tx.booking.delete({
				where: {
					id: booking_id as string,
				},
			});
		});

		return res.status(200).json({
			success: true,
			message: "Booking deleted successfully.",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error,
		});
	}
};
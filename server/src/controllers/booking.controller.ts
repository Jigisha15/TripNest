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

		// Check whether trip is active
		if (!existingTrip.is_active) {
			return res.status(400).json({
				success: false,
				message: "This trip is no longer active.",
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
		const existingBooking = await prisma.booking.findUnique({
			where: {
				user_id_trip_id: {
					user_id: value.user_id,
					trip_id: value.trip_id,
				},
			},
		});

		if (existingBooking) {
			return res.status(409).json({
				success: false,
				message: "User already booked this trip.",
			});
		}

		// Since one booking represents one person,
		// every booking requires exactly one seat.
		if (existingTrip.available_seats <= 0) {
			return res.status(400).json({
				success: false,
				message: "No seats available for this trip.",
			});
		}

		// Use discounted price if applicable
		const totalAmount =
			Number(existingTrip.discount_price) > 0
				? Number(existingTrip.discount_price)
				: Number(existingTrip.price);

		// Transaction
		const booking = await prisma.$transaction(async (tx) => {
			const newBooking = await tx.booking.create({
				data: {
					total_amount: totalAmount,
					booking_status: value.booking_status,
					payment_status: value.payment_status,
					special_request: value.special_request,
					booked_at: new Date(),
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
						decrement: 1,
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
		console.error("Create booking error:", error);

		return res.status(500).json({
			success: false,
			message: "Internal server error",
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

		// Find existing booking
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

		// Check new trip
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

		// Check if trip is active
		if (!existingTrip.is_active) {
			return res.status(400).json({
				success: false,
				message: "Trip is inactive.",
			});
		}

		// Check booking deadline
		if (new Date() > existingTrip.booking_deadline) {
			return res.status(400).json({
				success: false,
				message: "Booking deadline has passed.",
			});
		}

		// If changing to another trip,
		// check whether the user already has a booking for that trip.
		if (existingBooking.trip_id !== value.trip_id) {
			const duplicateBooking = await prisma.booking.findUnique({
				where: {
					user_id_trip_id: {
						user_id: existingBooking.user_id,
						trip_id: value.trip_id,
					},
				},
			});

			if (duplicateBooking) {
				return res.status(409).json({
					success: false,
					message: "User already has a booking for this trip.",
				});
			}

			// New trip must have at least one seat
			if (existingTrip.available_seats <= 0) {
				return res.status(400).json({
					success: false,
					message: "No seats available for this trip.",
				});
			}
		}

		// Calculate new trip price
		const totalAmount =
			Number(existingTrip.discount_price) > 0
				? Number(existingTrip.discount_price)
				: Number(existingTrip.price);

		const updatedBooking = await prisma.$transaction(async (tx) => {

			// If user is switching trips
			if (existingBooking.trip_id !== value.trip_id) {

				// Restore one seat to old trip
				await tx.trip.update({
					where: {
						id: existingBooking.trip_id,
					},
					data: {
						available_seats: {
							increment: 1,
						},
					},
				});

				// Deduct one seat from new trip
				await tx.trip.update({
					where: {
						id: value.trip_id,
					},
					data: {
						available_seats: {
							decrement: 1,
						},
					},
				});
			}

			// Update booking
			return await tx.booking.update({
				where: {
					id: booking_id as string,
				},
				data: {
					total_amount: totalAmount,
					special_request: value.special_request,
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
		console.error("Update booking error:", error);

		return res.status(500).json({
			success: false,
			message: "Internal server error",
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

		// Transaction
		await prisma.$transaction(async (tx) => {

			// Restore one seat
			await tx.trip.update({
				where: {
					id: existingBooking.trip_id,
				},
				data: {
					available_seats: {
						increment: 1,
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
		console.error("Delete booking error:", error);

		return res.status(500).json({
			success: false,
			message: "Internal server error.",
		});
	}
};
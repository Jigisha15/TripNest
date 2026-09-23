import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateBookingValidation, UpdateBookingValidation } from "../validations/booking.validation";
import crypto from "crypto";
import { razorpay } from "../config/razorpay";

// get
export const getBooking = async (req: Request, res: Response) => {
	const { id, user_id, trip_id } = req.query;

	try {

		const bookings = await prisma.booking.findMany({
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
			include: {
				trip: {
					select: {
						title: true,
						end_date: true
					}
				}
			}
		});

		// return response
		return res.status(200).json({
			success: true,
			message: bookings.length > 0 ? "Data fetched successfully." : "No bookings exist.",
			data: bookings
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
export const createBooking = async (
	req: Request,
	res: Response
) => {
	try {
		const { trip_id, user_id, special_request, } = req.body;

		// validate required fields
		if (!trip_id || !user_id) {
			return res.status(400).json({
				success: false,
				message: "trip_id and user_id are required.",
			});
		}

		// check user
		const existingUser =
			await prisma.user.findUnique({
				where: {
					id: user_id,
				},
				select: {
					id: true,
				},
			});

		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		// check trip
		const existingTrip =
			await prisma.trip.findUnique({
				where: {
					id: trip_id,
				},
				select: {
					id: true,
					is_active: true,
					price: true,
					available_seats: true
				},
			});

		if (!existingTrip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found.",
			});
		}

		// check if trip is active or not
		if (!existingTrip.is_active) {
			return res.status(400).json({
				success: false,
				message: "This trip is no longer active.",
			});
		}

		// check if trip has available_seats
		if (existingTrip.available_seats <= 0) {
			return res.status(400).json({
				success: false,
				message: "No available seats are there for this trip"
			})
		}

		// check duplicate booking
		const existingBooking =
			await prisma.booking.findUnique({
				where: {
					user_id_trip_id: {
						user_id,
						trip_id,
					},
				},
			});

		if (existingBooking) {
			return res.status(409).json({
				success: false,
				message:
					"You already have a booking for this trip.",
			});
		}


		// fetch amount from db
		//const totalAmount =
		//	Number(existingTrip.price);

		//if (!totalAmount || totalAmount <= 0) {
		//	return res.status(400).json({
		//		success: false,
		//		message:
		//			"Invalid trip amount.",
		//	});
		//}
		const totalAmount = existingTrip.price;

		if (totalAmount.lte(0)) {
			return res.status(400).json({
				success: false,
				message: "Invalid trip amount.",
			});
		}

		// create booking
		const booking = await prisma.booking.create({
			data: {
				trip_id,
				user_id,
				special_request: special_request ?? null,
				total_amount: totalAmount,
				booking_status: "PENDING",
				payment_status: "PENDING",
			},
		});

		// decrement available_seats from the trip table
		await prisma.trip.update({
			where: { id: trip_id },
			data: {
				available_seats: {
					decrement: 1
				}
			}
		})

		// create razorpay order
		const razorpayAmount = Math.round(
			Number(totalAmount) * 100
		);

		const razorpayOrder = await razorpay.orders.create({
			amount: razorpayAmount,
			currency: "INR",
			receipt: booking.id,
		});

		// save razorpay order_id
		await prisma.booking.update({
			where: {
				id: booking.id,
			},
			data: {
				razorpay_order_id:
					razorpayOrder.id,
			},
		});

		// response
		return res.status(201).json({
			success: true,
			message: "Booking created. Proceed to payment.",
			data: {
				booking_id: booking.id,
				razorpay_order_id: razorpayOrder.id,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
				razorpay_key: process.env.RAZORPAY_KEY_ID,
			},
		});

	} catch (error) {

		console.error("Create booking error:", error);

		return res.status(500).json({
			success: false,
			message:
				"Booking creation failed.",
		});
	}
};

export const verifyBookingPayment = async (
	req: Request,
	res: Response
) => {
	try {

		const {
			booking_id,
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
		} = req.body;

		const generatedSignature =
			crypto
				.createHmac(
					"sha256",
					process.env.RAZORPAY_KEY_SECRET!
				)
				.update(
					`${razorpay_order_id}|${razorpay_payment_id}`
				)
				.digest("hex");

		if (
			generatedSignature !==
			razorpay_signature
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid payment signature.",
			});
		}

		const booking =
			await prisma.booking.update({
				where: {
					id: booking_id,
				},
				data: {
					payment_status: "PAID",
					booking_status: "CONFIRMED",
				},
			});

		return res.status(200).json({
			success: true,
			message: "Payment verified successfully.",
			data: booking,
		});

	} catch (error) {

		console.error(
			"Payment verification error:",
			error
		);

		return res.status(500).json({
			success: false,
			message: "Payment verification failed.",
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
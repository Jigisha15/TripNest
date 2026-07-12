import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateReviewValidation, UpdateReviewValidation } from "../validations/review.validation";

// get
export const getReviews = async (req: Request, res: Response) => {
	const { trip_id, user_id, booking_id } = req.query;

	try {

		const reviews = await prisma.review.findMany({
			where: {
				...(trip_id && {
					trip_id: trip_id as string,
				}),
				...(user_id && {
					user_id: user_id as string,
				}),
				...(booking_id && {
					booking_id: booking_id as string,
				}),
			},
		});

		// return response
		return res.status(200).json({
			success: true,
			message: reviews.length > 0 ? "Data fetched successfully." : "No reviews exist.",
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
export const createReview = async (req: Request, res: Response) => {
	try {
		// validate response
		const { error, value } = CreateReviewValidation.validate(req.body, {
			abortEarly: false,
		})

		// pass errors if any
		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid Payload",
				error: error
			})
		}

		// check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id: value.user_id }
		})
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			})
		}

		// check if trip exists
		const existingTrip = await prisma.trip.findUnique({
			where: { id: value.trip_id }
		})
		if (!existingTrip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found"
			})
		}

		// check if booking exists
		const existingBooking = await prisma.booking.findUnique({
			where: { id: value.booking_id }
		})
		if (!existingBooking) {
			return res.status(404).json({
				success: false,
				message: "Booking not found"
			})
		}

		// create new review
		const newReview = await prisma.review.create({
			data: value
		})

		// return response
		return res.status(201).json({
			success: true,
			message: "Review created successfully!",
			data: newReview
		})

	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error
		})
	}
}

// update
export const updateReview = async (req: Request, res: Response) => {
	const { review_id } = req.params

	try {
		// check if parameter is passed
		if (!review_id) {
			return res.status(404).json({
				success: false,
				message: "review_id is missing parameter"
			})
		}

		// valiate payload
		const { error, value } = UpdateReviewValidation.validate(req.body, {
			abortEarly: false
		})

		// pass errors if any
		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload",
				error: error
			})
		}

		// check if review exists
		const existingReview = await prisma.review.findUnique({
			where: { id: review_id as string }
		})

		// pass errors if any
		if (!existingReview) {
			return res.status(404).json({
				success: false,
				message: "Review not found"
			})
		}

		// update data
		const updatedReview = await prisma.review.update({
			where: { id: review_id as string },
			data: value
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Review updated successfully!",
			data: updatedReview
		})

	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error
		})
	}
}

// delete
export const deleteReview = async (req: Request, res: Response) => {
	const { review_id } = req.params

	try {
		// check if parameter is passed
		if (!review_id) {
			return res.status(404).json({
				success: false,
				message: "review_id is missing parameter"
			})
		}

		// check if review exists
		const existingReview = await prisma.review.findUnique({
			where: { id: review_id as string }
		})

		// pass errors if any
		if (!existingReview) {
			return res.status(404).json({
				success: false,
				message: "Review not found"
			})
		}

		// delete data
		await prisma.review.delete({
			where: { id: review_id as string },
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Review deleted successfully!",
		})

	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error
		})
	}
}
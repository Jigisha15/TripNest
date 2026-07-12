import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateTripValidation, UpdateTripValidation } from "../validations/trip.validation";

// get
export const getTrip = async (req: Request, res: Response) => {
	const { agency_id, trip_id, is_active } = req.query;

	try {
		const trips = await prisma.trip.findMany({
			where: {
				...(agency_id && { agency_id: agency_id as string }),
				...(trip_id && { id: trip_id as string }),
				...(is_active !== undefined && {
					is_active: is_active === "true",
				}),
			}
		})

		// return response
		return res.status(200).json({
			success: true,
			message: trips.length > 0 ? "Data fetched successfully." : "No trips exist.",
			data: trips
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// create
export const createTrip = async (req: Request, res: Response) => {
	try {
		// check the payload - validate payload
		const { error, value } = CreateTripValidation.validate(req.body, {
			abortEarly: false
		})

		// if any errors then pass
		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid Payload",
				error: error
			})
		}

		const payload = {
			...value,
			average_rating: 0,
			total_reviews: 0,
			available_seats: 0
		}

		// create trip
		const newTrip = await prisma.trip.create({
			data: payload
		})

		// return response
		return res.status(201).json({
			success: true,
			message: "Trip created successfully!",
			data: newTrip
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// update
export const updateTrip = async (req: Request, res: Response) => {
	const { trip_id } = req.params

	try {
		// check if parameter is being sent
		if (!trip_id) {
			return res.status(400).json({
				success: false,
				message: "trip_id parameter is missing"
			})
		}

		// check the payload - validate payload
		const { error, value } = UpdateTripValidation.validate(req.body, {
			abortEarly: false
		})

		// if any errors then pass
		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid Payload",
				error: error
			})
		}

		// check if trip exists
		const existingTrip = await prisma.trip.findUnique({
			where: { id: trip_id as string }
		})

		// pass errors if any
		if (!existingTrip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found."
			})
		}

		// update trip
		const updatedTrip = await prisma.trip.update({
			where: { id: trip_id as string },
			data: value
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Trip updated successfully!",
			data: updatedTrip
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// delete
export const deleteTrip = async (req: Request, res: Response) => {
	const { trip_id } = req.params

	try {
		// check if parameter is being sent
		if (!trip_id) {
			return res.status(400).json({
				success: false,
				message: "trip_id parameter is missing"
			})
		}

		// check if trip exists
		const existingTrip = await prisma.trip.findUnique({
			where: { id: trip_id as string }
		})

		// pass errors if any
		if (!existingTrip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found."
			})
		}

		// delete trip
		await prisma.trip.delete({
			where: { id: trip_id as string }
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Trip deleted successfully!"
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}
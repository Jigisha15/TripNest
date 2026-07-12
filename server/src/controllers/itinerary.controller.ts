import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateItineraryValidation, UpdateItineraryValidation } from "../validations/itinerary.validation";

// get
export const getItinerary = async (req: Request, res: Response) => {
	const { id, trip_id } = req.query;

	try {
		const itineraries = await prisma.itinerary.findMany({
			where: {
				...(id && { id: id as string }),
				...(trip_id && { trip_id: trip_id as string }),
			}
		})

		// return response
		return res.status(200).json({
			success: true,
			message: itineraries.length > 0 ? "Data fetched successfully." : "No itineraries exist.",
			data: itineraries
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
export const createItinerary = async (req: Request, res: Response) => {
	try {
		// check the payload - validate payload
		const { error, value } = CreateItineraryValidation.validate(req.body, {
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
		const trip = await prisma.trip.findUnique({
			where: {
				id: value.trip_id,
			},
		});

		// pass errors if any
		if (!trip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found.",
			});
		}

		// check if a trip already has an itinerary
		const existing = await prisma.itinerary.findFirst({
			where: {
				trip_id: value.trip_id,
			},
		});

		// pass errors if any
		if (existing) {
			return res.status(409).json({
				success: false,
				message: "Itinerary already exists for this trip.",
			});
		}

		// safety checks
		const dayNumbers = value.itineraries.map((i: any) => i.day_number);

		const uniqueDays = new Set(dayNumbers);

		if (dayNumbers.length !== uniqueDays.size) {
			return res.status(400).json({
				success: false,
				message: "Duplicate day numbers are not allowed.",
			});
		}

		// create itinerary rows
		const newItinerary = await prisma.itinerary.createMany({
			data: value.itineraries.map((item: any) => ({
				trip_id: value.trip_id,
				day_number: item.day_number,
				title: item.title,
				description: item.description,
			})),
		});

		// return response
		return res.status(201).json({
			success: true,
			message: "Itinerary created successfully.",
			data: newItinerary
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// update
export const updateItinerary = async (req: Request, res: Response) => {
	const { trip_id } = req.params;

	try {
		// Check trip_id
		if (!trip_id) {
			return res.status(400).json({
				success: false,
				message: "trip_id parameter is missing."
			});
		}

		// Validate payload
		const { error, value } = UpdateItineraryValidation.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload.",
				error,
			});
		}

		// Check trip exists
		const trip = await prisma.trip.findUnique({
			where: {
				id: trip_id as string,
			},
		});

		if (!trip) {
			return res.status(404).json({
				success: false,
				message: "Trip not found.",
			});
		}

		const { itineraries } = value;

		// Check duplicate day numbers
		const dayNumbers = itineraries.map(
			(item: any) => item.day_number
		);

		if (new Set(dayNumbers).size !== dayNumbers.length) {
			return res.status(400).json({
				success: false,
				message: "Duplicate day numbers are not allowed.",
			});
		}

		// Transaction
		await prisma.$transaction(
			itineraries.map((item: any) =>
				prisma.itinerary.update({
					where: {
						id: item.id,
					},
					data: {
						day_number: item.day_number,
						title: item.title,
						description: item.description,
					},
				})
			)
		);

		const updatedItinerary = await prisma.itinerary.findMany({
			where: {
				trip_id: trip_id as string,
			},
			orderBy: {
				day_number: "asc",
			},
		});

		return res.status(200).json({
			success: true,
			message: "Itinerary updated successfully.",
			data: updatedItinerary,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error,
		});
	}
};

// delete
export const deleteItinerary = async (req: Request, res: Response) => {
	const { itinerary_id } = req.params

	try {
		// check if parameter is passed
		if (!itinerary_id) {
			return res.status(404).json({
				success: false,
				message: "itinerary_id is missing parameter"
			})
		}

		// check if review exists
		const existingItinerary = await prisma.itinerary.findUnique({
			where: { id: itinerary_id as string }
		})

		// pass errors if any
		if (!existingItinerary) {
			return res.status(404).json({
				success: false,
				message: "Itinerary not found"
			})
		}

		// delete data
		await prisma.itinerary.delete({
			where: { id: itinerary_id as string },
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "itinerary deleted successfully!",
		})

	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error
		})
	}
}
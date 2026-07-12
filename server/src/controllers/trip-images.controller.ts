import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateTripImageValidation } from "../validations/trip-images.validation";
import { uploadImage } from "../utils/upload-image";

// get
export const getTripImages = async (req: Request, res: Response) => {
	const { id, is_thumbnail, trip_id, user_id } = req.query;

	try {
		const trips = await prisma.trip.findMany({
			where: {
				...(id && { id: id as string }),
				...(trip_id && { trip_id: trip_id as string }),
				...(user_id && { user_id: user_id as string }),
				...(is_thumbnail !== undefined && {
					is_thumbnail: is_thumbnail === "true",
				}),
			}
		})

		// return response
		return res.status(200).json({
			success: true,
			message: trips.length > 0 ? "Data fetched successfully." : "No trip images exist.",
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
export const postTripImage = async (req: Request, res: Response) => {
	try {
		// check the payload - validate payload
		const { error, value } = CreateTripImageValidation.validate(req.body, {
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


		// check if user already exists
		const existingUser = await prisma.user.findFirst({
			where: { id: value.user_id }
		})

		// if any errors then pass
		if (!existingUser) {
			return res.status(409).json({
				success: false,
				message: "User not found."
			})
		}

		// check if trip already exists
		const existingTrip = await prisma.trip.findFirst({
			where: { id: value.trip_id }
		})

		// if any errors then pass
		if (!existingTrip) {
			return res.status(409).json({
				success: false,
				message: "Trip not found."
			})
		}

		// check if any images are added
		let imageUrl
		const files = req.files as {
			logo?: Express.Multer.File[]
		}

		if (files?.logo?.length) {
			const uploadedImage = await uploadImage(
				files.logo[0],
				"trip_image/image_url"
			)
			imageUrl = uploadedImage.secure_url
		}

		// post new trip image
		const newTripImage = await prisma.tripImages.create({
			data: {
				image_url: imageUrl as string,
				is_thumbnail: value.is_thumbnail,
				user_id: value.user_id,
				trip_id: value.trip_id,
			}
		})

		// return response
		return res.status(201).json({
			success: true,
			message: "Trip image posted successfully!",
			data: newTripImage
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
export const deleteTripImage = async (req: Request, res: Response) => {
	const { trip_image_id } = req.params

	try {
		// check if parameter is being sent
		if (!trip_image_id) {
			return res.status(400).json({
				success: false,
				message: "trip_image_id parameter is missing"
			})
		}

		// check if agency exists
		const existingTripImage = await prisma.tripImages.findUnique({
			where: { id: trip_image_id as string }
		})

		// pass errors if any
		if (!existingTripImage) {
			return res.status(404).json({
				success: false,
				message: "Trip image not found."
			})
		}

		// delete agency
		await prisma.tripImages.delete({
			where: { id: trip_image_id as string }
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Trip image deleted successfully!"
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}
import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { CreateAgencyValidation, UpdateAgencyValidation } from "../validations/agency.validation";
import { hashPassword } from "../utils/password";
import { uploadImage } from "../utils/upload-image";

// get agency
export const getAgency = async (req: Request, res: Response) => {
	const { agency_id, user_id, email_id } = req.query;

	try {
		const agencies = await prisma.agency.findMany({
			where: {
				...(agency_id && { id: agency_id as string }),
				...(user_id && { owner_id: user_id as string }),
				...(email_id && { email_id: email_id as string }),
			},
			include: {
				owner: {
					select: {
						first_name: true,
						last_name: true,
						email_id: true,
					}
				}
			}
		})

		// return response
		return res.status(200).json({
			success: true,
			message: agencies.length > 0 ? "Data fetched successfully." : "No agencies exist.",
			data: agencies
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// create agency - register
export const registerAgency = async (req: Request, res: Response) => {
	try {
		// check the payload - validate payload
		const { error, value } = CreateAgencyValidation.validate(req.body, {
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
				message: "User not found.",
			})
		}

		// check if any agency with the same email id already exists
		const existingAgency = await prisma.agency.findFirst({
			where: { email_id: value.email_id }
		})

		// if any errors then pass
		if (existingAgency) {
			return res.status(409).json({
				success: false,
				message: "Agency with the same email id already exists."
			})
		}

		// hash the password
		const hashedPassword = await hashPassword(value.password)

		// check if any images are added
		let imageUrl
		const files = req.files as {
			logo?: Express.Multer.File[]
		}

		if (files?.logo?.length) {
			const uploadedImage = await uploadImage(
				files.logo[0],
				"agency/logo"
			)
			imageUrl = uploadedImage.secure_url
		}

		// register new agency
		const newAgency = await prisma.agency.create({
			data: {
				name: value.name,
				slug: value.slug,
				description: value.description,
				email_id: value.email_id,
				phone_number: value.phone_number,
				website: value.website,
				address: value.address,
				city: value.city,
				state: value.state,
				country: value.country,
				is_active: true,
				password: hashedPassword,
				logo: imageUrl,
				owner_id: value.user_id
			}
		})

		// return response
		return res.status(201).json({
			success: true,
			message: "Agency registered successfully!",
			data: newAgency
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// update agency
export const updateAgency = async (req: Request, res: Response) => {
	const { agency_id } = req.params

	try {
		// check if parameter is being sent
		if (!agency_id) {
			return res.status(400).json({
				success: false,
				message: "agency_id parameter is missing"
			})
		}

		// check the payload - validate payload
		const { error, value } = UpdateAgencyValidation.validate(req.body, {
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

		// check if agency exists
		const existingAgency = await prisma.agency.findFirst({
			where: { id: agency_id as string }
		})

		// pass errors if any
		if (!existingAgency) {
			return res.status(404).json({
				success: false,
				message: "Agency not found."
			})
		}

		// check if email id is passed
		if (value.email_id && value.email_id !== existingAgency.email_id) {
			const duplicateAgency = await prisma.agency.findUnique({
				where: {
					email_id: value.email_id
				}
			})

			if (duplicateAgency) {
				return res.status(409).json({
					success: false,
					message: "Another agency already uses this email."
				})
			}
		}
		// check if password is passed
		let hashedPassword = existingAgency.password;
		if (value.password) {
			hashedPassword = await hashPassword(value.password)
		}

		// check if logo is passed
		let imageUrl = existingAgency.logo
		const files = req.files as {
			logo?: Express.Multer.File[]
		}

		if (files?.logo?.length) {
			const uploadedImage = await uploadImage(
				files.logo[0],
				"agency/logo"
			)
			imageUrl = uploadedImage.secure_url
		}

		// update agency
		const updatedAgency = await prisma.agency.update({
			where: { id: agency_id as string },
			data: {
				name: value.name,
				slug: value.slug,
				description: value.description,
				email_id: value.email_id,
				phone_number: value.phone_number,
				website: value.website,
				address: value.address,
				city: value.city,
				state: value.state,
				country: value.country,
				is_active: value.is_active,
				password: hashedPassword,
				logo: imageUrl,
				owner_id: value.user_id
			}
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Agency updated successfully!",
			data: updatedAgency
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// delete agency
export const deleteAgency = async (req: Request, res: Response) => {
	const { agency_id } = req.params

	try {
		// check if parameter is being sent
		if (!agency_id) {
			return res.status(400).json({
				success: false,
				message: "agency_id parameter is missing"
			})
		}

		// check if agency exists
		const existingAgency = await prisma.agency.findUnique({
			where: { id: agency_id as string }
		})

		// pass errors if any
		if (!existingAgency) {
			return res.status(404).json({
				success: false,
				message: "Agency not found."
			})
		}

		// delete agency
		await prisma.agency.delete({
			where: { id: agency_id as string }
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "Agency deleted successfully!"
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}
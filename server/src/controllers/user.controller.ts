import { Request, Response } from "express"
import { prisma } from "../utils/prisma-client";
import { UpdateUserValidation } from "../validations/user.validation";
import { uploadImage } from "../utils/upload-image";
import { hashPassword } from "../utils/password";

// get user(s)
export const getUsers = async (req: Request, res: Response) => {
	const { user_id, email_id } = req.query;

	try {
		const users = await prisma.user.findMany({
			where: {
				...(user_id && { id: user_id as string }),
				...(email_id && { email_id: email_id as string }),
			},
			include: {
				bookings: true,
				reviews: true,
				agencies: true
			}
		})

		// return response
		return res.status(200).json({
			success: true,
			message: users.length > 0 ? "Data fetched successfully." : "No users exist.",
			data: users
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// update user info
export const updateUser = async (req: Request, res: Response) => {
	const { user_id } = req.params

	try {
		// check if parameter is sent
		if (!user_id) {
			return res.status(400).json({
				success: false,
				message: "user_id parameter is missing."
			})
		}

		// validate the payload
		const { error, value } = UpdateUserValidation.validate(req.body, {
			abortEarly: false
		})

		// pass errors if any
		if (error) {
			return res.status(400).json({
				success: false,
				message: "Invalid payload.",
				error: error
			})
		}

		// check if the user exists
		const existingUser = await prisma.user.findUnique({
			where: { id: user_id as string }
		})

		// pass errors if any
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			})
		}

		// check if email_id is being updated, if yes then check the uniqueness of the new email_id
		if (value.email_id && value.email_id !== existingUser.email_id) {
			const duplicateUser = await prisma.user.findUnique({
				where: {
					email_id: value.email_id
				}
			})

			if (duplicateUser) {
				return res.status(409).json({
					success: false,
					message: "Another user already uses this email."
				})
			}
		}

		// check if the password is being updated, if yes then it must be hashed first
		let hashedPassword = existingUser.password;
		if (value.password) {
			hashedPassword = await hashPassword(value.password)
		}

		// check if profile_image is being added, then write the code to upload
		// image upload if any
		let imageUrl = existingUser.profile_image;
		const files = req.files as {
			image?: Express.Multer.File[];
		}

		// upload image if provided
		if (files?.image?.length) {
			const uploadedImage = await uploadImage(
				files.image[0],
				"user/profile"
			);

			imageUrl = uploadedImage.secure_url;
		}

		// update query
		const updatedUser = await prisma.user.update({
			where: {
				id: user_id as string,
			},
			data: {
				first_name: value.first_name,
				last_name: value.last_name,
				email_id: value.email_id,
				phone_number: value.phone_number,
				password: hashedPassword,
				profile_image: imageUrl,
			},
		});

		// return response
		return res.status(200).json({
			success: true,
			message: "User details updated successfully!",
			data: updatedUser,
		})

	} catch (error: any) {
		console.log(error.response?.data);
	}
}

// delete user
export const deleteUser = async (req: Request, res: Response) => {
	const { user_id } = req.params

	try {
		// check if parameter is sent
		if (!user_id) {
			return res.status(400).json({
				success: false,
				message: "user_id parameter is missing."
			})
		}

		// check if the user exists
		const existingUser = await prisma.user.findUnique({
			where: { id: user_id as string }
		})

		// pass errors if any
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			})
		}

		// delete user
		await prisma.user.delete({
			where: { id: user_id as string }
		})

		// return response
		return res.status(200).json({
			success: true,
			message: "User deleted successfully!"
		})

	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}
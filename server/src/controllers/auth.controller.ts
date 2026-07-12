import { Request, Response } from "express"
import { LoginValidation, RegisterValidation } from "../validations/auth.validation"
import { generateToken } from "../utils/jwt"
import { hashPassword, comparePasswords } from "../utils/password"
import { prisma } from "../utils/prisma-client"
import bcrypt from "bcrypt"

// register
export const register = async (req: Request, res: Response) => {
	try {
		// check the payload - validate payload
		const { error, value } = RegisterValidation.validate(req.body, {
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

		// check if user with same email id already exists
		const existingUser = await prisma.user.findFirst({
			where: { email_id: value.email_id }
		})

		// if any errors then pass
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User with the same emailId already exists"
			})
		}

		// hash the password
		const hashedPassword = await hashPassword(value.password)

		// register new user
		const newUser = await prisma.user.create({
			data: {
				first_name: value.first_name,
				last_name: value.last_name,
				email_id: value.email_id,
				phone_number: value.phone_number,
				password: hashedPassword,
				role: value.role
			}
		})

		// give success message
		return res.status(201).json({
			success: true,
			message: `${newUser.first_name} ${newUser.last_name} created successfully!`,
			data: newUser
		})

	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// login
export const login = async (req: Request, res: Response) => {
	try {
		// check the payload - validate payload
		const { error, value } = LoginValidation.validate(req.body, {
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

		// check if user exists
		const existingUser = await prisma.user.findFirst({
			where: { email_id: value.email_id }
		})

		// if any errors then pass
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: `User with ${value.email_id} email id not found`,
			})
		}

		// compare the existing and entered password
		const matchingPassword = await comparePasswords(value.password, existingUser.password)

		// return errors if any
		if (!matchingPassword) {
			return res.status(400).json({
				success: false,
				message: "Passwords do not match"
			})
		}

		// create token
		const token = await generateToken({
			id: existingUser.id,
			email_id: value.email_id,
			role: existingUser.role
		})

		// return response
		return res.status(200).json({
			success: true,
			message: `${existingUser.first_name} user logged in successfully!`,
			data: {
				...existingUser,
				token: token
			}
		})

	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: "Internal server error.",
			error: error
		})
	}
}

// logout
import Joi from "joi"
import { ROLE } from "@prisma/client"

export const UpdateUserValidation = Joi.object({
	first_name: Joi.string()
		.trim()
		.pattern(/^[A-Za-z]+$/)
		.min(2)
		.max(50)
		.optional()
		.messages({
			"string.pattern.base": "First name should contain only alphabets.",
		}),
	last_name: Joi.string()
		.trim()
		.pattern(/^[A-Za-z]+$/)
		.min(2)
		.max(50)
		.optional()
		.messages({
			"string.pattern.base": "Last name should contain only alphabets.",
		}),
	email_id: Joi.string()
		.trim()
		.email()
		.optional(),
	phone_number: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.optional()
		.messages({
			"string.pattern.base": "Phone number must contain exactly 10 digits.",
		}),
	password: Joi.string()
		.min(5)
		.max(32)
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/
		)
		.optional()
		.messages({
			"string.pattern.base":
				"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
		}),
	role: Joi.string()
		.valid(...Object.values(ROLE)).optional(),
	//profile_image: Joi.string().allow(null).optional(),
})
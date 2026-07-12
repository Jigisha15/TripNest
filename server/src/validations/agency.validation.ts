import Joi from "joi";

export const CreateAgencyValidation = Joi.object({
	name: Joi.string()
		.trim()
		.pattern(/^[A-Za-z ]+$/)
		.min(2)
		.required()
		.messages({
			"string.pattern.base": "Name should contain only alphabets.",
		}),
	slug: Joi.string()
		.trim()
		.min(2)
		.optional(),
	description: Joi.string()
		.trim()
		.min(2)
		.optional(),
	email_id: Joi.string()
		.trim()
		.email()
		.required(),
	phone_number: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required()
		.messages({
			"string.pattern.base": "Phone number must contain exactly 10 digits.",
		}),
	password: Joi.string()
		.min(5)
		.max(32)
		.pattern(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/
		)
		.required()
		.messages({
			"string.pattern.base":
				"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
		}),
	website: Joi.string().trim().uri().allow("").optional(),
	address: Joi.string().trim().min(2).required(),
	city: Joi.string().trim().min(2).required(),
	state: Joi.string().trim().min(2).required(),
	country: Joi.string().trim().min(2).required(),
	is_active: Joi.boolean().required(),
	user_id: Joi.string().uuid().required()
})

export const UpdateAgencyValidation = Joi.object({
	name: Joi.string()
		.trim()
		.pattern(/^[A-Za-z ]+$/)
		.min(2)
		.optional()
		.messages({
			"string.pattern.base": "First name should contain only alphabets.",
		}),
	slug: Joi.string()
		.trim()
		.min(2)
		.optional(),
	description: Joi.string()
		.trim()
		.min(2)
		.optional(),
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
	website: Joi.string().trim().uri().allow("").optional(),
	address: Joi.string().trim().min(2).optional(),
	city: Joi.string().trim().min(2).optional(),
	state: Joi.string().trim().min(2).optional(),
	country: Joi.string().trim().min(2).optional(),
	is_active: Joi.boolean().optional(),
	user_id: Joi.string().uuid().optional()
})
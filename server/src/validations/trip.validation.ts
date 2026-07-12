import Joi from "joi";

export const CreateTripValidation = Joi.object({
	title: Joi.string().trim().min(2).required(),
	slug: Joi.string().trim().min(2).optional(),
	short_description: Joi.string().trim().min(2).required(),
	description: Joi.string().trim().min(2).required(),
	destination: Joi.string().trim().min(2).required(),
	meeting_point: Joi.string().trim().min(2).required(),
	duration_days: Joi.number().min(0).required(),
	duration_nights: Joi.number().min(0).required(),
	price: Joi.number().min(0).precision(2).required(),
	discount_price: Joi.number().min(0).precision(2).required(),
	total_seats: Joi.number().min(0).required(),
	start_date: Joi.date()
		.min("now")
		.required()
		.messages({
			"date.min": "Start date cannot be in the past",
		}),
	end_date: Joi.date()
		.min("now")
		.required()
		.messages({
			"date.min": "End date cannot be in the past",
		}),
	booking_deadline: Joi.date()
		.min("now")
		.required()
		.messages({
			"date.min": "Booking deadline cannot be in the past",
		}),
	is_active: Joi.boolean().required(),
	agency_id: Joi.string().uuid().required()
})

export const UpdateTripValidation = Joi.object({
	title: Joi.string().trim().min(2).optional(),
	slug: Joi.string().trim().min(2).optional(),
	short_description: Joi.string().trim().min(2).optional(),
	description: Joi.string().trim().min(2).optional(),
	destination: Joi.string().trim().min(2).optional(),
	meeting_point: Joi.string().trim().min(2).optional(),
	duration_days: Joi.number().min(0).optional(),
	duration_nights: Joi.number().min(0).optional(),
	price: Joi.number().min(0).precision(2).optional(),
	discount_price: Joi.number().min(0).precision(2).optional(),
	total_seats: Joi.number().min(0).optional(),
	start_date: Joi.date()
		.min("now")
		.optional()
		.messages({
			"date.min": "Start date cannot be in the past",
		}),
	end_date: Joi.date()
		.min("now")
		.optional()
		.messages({
			"date.min": "End date cannot be in the past",
		}),
	booking_deadline: Joi.date()
		.min("now")
		.optional()
		.messages({
			"date.min": "Booking deadline cannot be in the past",
		}),
	is_active: Joi.boolean().optional(),
	agency_id: Joi.string().uuid().optional()
})
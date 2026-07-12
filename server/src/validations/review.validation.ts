import Joi from "joi";

export const CreateReviewValidation = Joi.object({
	rating: Joi.number().min(0).precision(1).optional(),
	title: Joi.string().trim().min(2).optional(),
	comment: Joi.string().trim().min(2).optional(),
	user_id: Joi.string().uuid().required(),
	trip_id: Joi.string().uuid().required(),
	booking_id: Joi.string().uuid().required(),
})

export const UpdateReviewValidation = Joi.object({
	rating: Joi.number().min(0).precision(1).optional(),
	title: Joi.string().trim().min(2).optional(),
	comment: Joi.string().trim().min(2).optional(),
	user_id: Joi.string().uuid().optional(),
	trip_id: Joi.string().uuid().optional(),
	booking_id: Joi.string().uuid().optional(),
})
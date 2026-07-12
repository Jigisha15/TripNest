import { BOOKING_STATUS, PAYMENT_STATUS } from "@prisma/client";
import Joi from "joi";

export const CreateBookingValidation = Joi.object({
	number_of_adults: Joi.number().integer().min(1).required(),
	number_of_children: Joi.number().integer().min(0).default(0),
	total_amount: Joi.number().min(0).required(),
	booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)).optional(),
	payment_status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).optional(),
	special_request: Joi.string().trim().allow("").optional(),
	booked_at: Joi.date().required(),
	user_id: Joi.string().uuid().required(),
	trip_id: Joi.string().uuid().required()
});

export const UpdateBookingValidation = Joi.object({
	number_of_adults: Joi.number().integer().min(1).optional(),
	number_of_children: Joi.number().integer().min(0).default(0).optional(),
	total_amount: Joi.number().min(0).optional(),
	booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)).optional(),
	payment_status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).optional(),
	special_request: Joi.string().trim().allow("").optional(),
	booked_at: Joi.date().optional(),
	user_id: Joi.string().uuid().optional(),
	trip_id: Joi.string().uuid().optional()
});
import { BOOKING_STATUS, PAYMENT_STATUS } from "@prisma/client";
import Joi from "joi";

export const CreateBookingValidation = Joi.object({
	total_amount: Joi.number().min(0).required(),
	booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)).optional(),
	payment_status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).optional(),
	special_request: Joi.string().trim().allow("").optional(),
	user_id: Joi.string().uuid().required(),
	trip_id: Joi.string().uuid().required()
});

export const UpdateBookingValidation = Joi.object({
	total_amount: Joi.number().min(0).optional(),
	booking_status: Joi.string().valid(...Object.values(BOOKING_STATUS)).optional(),
	payment_status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).optional(),
	special_request: Joi.string().trim().allow("").optional(),
	user_id: Joi.string().uuid().optional(),
	trip_id: Joi.string().uuid()
});
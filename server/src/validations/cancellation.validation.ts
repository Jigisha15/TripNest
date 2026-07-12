import { CANCELLATION_STATUS, PAYMENT_STATUS, ROLE } from "@prisma/client";
import Joi from "joi";

export const CreateCancellationValidation = Joi.object({
	status: Joi.string().valid(...Object.values(CANCELLATION_STATUS)).optional(),
	payment_status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).optional(),
	cancelled_by: Joi.string().valid(...Object.values(ROLE)).optional(),
	cancellation_reason: Joi.string().trim().min(5).max(500).required(),
	cancelled_at: Joi.date().required(),
	refund_amount: Joi.number().min(0).optional(),
	refund_processed_at: Joi.date().optional(),
	booking_id: Joi.string().uuid().required()
});

export const UpdateCancellationValidation = Joi.object({
	status: Joi.string().valid(...Object.values(CANCELLATION_STATUS)).optional(),
	payment_status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).optional(),
	cancelled_by: Joi.string().valid(...Object.values(ROLE)).optional(),
	cancellation_reason: Joi.string().trim().min(5).max(500).optional(),
	cancelled_at: Joi.date().optional(),
	refund_amount: Joi.number().min(0).optional(),
	refund_processed_at: Joi.date().optional(),
	booking_id: Joi.string().uuid().required()
});
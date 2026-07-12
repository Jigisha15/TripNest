import Joi from "joi";

export const CreateTripImageValidation = Joi.object({
	is_thumbnail: Joi.boolean().required(),
	user_id: Joi.string().trim().uuid().required(),
	trip_id: Joi.string().trim().uuid().required(),
})
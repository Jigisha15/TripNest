import Joi from "joi";

export const CreateItineraryValidation = Joi.object({
	trip_id: Joi.string().uuid().required(),

	itineraries: Joi.array()
		.items(
			Joi.object({
				day_number: Joi.number().integer().min(1).required(),
				title: Joi.string().trim().min(2).required(),
				description: Joi.string().trim().allow("").optional(),
			})
		)
		.min(1)
		.required(),
});

export const UpdateItineraryValidation = Joi.object({
	itineraries: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().uuid().required(),
				day_number: Joi.number()
					.integer()
					.min(1)
					.required(),
				title: Joi.string()
					.trim()
					.min(2)
					.required(),
				description: Joi.string()
					.trim()
					.allow("")
					.optional()
			})
		)
		.min(1)
		.required()
});
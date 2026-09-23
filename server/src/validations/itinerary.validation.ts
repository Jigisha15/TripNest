import Joi from "joi";

const ItineraryItemValidation = Joi.object({
	title: Joi.string()
		.trim()
		.min(1)
		.max(255)
		.required(),

	description: Joi.string()
		.trim()
		.allow("", null),
});

const ItineraryValidation = Joi.object({
	type: Joi.string()
		.valid("DAY", "NIGHT")
		.required(),

	day_number: Joi.when("type", {
		is: "DAY",
		then: Joi.number()
			.integer()
			.min(1)
			.required(),

		otherwise: Joi.forbidden(),
	}),

	night_number: Joi.when("type", {
		is: "NIGHT",
		then: Joi.number()
			.integer()
			.min(1)
			.required(),

		otherwise: Joi.forbidden(),
	}),

	title: Joi.string()
		.trim()
		.min(1)
		.max(255)
		.required(),

	description: Joi.string()
		.trim()
		.allow("", null),

	items: Joi.array()
		.items(ItineraryItemValidation)
		.min(1)
		.required(),
});

export const CreateItineraryValidation = Joi.object({
	trip_id: Joi.string()
		.uuid()
		.required(),

	itineraries: Joi.array()
		.items(ItineraryValidation)
		.min(1)
		.required(),
});

const UpdateItineraryItemValidation = Joi.object({
	id: Joi.string().uuid().optional(),

	title: Joi.string()
		.trim()
		.min(1)
		.max(255)
		.required(),

	description: Joi.string()
		.trim()
		.allow("", null)
		.optional(),
});

export const UpdateItineraryValidation = Joi.object({
	itineraries: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().uuid().optional(),

				type: Joi.string()
					.valid("DAY", "NIGHT")
					.required(),

				day_number: Joi.when("type", {
					is: "DAY",
					then: Joi.number()
						.integer()
						.min(1)
						.required(),
					otherwise: Joi.forbidden(),
				}),

				night_number: Joi.when("type", {
					is: "NIGHT",
					then: Joi.number()
						.integer()
						.min(1)
						.required(),
					otherwise: Joi.forbidden(),
				}),

				title: Joi.string()
					.trim()
					.min(1)
					.max(255)
					.required(),

				description: Joi.string()
					.trim()
					.allow("", null)
					.optional(),

				items: Joi.array()
					.items(UpdateItineraryItemValidation)
					.min(1)
					.required(),
			})
		)
		.required(),
});
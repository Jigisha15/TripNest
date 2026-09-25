"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateItineraryValidation = exports.CreateItineraryValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const ItineraryItemValidation = joi_1.default.object({
    title: joi_1.default.string()
        .trim()
        .min(1)
        .max(255)
        .required(),
    description: joi_1.default.string()
        .trim()
        .allow("", null),
});
const ItineraryValidation = joi_1.default.object({
    type: joi_1.default.string()
        .valid("DAY", "NIGHT")
        .required(),
    day_number: joi_1.default.when("type", {
        is: "DAY",
        then: joi_1.default.number()
            .integer()
            .min(1)
            .required(),
        otherwise: joi_1.default.forbidden(),
    }),
    night_number: joi_1.default.when("type", {
        is: "NIGHT",
        then: joi_1.default.number()
            .integer()
            .min(1)
            .required(),
        otherwise: joi_1.default.forbidden(),
    }),
    title: joi_1.default.string()
        .trim()
        .min(1)
        .max(255)
        .required(),
    description: joi_1.default.string()
        .trim()
        .allow("", null),
    items: joi_1.default.array()
        .items(ItineraryItemValidation)
        .min(1)
        .required(),
});
exports.CreateItineraryValidation = joi_1.default.object({
    trip_id: joi_1.default.string()
        .uuid()
        .required(),
    itineraries: joi_1.default.array()
        .items(ItineraryValidation)
        .min(1)
        .required(),
});
const UpdateItineraryItemValidation = joi_1.default.object({
    id: joi_1.default.string().uuid().optional(),
    title: joi_1.default.string()
        .trim()
        .min(1)
        .max(255)
        .required(),
    description: joi_1.default.string()
        .trim()
        .allow("", null)
        .optional(),
});
exports.UpdateItineraryValidation = joi_1.default.object({
    itineraries: joi_1.default.array()
        .items(joi_1.default.object({
        id: joi_1.default.string().uuid().optional(),
        type: joi_1.default.string()
            .valid("DAY", "NIGHT")
            .required(),
        day_number: joi_1.default.when("type", {
            is: "DAY",
            then: joi_1.default.number()
                .integer()
                .min(1)
                .required(),
            otherwise: joi_1.default.forbidden(),
        }),
        night_number: joi_1.default.when("type", {
            is: "NIGHT",
            then: joi_1.default.number()
                .integer()
                .min(1)
                .required(),
            otherwise: joi_1.default.forbidden(),
        }),
        title: joi_1.default.string()
            .trim()
            .min(1)
            .max(255)
            .required(),
        description: joi_1.default.string()
            .trim()
            .allow("", null)
            .optional(),
        items: joi_1.default.array()
            .items(UpdateItineraryItemValidation)
            .min(1)
            .required(),
    }))
        .required(),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTripValidation = exports.CreateTripValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateTripValidation = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).required(),
    slug: joi_1.default.string().trim().min(2).optional(),
    short_description: joi_1.default.string().trim().min(2).required(),
    description: joi_1.default.string().trim().min(2).required(),
    destination: joi_1.default.string().trim().min(2).required(),
    meeting_point: joi_1.default.string().trim().min(2).required(),
    duration_days: joi_1.default.number().min(0).required(),
    duration_nights: joi_1.default.number().min(0).required(),
    price: joi_1.default.number().min(0).precision(2).required(),
    discount_price: joi_1.default.number().min(0).precision(2).required(),
    total_seats: joi_1.default.number().min(0).required(),
    start_date: joi_1.default.date()
        .min("now")
        .required()
        .messages({
        "date.min": "Start date cannot be in the past",
    }),
    end_date: joi_1.default.date()
        .min("now")
        .required()
        .messages({
        "date.min": "End date cannot be in the past",
    }),
    booking_deadline: joi_1.default.date()
        .min("now")
        .required()
        .messages({
        "date.min": "Booking deadline cannot be in the past",
    }),
    is_active: joi_1.default.boolean().required(),
    agency_id: joi_1.default.string().uuid().required()
});
exports.UpdateTripValidation = joi_1.default.object({
    title: joi_1.default.string().trim().min(2).optional(),
    slug: joi_1.default.string().trim().min(2).optional(),
    short_description: joi_1.default.string().trim().min(2).optional(),
    description: joi_1.default.string().trim().min(2).optional(),
    destination: joi_1.default.string().trim().min(2).optional(),
    meeting_point: joi_1.default.string().trim().min(2).optional(),
    duration_days: joi_1.default.number().min(0).optional(),
    duration_nights: joi_1.default.number().min(0).optional(),
    price: joi_1.default.number().min(0).precision(2).optional(),
    discount_price: joi_1.default.number().min(0).precision(2).optional(),
    total_seats: joi_1.default.number().min(0).optional(),
    start_date: joi_1.default.date()
        .min("now")
        .optional()
        .messages({
        "date.min": "Start date cannot be in the past",
    }),
    end_date: joi_1.default.date()
        .min("now")
        .optional()
        .messages({
        "date.min": "End date cannot be in the past",
    }),
    booking_deadline: joi_1.default.date()
        .min("now")
        .optional()
        .messages({
        "date.min": "Booking deadline cannot be in the past",
    }),
    is_active: joi_1.default.boolean().optional(),
    agency_id: joi_1.default.string().uuid().optional()
});

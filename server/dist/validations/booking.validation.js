"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBookingValidation = exports.CreateBookingValidation = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
exports.CreateBookingValidation = joi_1.default.object({
    total_amount: joi_1.default.number().min(0).required(),
    booking_status: joi_1.default.string().valid(...Object.values(client_1.BOOKING_STATUS)).optional(),
    payment_status: joi_1.default.string().valid(...Object.values(client_1.PAYMENT_STATUS)).optional(),
    special_request: joi_1.default.string().trim().allow("").optional(),
    user_id: joi_1.default.string().uuid().required(),
    trip_id: joi_1.default.string().uuid().required()
});
exports.UpdateBookingValidation = joi_1.default.object({
    total_amount: joi_1.default.number().min(0).optional(),
    booking_status: joi_1.default.string().valid(...Object.values(client_1.BOOKING_STATUS)).optional(),
    payment_status: joi_1.default.string().valid(...Object.values(client_1.PAYMENT_STATUS)).optional(),
    special_request: joi_1.default.string().trim().allow("").optional(),
    user_id: joi_1.default.string().uuid().optional(),
    trip_id: joi_1.default.string().uuid()
});

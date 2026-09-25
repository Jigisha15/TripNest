"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCancellationValidation = exports.CreateCancellationValidation = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
exports.CreateCancellationValidation = joi_1.default.object({
    status: joi_1.default.string().valid(...Object.values(client_1.CANCELLATION_STATUS)).optional(),
    payment_status: joi_1.default.string().valid(...Object.values(client_1.PAYMENT_STATUS)).optional(),
    cancelled_by: joi_1.default.string().valid(...Object.values(client_1.ROLE)).optional(),
    cancellation_reason: joi_1.default.string().trim().min(5).max(500).required(),
    cancelled_at: joi_1.default.date().required(),
    refund_amount: joi_1.default.number().min(0).optional(),
    refund_processed_at: joi_1.default.date().optional(),
    booking_id: joi_1.default.string().uuid().required()
});
exports.UpdateCancellationValidation = joi_1.default.object({
    status: joi_1.default.string().valid(...Object.values(client_1.CANCELLATION_STATUS)).optional(),
    payment_status: joi_1.default.string().valid(...Object.values(client_1.PAYMENT_STATUS)).optional(),
    cancelled_by: joi_1.default.string().valid(...Object.values(client_1.ROLE)).optional(),
    cancellation_reason: joi_1.default.string().trim().min(5).max(500).optional(),
    cancelled_at: joi_1.default.date().optional(),
    refund_amount: joi_1.default.number().min(0).optional(),
    refund_processed_at: joi_1.default.date().optional(),
    booking_id: joi_1.default.string().uuid().required()
});

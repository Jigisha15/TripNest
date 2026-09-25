"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewValidation = exports.CreateReviewValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateReviewValidation = joi_1.default.object({
    rating: joi_1.default.number().min(0).precision(1).optional(),
    title: joi_1.default.string().trim().min(2).optional(),
    comment: joi_1.default.string().trim().min(2).optional(),
    user_id: joi_1.default.string().uuid().required(),
    trip_id: joi_1.default.string().uuid().required(),
    booking_id: joi_1.default.string().uuid().required(),
});
exports.UpdateReviewValidation = joi_1.default.object({
    rating: joi_1.default.number().min(0).precision(1).optional(),
    title: joi_1.default.string().trim().min(2).optional(),
    comment: joi_1.default.string().trim().min(2).optional(),
    user_id: joi_1.default.string().uuid().optional(),
    trip_id: joi_1.default.string().uuid().optional(),
    booking_id: joi_1.default.string().uuid().optional(),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTripImageValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateTripImageValidation = joi_1.default.object({
    is_thumbnail: joi_1.default.boolean().required(),
    user_id: joi_1.default.string().trim().uuid().required(),
    trip_id: joi_1.default.string().trim().uuid().required(),
});

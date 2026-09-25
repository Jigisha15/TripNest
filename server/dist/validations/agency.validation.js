"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAgencyValidation = exports.CreateAgencyValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateAgencyValidation = joi_1.default.object({
    name: joi_1.default.string()
        .trim()
        .pattern(/^[A-Za-z ]+$/)
        .min(2)
        .required()
        .messages({
        "string.pattern.base": "Name should contain only alphabets.",
    }),
    slug: joi_1.default.string()
        .trim()
        .min(2)
        .optional(),
    description: joi_1.default.string()
        .trim()
        .min(2)
        .optional(),
    email_id: joi_1.default.string()
        .trim()
        .email()
        .required(),
    phone_number: joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
        "string.pattern.base": "Phone number must contain exactly 10 digits.",
    }),
    password: joi_1.default.string()
        .min(5)
        .max(32)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/)
        .required()
        .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
    website: joi_1.default.string().trim().uri().allow("").optional(),
    address: joi_1.default.string().trim().min(2).required(),
    city: joi_1.default.string().trim().min(2).required(),
    state: joi_1.default.string().trim().min(2).required(),
    country: joi_1.default.string().trim().min(2).required(),
    is_active: joi_1.default.boolean().required(),
    user_id: joi_1.default.string().uuid().required()
});
exports.UpdateAgencyValidation = joi_1.default.object({
    name: joi_1.default.string()
        .trim()
        .pattern(/^[A-Za-z ]+$/)
        .min(2)
        .optional()
        .messages({
        "string.pattern.base": "First name should contain only alphabets.",
    }),
    slug: joi_1.default.string()
        .trim()
        .min(2)
        .optional(),
    description: joi_1.default.string()
        .trim()
        .min(2)
        .optional(),
    email_id: joi_1.default.string()
        .trim()
        .email()
        .optional(),
    phone_number: joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
        "string.pattern.base": "Phone number must contain exactly 10 digits.",
    }),
    password: joi_1.default.string()
        .min(5)
        .max(32)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/)
        .optional()
        .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
    website: joi_1.default.string().trim().uri().allow("").optional(),
    address: joi_1.default.string().trim().min(2).optional(),
    city: joi_1.default.string().trim().min(2).optional(),
    state: joi_1.default.string().trim().min(2).optional(),
    country: joi_1.default.string().trim().min(2).optional(),
    is_active: joi_1.default.boolean().optional(),
    user_id: joi_1.default.string().uuid().optional()
});

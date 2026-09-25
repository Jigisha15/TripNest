"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidation = exports.RegisterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.RegisterValidation = joi_1.default.object({
    first_name: joi_1.default.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .min(2)
        .max(50)
        .required()
        .messages({
        "string.pattern.base": "First name should contain only alphabets.",
    }),
    last_name: joi_1.default.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .min(2)
        .max(50)
        .required()
        .messages({
        "string.pattern.base": "Last name should contain only alphabets.",
    }),
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
    role: joi_1.default.string()
        .valid(...Object.values(client_1.ROLE)),
});
exports.LoginValidation = joi_1.default.object({
    email_id: joi_1.default.string()
        .trim()
        .email()
        .required(),
    password: joi_1.default.string()
        .min(5)
        .max(32)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/)
        .required()
        .messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
    //role: Joi.string()
    //	.valid(...Object.values(ROLE)),
});

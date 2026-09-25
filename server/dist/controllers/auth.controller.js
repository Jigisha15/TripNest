"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_validation_1 = require("../validations/auth.validation");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const prisma_client_1 = require("../utils/prisma-client");
// register
const register = async (req, res) => {
    try {
        // check the payload - validate payload
        const { error, value } = auth_validation_1.RegisterValidation.validate(req.body, {
            abortEarly: false
        });
        // if any errors then pass
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payload",
                error: error
            });
        }
        // check if user with same email id already exists
        const existingUser = await prisma_client_1.prisma.user.findFirst({
            where: { email_id: value.email_id }
        });
        // if any errors then pass
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with the same emailId already exists"
            });
        }
        // hash the password
        const hashedPassword = await (0, password_1.hashPassword)(value.password);
        // register new user
        const newUser = await prisma_client_1.prisma.user.create({
            data: {
                first_name: value.first_name,
                last_name: value.last_name,
                email_id: value.email_id,
                phone_number: value.phone_number,
                password: hashedPassword,
                role: value.role
            }
        });
        // give success message
        return res.status(201).json({
            success: true,
            message: `${newUser.first_name} ${newUser.last_name} created successfully!`,
            data: newUser
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error
        });
    }
};
exports.register = register;
// login
const login = async (req, res) => {
    try {
        // check the payload - validate payload
        const { error, value } = auth_validation_1.LoginValidation.validate(req.body, {
            abortEarly: false
        });
        // if any errors then pass
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payload",
                error: error
            });
        }
        // check if user exists
        const existingUser = await prisma_client_1.prisma.user.findFirst({
            where: { email_id: value.email_id }
        });
        // if any errors then pass
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: `User with ${value.email_id} email id not found`,
            });
        }
        // compare the existing and entered password
        const matchingPassword = await (0, password_1.comparePasswords)(value.password, existingUser.password);
        // return errors if any
        if (!matchingPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }
        // create token
        const token = await (0, jwt_1.generateToken)({
            id: existingUser.id,
            email_id: value.email_id,
            role: existingUser.role
        });
        // return response
        return res.status(200).json({
            success: true,
            message: `${existingUser.first_name} user logged in successfully!`,
            data: {
                ...existingUser,
                token: token
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error
        });
    }
};
exports.login = login;
// logout

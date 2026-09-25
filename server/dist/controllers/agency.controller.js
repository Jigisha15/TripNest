"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgency = exports.updateAgency = exports.registerAgency = exports.getAgency = void 0;
const prisma_client_1 = require("../utils/prisma-client");
const agency_validation_1 = require("../validations/agency.validation");
const password_1 = require("../utils/password");
const upload_image_1 = require("../utils/upload-image");
// get agency
const getAgency = async (req, res) => {
    const { agency_id, user_id, email_id } = req.query;
    try {
        const agencies = await prisma_client_1.prisma.agency.findMany({
            where: {
                ...(agency_id && { id: agency_id }),
                ...(user_id && { owner_id: user_id }),
                ...(email_id && { email_id: email_id }),
            },
            include: {
                owner: {
                    select: {
                        first_name: true,
                        last_name: true,
                        email_id: true,
                    }
                }
            }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: agencies.length > 0 ? "Data fetched successfully." : "No agencies exist.",
            data: agencies
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
exports.getAgency = getAgency;
// create agency - register
const registerAgency = async (req, res) => {
    try {
        // check the payload - validate payload
        const { error, value } = agency_validation_1.CreateAgencyValidation.validate(req.body, {
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
        // check if user already exists
        const existingUser = await prisma_client_1.prisma.user.findFirst({
            where: { id: value.user_id }
        });
        // if any errors then pass
        if (!existingUser) {
            return res.status(409).json({
                success: false,
                message: "User not found.",
            });
        }
        // check if any agency with the same email id already exists
        const existingAgency = await prisma_client_1.prisma.agency.findFirst({
            where: { email_id: value.email_id }
        });
        // if any errors then pass
        if (existingAgency) {
            return res.status(409).json({
                success: false,
                message: "Agency with the same email id already exists."
            });
        }
        // hash the password
        const hashedPassword = await (0, password_1.hashPassword)(value.password);
        // check if any images are added
        let imageUrl;
        const files = req.files;
        if (files?.logo?.length) {
            const uploadedImage = await (0, upload_image_1.uploadImage)(files.logo[0], "agency/logo");
            imageUrl = uploadedImage.secure_url;
        }
        // register new agency
        const newAgency = await prisma_client_1.prisma.agency.create({
            data: {
                name: value.name,
                slug: value.slug,
                description: value.description,
                email_id: value.email_id,
                phone_number: value.phone_number,
                website: value.website,
                address: value.address,
                city: value.city,
                state: value.state,
                country: value.country,
                is_active: true,
                password: hashedPassword,
                logo: imageUrl,
                owner_id: value.user_id
            }
        });
        // return response
        return res.status(201).json({
            success: true,
            message: "Agency registered successfully!",
            data: newAgency
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
exports.registerAgency = registerAgency;
// update agency
const updateAgency = async (req, res) => {
    const { agency_id } = req.params;
    try {
        // check if parameter is being sent
        if (!agency_id) {
            return res.status(400).json({
                success: false,
                message: "agency_id parameter is missing"
            });
        }
        // check the payload - validate payload
        const { error, value } = agency_validation_1.UpdateAgencyValidation.validate(req.body, {
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
        // check if agency exists
        const existingAgency = await prisma_client_1.prisma.agency.findFirst({
            where: { id: agency_id }
        });
        // pass errors if any
        if (!existingAgency) {
            return res.status(404).json({
                success: false,
                message: "Agency not found."
            });
        }
        // check if email id is passed
        if (value.email_id && value.email_id !== existingAgency.email_id) {
            const duplicateAgency = await prisma_client_1.prisma.agency.findUnique({
                where: {
                    email_id: value.email_id
                }
            });
            if (duplicateAgency) {
                return res.status(409).json({
                    success: false,
                    message: "Another agency already uses this email."
                });
            }
        }
        // check if password is passed
        let hashedPassword = existingAgency.password;
        if (value.password) {
            hashedPassword = await (0, password_1.hashPassword)(value.password);
        }
        // check if logo is passed
        let imageUrl = existingAgency.logo;
        const files = req.files;
        if (files?.logo?.length) {
            const uploadedImage = await (0, upload_image_1.uploadImage)(files.logo[0], "agency/logo");
            imageUrl = uploadedImage.secure_url;
        }
        // update agency
        const updatedAgency = await prisma_client_1.prisma.agency.update({
            where: { id: agency_id },
            data: {
                name: value.name,
                slug: value.slug,
                description: value.description,
                email_id: value.email_id,
                phone_number: value.phone_number,
                website: value.website,
                address: value.address,
                city: value.city,
                state: value.state,
                country: value.country,
                is_active: value.is_active,
                password: hashedPassword,
                logo: imageUrl,
                owner_id: value.user_id
            }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Agency updated successfully!",
            data: updatedAgency
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
exports.updateAgency = updateAgency;
// delete agency
const deleteAgency = async (req, res) => {
    const { agency_id } = req.params;
    try {
        // check if parameter is being sent
        if (!agency_id) {
            return res.status(400).json({
                success: false,
                message: "agency_id parameter is missing"
            });
        }
        // check if agency exists
        const existingAgency = await prisma_client_1.prisma.agency.findUnique({
            where: { id: agency_id }
        });
        // pass errors if any
        if (!existingAgency) {
            return res.status(404).json({
                success: false,
                message: "Agency not found."
            });
        }
        // delete agency
        await prisma_client_1.prisma.agency.delete({
            where: { id: agency_id }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Agency deleted successfully!"
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
exports.deleteAgency = deleteAgency;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCancellation = exports.updateCancellation = exports.createCancellation = exports.getCancellation = void 0;
const prisma_client_1 = require("../utils/prisma-client");
const cancellation_validation_1 = require("../validations/cancellation.validation");
// get
const getCancellation = async (req, res) => {
    const { id, booking_id, status } = req.query;
    try {
        const cancellations = await prisma_client_1.prisma.review.findMany({
            where: {
                ...(id && {
                    id: id,
                }),
                ...(booking_id && {
                    booking_id: booking_id,
                }),
                ...(status && {
                    status: status,
                }),
            },
        });
        // return response
        return res.status(200).json({
            success: true,
            message: cancellations.length > 0 ? "Data fetched successfully." : "No cancellations exist.",
            data: cancellations
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};
exports.getCancellation = getCancellation;
// crete
const createCancellation = async (req, res) => {
    try {
        // Validate payload
        const { error, value } = cancellation_validation_1.CreateCancellationValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid payload",
                error,
            });
        }
        // Create cancellation
        const cancellation = await prisma_client_1.prisma.cancellation.create({
            data: {
                status: value.status,
                payment_status: value.payment_status,
                cancelled_by: value.cancelled_by,
                cancellation_reason: value.cancellation_reason,
                cancelled_at: value.cancelled_at,
                refund_amount: value.refund_amount,
                refund_processed_at: value.refund_processed_at,
                booking_id: value.booking_id
            },
        });
        return res.status(201).json({
            success: true,
            message: "Cancellation created successfully.",
            data: cancellation,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error,
        });
    }
};
exports.createCancellation = createCancellation;
// update
const updateCancellation = async (req, res) => {
    const cancellation_id = req.params.id;
    try {
        // Validate payload
        const { error, value } = cancellation_validation_1.UpdateCancellationValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid payload",
                error,
            });
        }
        // Check if cancellation exists
        const existingCancellation = await prisma_client_1.prisma.cancellation.findUnique({
            where: {
                id: cancellation_id,
            },
        });
        if (!existingCancellation) {
            return res.status(404).json({
                success: false,
                message: "Cancellation not found.",
            });
        }
        // Update cancellation
        const updatedCancellation = await prisma_client_1.prisma.cancellation.update({
            where: {
                id: cancellation_id,
            },
            data: {
                status: value.status,
                payment_status: value.payment_status,
                cancelled_by: value.cancelled_by,
                cancellation_reason: value.cancellation_reason,
                cancelled_at: value.cancelled_at,
                refund_amount: value.refund_amount,
                refund_processed_at: value.refund_processed_at,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Cancellation updated successfully.",
            data: updatedCancellation,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error,
        });
    }
};
exports.updateCancellation = updateCancellation;
// delete
const deleteCancellation = async (req, res) => {
    const cancellation_id = req.params.id;
    try {
        // Check if cancellation exists
        const existingCancellation = await prisma_client_1.prisma.cancellation.findUnique({
            where: {
                id: cancellation_id,
            },
        });
        if (!existingCancellation) {
            return res.status(404).json({
                success: false,
                message: "Cancellation not found.",
            });
        }
        // Delete cancellation
        await prisma_client_1.prisma.cancellation.delete({
            where: {
                id: cancellation_id,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Cancellation deleted successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error,
        });
    }
};
exports.deleteCancellation = deleteCancellation;

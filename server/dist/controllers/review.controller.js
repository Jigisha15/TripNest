"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReviews = void 0;
const prisma_client_1 = require("../utils/prisma-client");
const review_validation_1 = require("../validations/review.validation");
// get
const getReviews = async (req, res) => {
    const { trip_id, user_id, booking_id } = req.query;
    try {
        const reviews = await prisma_client_1.prisma.review.findMany({
            where: {
                ...(trip_id && {
                    trip_id: trip_id,
                }),
                ...(user_id && {
                    user_id: user_id,
                }),
                ...(booking_id && {
                    booking_id: booking_id,
                }),
            },
        });
        // return response
        return res.status(200).json({
            success: true,
            message: reviews.length > 0 ? "Data fetched successfully." : "No reviews exist.",
            data: reviews
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
exports.getReviews = getReviews;
// create
const createReview = async (req, res) => {
    try {
        // validate response
        const { error, value } = review_validation_1.CreateReviewValidation.validate(req.body, {
            abortEarly: false,
        });
        // pass errors if any
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payload",
                error: error
            });
        }
        // check if user exists
        const existingUser = await prisma_client_1.prisma.user.findUnique({
            where: { id: value.user_id }
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // check if trip exists
        const existingTrip = await prisma_client_1.prisma.trip.findUnique({
            where: { id: value.trip_id }
        });
        if (!existingTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // check if booking exists
        const existingBooking = await prisma_client_1.prisma.booking.findUnique({
            where: { id: value.booking_id }
        });
        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        // create new review
        const newReview = await prisma_client_1.prisma.review.create({
            data: value
        });
        // return response
        return res.status(201).json({
            success: true,
            message: "Review created successfully!",
            data: newReview
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
exports.createReview = createReview;
// update
const updateReview = async (req, res) => {
    const { review_id } = req.params;
    try {
        // check if parameter is passed
        if (!review_id) {
            return res.status(404).json({
                success: false,
                message: "review_id is missing parameter"
            });
        }
        // valiate payload
        const { error, value } = review_validation_1.UpdateReviewValidation.validate(req.body, {
            abortEarly: false
        });
        // pass errors if any
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid payload",
                error: error
            });
        }
        // check if review exists
        const existingReview = await prisma_client_1.prisma.review.findUnique({
            where: { id: review_id }
        });
        // pass errors if any
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        // update data
        const updatedReview = await prisma_client_1.prisma.review.update({
            where: { id: review_id },
            data: value
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Review updated successfully!",
            data: updatedReview
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
exports.updateReview = updateReview;
// delete
const deleteReview = async (req, res) => {
    const { review_id } = req.params;
    try {
        // check if parameter is passed
        if (!review_id) {
            return res.status(404).json({
                success: false,
                message: "review_id is missing parameter"
            });
        }
        // check if review exists
        const existingReview = await prisma_client_1.prisma.review.findUnique({
            where: { id: review_id }
        });
        // pass errors if any
        if (!existingReview) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }
        // delete data
        await prisma_client_1.prisma.review.delete({
            where: { id: review_id },
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully!",
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
exports.deleteReview = deleteReview;

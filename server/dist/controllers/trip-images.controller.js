"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTripImage = exports.postTripImage = exports.getTripImages = void 0;
const prisma_client_1 = require("../utils/prisma-client");
const trip_images_validation_1 = require("../validations/trip-images.validation");
const upload_image_1 = require("../utils/upload-image");
// get
const getTripImages = async (req, res) => {
    const { id, is_thumbnail, trip_id, user_id } = req.query;
    try {
        const trips = await prisma_client_1.prisma.trip.findMany({
            where: {
                ...(id && { id: id }),
                ...(trip_id && { trip_id: trip_id }),
                ...(user_id && { user_id: user_id }),
                ...(is_thumbnail !== undefined && {
                    is_thumbnail: is_thumbnail === "true",
                }),
            }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: trips.length > 0 ? "Data fetched successfully." : "No trip images exist.",
            data: trips
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
exports.getTripImages = getTripImages;
// create
const postTripImage = async (req, res) => {
    try {
        // check the payload - validate payload
        const { error, value } = trip_images_validation_1.CreateTripImageValidation.validate(req.body, {
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
                message: "User not found."
            });
        }
        // check if trip already exists
        const existingTrip = await prisma_client_1.prisma.trip.findFirst({
            where: { id: value.trip_id }
        });
        // if any errors then pass
        if (!existingTrip) {
            return res.status(409).json({
                success: false,
                message: "Trip not found."
            });
        }
        // check if any images are added
        let imageUrl;
        const files = req.files;
        if (files?.logo?.length) {
            const uploadedImage = await (0, upload_image_1.uploadImage)(files.logo[0], "trip_image/image_url");
            imageUrl = uploadedImage.secure_url;
        }
        // post new trip image
        const newTripImage = await prisma_client_1.prisma.tripImages.create({
            data: {
                image_url: imageUrl,
                is_thumbnail: value.is_thumbnail,
                user_id: value.user_id,
                trip_id: value.trip_id,
            }
        });
        // return response
        return res.status(201).json({
            success: true,
            message: "Trip image posted successfully!",
            data: newTripImage
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
exports.postTripImage = postTripImage;
// delete
const deleteTripImage = async (req, res) => {
    const { trip_image_id } = req.params;
    try {
        // check if parameter is being sent
        if (!trip_image_id) {
            return res.status(400).json({
                success: false,
                message: "trip_image_id parameter is missing"
            });
        }
        // check if agency exists
        const existingTripImage = await prisma_client_1.prisma.tripImages.findUnique({
            where: { id: trip_image_id }
        });
        // pass errors if any
        if (!existingTripImage) {
            return res.status(404).json({
                success: false,
                message: "Trip image not found."
            });
        }
        // delete agency
        await prisma_client_1.prisma.tripImages.delete({
            where: { id: trip_image_id }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Trip image deleted successfully!"
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
exports.deleteTripImage = deleteTripImage;

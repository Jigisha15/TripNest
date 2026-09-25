"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrip = exports.updateTrip = exports.createTrip = exports.getTrip = void 0;
const prisma_client_1 = require("../utils/prisma-client");
const trip_validation_1 = require("../validations/trip.validation");
// get
const getTrip = async (req, res) => {
    const { agency_id, trip_id, is_active } = req.query;
    try {
        const trips = await prisma_client_1.prisma.trip.findMany({
            where: {
                ...(agency_id && { agency_id: agency_id }),
                ...(trip_id && { id: trip_id }),
                ...(is_active !== undefined && {
                    is_active: is_active === "true",
                }),
            }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: trips.length > 0 ? "Data fetched successfully." : "No trips exist.",
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
exports.getTrip = getTrip;
// create
const createTrip = async (req, res) => {
    try {
        // check the payload - validate payload
        const { error, value } = trip_validation_1.CreateTripValidation.validate(req.body, {
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
        const payload = {
            ...value,
            average_rating: 0,
            total_reviews: 0,
            available_seats: value.total_seats
        };
        // create trip
        const newTrip = await prisma_client_1.prisma.trip.create({
            data: payload
        });
        // return response
        return res.status(201).json({
            success: true,
            message: "Trip created successfully!",
            data: newTrip
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
exports.createTrip = createTrip;
// update
const updateTrip = async (req, res) => {
    const { trip_id } = req.params;
    try {
        // check if parameter is being sent
        if (!trip_id) {
            return res.status(400).json({
                success: false,
                message: "trip_id parameter is missing"
            });
        }
        // check the payload - validate payload
        const { error, value } = trip_validation_1.UpdateTripValidation.validate(req.body, {
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
        // check if trip exists
        const existingTrip = await prisma_client_1.prisma.trip.findUnique({
            where: { id: trip_id }
        });
        // pass errors if any
        if (!existingTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        // update trip
        const updatedTrip = await prisma_client_1.prisma.trip.update({
            where: { id: trip_id },
            data: value
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Trip updated successfully!",
            data: updatedTrip
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
exports.updateTrip = updateTrip;
// delete
const deleteTrip = async (req, res) => {
    const { trip_id } = req.params;
    try {
        // check if parameter is being sent
        if (!trip_id) {
            return res.status(400).json({
                success: false,
                message: "trip_id parameter is missing"
            });
        }
        // check if trip exists
        const existingTrip = await prisma_client_1.prisma.trip.findUnique({
            where: { id: trip_id }
        });
        // pass errors if any
        if (!existingTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found."
            });
        }
        // delete trip
        await prisma_client_1.prisma.trip.delete({
            where: { id: trip_id }
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "Trip deleted successfully!"
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
exports.deleteTrip = deleteTrip;

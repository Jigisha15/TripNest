"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItinerary = exports.updateItinerary = exports.createItinerary = exports.getItinerary = void 0;
const prisma_client_1 = require("../utils/prisma-client");
const itinerary_validation_1 = require("../validations/itinerary.validation");
// get
const getItinerary = async (req, res) => {
    const { id, trip_id } = req.query;
    try {
        const itineraries = await prisma_client_1.prisma.itinerary.findMany({
            where: {
                ...(id && { id: id }),
                ...(trip_id && { trip_id: trip_id }),
            },
            select: {
                id: true,
                title: true,
                description: true,
                trip_id: true,
                type: true,
                day_number: true,
                night_number: true,
                created_at: true,
                updated_at: true,
                items: true
            }
        });
        // Sort the itinerary in a chronological order
        const sortedItineraries = itineraries.sort((a, b) => {
            const aNumber = a.type === "DAY" ? a.day_number : a.night_number;
            const bNumber = b.type === "DAY" ? b.day_number : b.night_number;
            // First compare the day/night number
            if (aNumber !== bNumber) {
                return (aNumber ?? 0) - (bNumber ?? 0);
            }
            // If number is same, DAY comes before NIGHT
            if (a.type === "DAY" && b.type === "NIGHT") {
                return -1;
            }
            if (a.type === "NIGHT" && b.type === "DAY") {
                return 1;
            }
            return 0;
        });
        // return response
        return res.status(200).json({
            success: true,
            message: itineraries.length > 0 ? "Data fetched successfully." : "No itineraries exist.",
            data: sortedItineraries
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
exports.getItinerary = getItinerary;
// create
const createItinerary = async (req, res) => {
    try {
        // 1. Validate request payload
        const { error, value } = itinerary_validation_1.CreateItineraryValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({ success: false, message: "Invalid Payload", error: error.details, });
        }
        // 2. Check if trip exists
        const trip = await prisma_client_1.prisma.trip.findUnique({
            where: {
                id: value.trip_id,
            },
            select: {
                id: true,
                duration_days: true,
                duration_nights: true,
            },
        });
        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found.", });
        }
        // 3. Check if itinerary already exists for this trip
        const existingItinerary = await prisma_client_1.prisma.itinerary.findFirst({
            where: {
                trip_id: value.trip_id,
            },
            select: {
                id: true,
            },
        });
        if (existingItinerary) {
            return res.status(409).json({ success: false, message: "Itinerary already exists for this trip.", });
        }
        // 4. Validate DAY / NIGHT numbers
        const seenDays = new Set();
        const seenNights = new Set();
        for (const itinerary of value.itineraries) {
            // DAY validation
            if (itinerary.type === "DAY") {
                if (itinerary.day_number === undefined || itinerary.day_number === null) {
                    return res.status(400).json({
                        success: false,
                        message: "day_number is required for DAY itinerary.",
                    });
                }
                if (itinerary.day_number > trip.duration_days) {
                    return res.status(400).json({
                        success: false,
                        message: `Day ${itinerary.day_number} exceeds the trip duration of ${trip.duration_days} days.`,
                    });
                }
                // Prevent duplicate Day sections
                if (seenDays.has(itinerary.day_number)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate itinerary found for Day ${itinerary.day_number}.`,
                    });
                }
                seenDays.add(itinerary.day_number);
            }
            // NIGHT validation
            if (itinerary.type === "NIGHT") {
                if (itinerary.night_number === undefined || itinerary.night_number === null) {
                    return res.status(400).json({
                        success: false,
                        message: "night_number is required for NIGHT itinerary.",
                    });
                }
                if (itinerary.night_number > trip.duration_nights) {
                    return res.status(400).json({
                        success: false,
                        message: `Night ${itinerary.night_number} exceeds the trip duration of ${trip.duration_nights} nights.`,
                    });
                }
                // Prevent duplicate Night sections
                if (seenNights.has(itinerary.night_number)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate itinerary found for Night ${itinerary.night_number}.`,
                    });
                }
                seenNights.add(itinerary.night_number);
            }
            // Ensure itinerary has at least one item
            if (!itinerary.items || itinerary.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: `${itinerary.type} ${itinerary.day_number ?? itinerary.night_number} must contain at least one itinerary item.`,
                });
            }
        }
        // 5. Create itinerary + itinerary items
        const createdItineraries = await prisma_client_1.prisma.$transaction(async (tx) => {
            const results = [];
            for (const itinerary of value.itineraries) {
                const created = await tx.itinerary.create({
                    data: {
                        trip_id: value.trip_id,
                        type: itinerary.type,
                        day_number: itinerary.type === "DAY"
                            ? itinerary.day_number
                            : null,
                        night_number: itinerary.type === "NIGHT"
                            ? itinerary.night_number
                            : null,
                        title: itinerary.title,
                        description: itinerary.description ?? null,
                        items: {
                            create: itinerary.items.map((item, index) => ({
                                title: item.title,
                                description: item.description ?? null,
                                sequence: index + 1,
                            })),
                        },
                    },
                    include: {
                        items: {
                            orderBy: {
                                sequence: "asc",
                            },
                        },
                    },
                });
                results.push(created);
            }
            return results;
        });
        // 6. Return success response
        return res.status(201).json({ success: true, message: "Itinerary created successfully.", data: createdItineraries, });
    }
    catch (error) {
        console.error("Create itinerary error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
exports.createItinerary = createItinerary;
// update
const updateItinerary = async (req, res) => {
    const { trip_id } = req.params;
    try {
        // validate parameters
        if (!trip_id) {
            return res.status(400).json({
                success: false,
                message: "trip_id parameter is missing.",
            });
        }
        // validate payload
        const { error, value } = itinerary_validation_1.UpdateItineraryValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid payload.",
                error: error.details,
            });
        }
        const { itineraries } = value;
        // check if trip exists or not
        const trip = await prisma_client_1.prisma.trip.findUnique({
            where: {
                id: trip_id,
            },
            select: {
                id: true,
                duration_days: true,
                duration_nights: true,
            },
        });
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found.",
            });
        }
        // validate day/night numbers from backend
        const dayNumbers = itineraries
            .filter((item) => item.type === "DAY")
            .map((item) => item.day_number);
        const nightNumbers = itineraries
            .filter((item) => item.type === "NIGHT")
            .map((item) => item.night_number);
        // Day exceeds trip duration
        if (dayNumbers.some((dayNumber) => dayNumber > trip.duration_days)) {
            return res.status(400).json({
                success: false,
                message: `Day number cannot exceed ${trip.duration_days}.`,
            });
        }
        // Night exceeds trip duration
        if (nightNumbers.some((nightNumber) => nightNumber > trip.duration_nights)) {
            return res.status(400).json({
                success: false,
                message: `Night number cannot exceed ${trip.duration_nights}.`,
            });
        }
        // Duplicate days
        if (new Set(dayNumbers).size !== dayNumbers.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate day numbers are not allowed.",
            });
        }
        // Duplicate nights
        if (new Set(nightNumbers).size !== nightNumbers.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate night numbers are not allowed.",
            });
        }
        // check if an itinerary already exists for this trip - because we want 1 itinerary per trip
        const existingItineraries = await prisma_client_1.prisma.itinerary.findMany({
            where: {
                trip_id: trip_id,
            },
            select: {
                id: true,
            },
        });
        const existingItineraryIds = new Set(existingItineraries.map((itinerary) => itinerary.id));
        // IDs received from frontend
        const payloadItineraryIds = itineraries
            .filter((itinerary) => itinerary.id)
            .map((itinerary) => itinerary.id);
        // Make sure every supplied itinerary ID belongs to this trip
        const invalidItineraryId = payloadItineraryIds.find((id) => !existingItineraryIds.has(id));
        if (invalidItineraryId) {
            return res.status(400).json({
                success: false,
                message: "One or more itinerary IDs do not belong to this trip.",
            });
        }
        // transaction
        await prisma_client_1.prisma.$transaction(async (tx) => {
            for (const itinerary of itineraries) {
                let itineraryId = itinerary.id;
                // update existing itinerary
                if (itineraryId) {
                    await tx.itinerary.update({
                        where: {
                            id: itineraryId,
                        },
                        data: {
                            type: itinerary.type,
                            day_number: itinerary.type === "DAY"
                                ? itinerary.day_number
                                : null,
                            night_number: itinerary.type === "NIGHT"
                                ? itinerary.night_number
                                : null,
                            title: itinerary.title,
                            description: itinerary.description ?? null,
                        },
                    });
                }
                // create new itinerary entry
                else {
                    const created = await tx.itinerary.create({
                        data: {
                            trip_id: trip_id,
                            type: itinerary.type,
                            day_number: itinerary.type === "DAY"
                                ? itinerary.day_number
                                : null,
                            night_number: itinerary.type === "NIGHT"
                                ? itinerary.night_number
                                : null,
                            title: itinerary.title,
                            description: itinerary.description ?? null,
                        },
                    });
                    itineraryId = created.id;
                    payloadItineraryIds.push(created.id);
                }
                // existing items for this itinerary
                const existingItems = await tx.itineraryItem.findMany({
                    where: {
                        itinerary_id: itineraryId,
                    },
                    select: {
                        id: true,
                    },
                });
                const existingItemIds = new Set(existingItems.map((item) => item.id));
                // IDs sent from frontend
                const payloadItemIds = itinerary.items
                    .filter((item) => item.id)
                    .map((item) => item.id);
                // validate item ids
                const invalidItemId = payloadItemIds.find((id) => !existingItemIds.has(id));
                if (invalidItemId) {
                    throw new Error("One or more itinerary item IDs do not belong to this itinerary.");
                }
                // update/create new entries
                for (let index = 0; index < itinerary.items.length; index++) {
                    const item = itinerary.items[index];
                    // Existing item
                    if (item.id) {
                        await tx.itineraryItem.update({
                            where: {
                                id: item.id,
                            },
                            data: {
                                title: item.title,
                                description: item.description ?? null,
                                sequence: index + 1,
                            },
                        });
                    }
                    else {
                        // New item
                        const createdItem = await tx.itineraryItem.create({
                            data: {
                                itinerary_id: itineraryId,
                                title: item.title,
                                description: item.description ?? null,
                                sequence: index + 1,
                            },
                        });
                        payloadItemIds.push(createdItem.id);
                    }
                }
                // delete removed items
                await tx.itineraryItem.deleteMany({
                    where: {
                        itinerary_id: itineraryId,
                        ...(payloadItemIds.length > 0
                            ? {
                                id: {
                                    notIn: payloadItemIds,
                                },
                            }
                            : {}),
                    },
                });
            }
            // delete removed itineraries
            await tx.itinerary.deleteMany({
                where: {
                    trip_id: trip_id,
                    ...(payloadItineraryIds.length > 0
                        ? {
                            id: {
                                notIn: payloadItineraryIds,
                            },
                        }
                        : {}),
                },
            });
        });
        // response
        return res.status(200).json({
            success: true,
            message: "Itinerary updated successfully.",
        });
    }
    catch (error) {
        console.error("Update itinerary error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
exports.updateItinerary = updateItinerary;
// delete
const deleteItinerary = async (req, res) => {
    const { trip_id } = req.params;
    try {
        if (!trip_id) {
            return res.status(400).json({
                success: false,
                message: "trip_id is missing",
            });
        }
        // check if trip exists
        const existingTrip = await prisma_client_1.prisma.trip.findUnique({
            where: {
                id: trip_id
            }
        });
        // if not trip then throw err
        if (!existingTrip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        }
        // if trip exists then see if itinerary exists for this trip
        const existingItinerary = await prisma_client_1.prisma.itinerary.findMany({
            where: {
                trip_id: trip_id
            }
        });
        // if no itinerary for this trip then throw err
        if (existingItinerary.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Itinerary does not exist for this trip"
            });
        }
        // now delete the itinerary and its items
        const deletedItinerary = await prisma_client_1.prisma.itinerary.deleteMany({
            where: {
                trip_id: trip_id,
            },
        });
        // check if anything is deleted or not for this itinerary
        //if (deletedItinerary.count === 0) {
        //	return res.status(404).json({
        //		success: false,
        //		message: "Itinerary not found for this trip",
        //	});
        //}
        return res.status(200).json({
            success: true,
            message: "Itinerary deleted successfully!",
            data: {
                deleted_count: deletedItinerary.count,
            },
        });
    }
    catch (error) {
        console.error("Delete itinerary error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.deleteItinerary = deleteItinerary;

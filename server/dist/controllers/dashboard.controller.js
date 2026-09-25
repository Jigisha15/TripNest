"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = void 0;
const prisma_client_1 = require("../utils/prisma-client");
// get
const getDashboard = async (req, res) => {
    try {
        const today = new Date();
        // counts
        const [totalUsers, totalAgencies, totalTrips, totalBookings, totalReviews,] = await Promise.all([
            prisma_client_1.prisma.user.count(),
            prisma_client_1.prisma.agency.count(),
            prisma_client_1.prisma.trip.count(),
            prisma_client_1.prisma.booking.count(),
            prisma_client_1.prisma.review.count(),
        ]);
        // booking status
        const bookingStatusCounts = await prisma_client_1.prisma.booking.groupBy({
            by: ["booking_status"],
            _count: {
                _all: true,
            },
        });
        const bookingStatus = {
            pending: 0,
            confirmed: 0,
            rejected: 0,
            cancelled: 0,
            cancel_requested: 0,
            completed: 0,
        };
        bookingStatusCounts.forEach((item) => {
            switch (item.booking_status) {
                case "PENDING":
                    bookingStatus.pending =
                        item._count._all;
                    break;
                case "CONFIRMED":
                    bookingStatus.confirmed =
                        item._count._all;
                    break;
                case "REJECTED":
                    bookingStatus.rejected =
                        item._count._all;
                    break;
                case "CANCELLED":
                    bookingStatus.cancelled =
                        item._count._all;
                    break;
                case "CANCEL_REQUESTED":
                    bookingStatus.cancel_requested =
                        item._count._all;
                    break;
                case "COMPLETED":
                    bookingStatus.completed =
                        item._count._all;
                    break;
            }
        });
        // payment status
        const paymentStatusCounts = await prisma_client_1.prisma.booking.groupBy({
            by: ["payment_status"],
            _count: {
                _all: true,
            },
        });
        const paymentStatus = {
            pending: 0,
            partial_paid: 0,
            paid: 0,
            partial_refunded: 0,
            refunded: 0,
        };
        paymentStatusCounts.forEach((item) => {
            switch (item.payment_status) {
                case "PENDING":
                    paymentStatus.pending =
                        item._count._all;
                    break;
                case "PARTIAL_PAID":
                    paymentStatus.partial_paid =
                        item._count._all;
                    break;
                case "PAID":
                    paymentStatus.paid =
                        item._count._all;
                    break;
                case "PARTIAL_REFUNDED":
                    paymentStatus.partial_refunded =
                        item._count._all;
                    break;
                case "REFUNDED":
                    paymentStatus.refunded =
                        item._count._all;
                    break;
            }
        });
        // revenue
        const revenueResult = await prisma_client_1.prisma.booking.aggregate({
            where: {
                payment_status: "PAID",
            },
            _sum: {
                total_amount: true,
            },
        });
        const totalRevenue = Number(revenueResult._sum.total_amount ?? 0);
        // refunds
        const refundedResult = await prisma_client_1.prisma.cancellation.aggregate({
            where: {
                refund_amount: {
                    not: null,
                },
            },
            _sum: {
                refund_amount: true,
            },
        });
        const refundedAmount = Number(refundedResult._sum.refund_amount ?? 0);
        // trip status
        const [activeTrips, inactiveTrips, upcomingTrips, ongoingTrips, completedTrips,] = await Promise.all([
            prisma_client_1.prisma.trip.count({
                where: {
                    is_active: true,
                },
            }),
            prisma_client_1.prisma.trip.count({
                where: {
                    is_active: false,
                },
            }),
            prisma_client_1.prisma.trip.count({
                where: {
                    start_date: {
                        gt: today,
                    },
                },
            }),
            prisma_client_1.prisma.trip.count({
                where: {
                    start_date: {
                        lte: today,
                    },
                    end_date: {
                        gte: today,
                    },
                },
            }),
            prisma_client_1.prisma.trip.count({
                where: {
                    end_date: {
                        lt: today,
                    },
                },
            }),
        ]);
        // agencies
        const activeAgencies = await prisma_client_1.prisma.agency.count({
            where: {
                is_active: true,
            },
        });
        // reviews
        const ratingResult = await prisma_client_1.prisma.review.aggregate({
            _avg: {
                rating: true,
            },
        });
        const averageRating = Number(ratingResult._avg.rating ?? 0);
        const ratingCounts = await prisma_client_1.prisma.review.groupBy({
            by: ["rating"],
            _count: {
                _all: true,
            },
        });
        const ratingDistribution = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        ratingCounts.forEach((item) => {
            if (item.rating === null) {
                return;
            }
            const rating = Number(item.rating);
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating] =
                    item._count._all;
            }
        });
        // cancellations
        const [totalCancellations, pendingCancellations, approvedCancellations, rejectedCancellations,] = await Promise.all([
            prisma_client_1.prisma.cancellation.count(),
            prisma_client_1.prisma.cancellation.count({
                where: {
                    status: "PENDING",
                },
            }),
            prisma_client_1.prisma.cancellation.count({
                where: {
                    status: "APPROVED",
                },
            }),
            prisma_client_1.prisma.cancellation.count({
                where: {
                    status: "REJECTED",
                },
            }),
        ]);
        // recent bookings
        const recentBookings = await prisma_client_1.prisma.booking.findMany({
            orderBy: {
                created_at: "desc",
            },
            take: 10,
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email_id: true,
                    },
                },
                trip: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        // popular trips
        const popularTrips = await prisma_client_1.prisma.booking.groupBy({
            by: ["trip_id"],
            _count: {
                trip_id: true,
            },
            orderBy: {
                _count: {
                    trip_id: "desc",
                },
            },
            take: 5,
        });
        const popularTripIds = popularTrips.map((item) => item.trip_id);
        const popularTripDetails = await prisma_client_1.prisma.trip.findMany({
            where: {
                id: {
                    in: popularTripIds,
                },
            },
            select: {
                id: true,
                title: true,
                start_date: true,
                end_date: true,
                agency: {
                    select: {
                        name: true,
                    }
                }
            },
        });
        const popularTripsData = popularTrips.map((item) => {
            const trip = popularTripDetails.find((trip) => trip.id === item.trip_id);
            return {
                trip_id: item.trip_id,
                trip_title: trip?.title ?? null,
                booking_count: item._count.trip_id,
                agency_name: trip?.agency.name,
                start_date: trip?.start_date,
                end_date: trip?.end_date
            };
        });
        // recent reviews
        const recentReviews = await prisma_client_1.prisma.review.findMany({
            orderBy: {
                created_at: "desc",
            },
            take: 5,
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                    },
                },
                trip: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        // final response
        const data = {
            overview: {
                total_users: totalUsers,
                total_agencies: totalAgencies,
                total_trips: totalTrips,
                total_bookings: totalBookings,
                total_revenue: totalRevenue,
                pending_bookings: bookingStatus.pending,
                confirmed_bookings: bookingStatus.confirmed,
                cancelled_bookings: bookingStatus.cancelled,
                rejected_bookings: bookingStatus.rejected,
                pending_payments: paymentStatus.pending,
                refunded_amount: refundedAmount,
            },
            bookings: {
                by_status: bookingStatus,
                by_payment_status: paymentStatus,
            },
            revenue: {
                total: totalRevenue,
                monthly: [],
            },
            trips: {
                total: totalTrips,
                active: activeTrips,
                inactive: inactiveTrips,
                upcoming: upcomingTrips,
                ongoing: ongoingTrips,
                completed: completedTrips,
            },
            users: {
                total: totalUsers,
                monthly: [],
            },
            agencies: {
                total: totalAgencies,
                active: activeAgencies,
            },
            cancellations: {
                total: totalCancellations,
                pending: pendingCancellations,
                approved: approvedCancellations,
                rejected: rejectedCancellations,
                refunded_amount: refundedAmount,
            },
            reviews: {
                total: totalReviews,
                average_rating: averageRating,
                rating_distribution: ratingDistribution,
            },
            popular_trips: popularTripsData,
            recent_bookings: recentBookings,
            recent_reviews: recentReviews,
        };
        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data,
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
exports.getDashboard = getDashboard;

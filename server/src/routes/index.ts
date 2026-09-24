import { Router } from "express";
import authRoutes from "./auth.route"
import userRoutes from "./user.route"
import agencyRoutes from "./agency.route"
import tripRoutes from "./trip.route"
import tripImageRoutes from "./trip-images.route"
import itineraryRoutes from "./itinerary.route"
import bookingRoutes from "./booking.route"
import cancellationRoutes from "./cancellation.route"
import reviewRoutes from "./review.route"
import dashboardRoutes from "./dashboard.route"

const router = Router()

router.use("/auth", authRoutes)
router.use("/user", userRoutes)
router.use("/agency", agencyRoutes)
router.use("/trip", tripRoutes)
router.use("/trip-image", tripImageRoutes)
router.use("/itinerary", itineraryRoutes)
router.use("/booking", bookingRoutes)
router.use("/canellation", cancellationRoutes)
router.use("/review", reviewRoutes)
router.use("/dashboard", dashboardRoutes)

export default router
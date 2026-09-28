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
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.use("/auth", authRoutes)
router.use("/user", authenticate, userRoutes)
router.use("/agency", authenticate, agencyRoutes)
router.use("/trip", authenticate, tripRoutes)
router.use("/trip-image", authenticate, tripImageRoutes)
router.use("/itinerary", authenticate, itineraryRoutes)
router.use("/booking", authenticate, bookingRoutes)
router.use("/canellation", authenticate, cancellationRoutes)
router.use("/review", authenticate, reviewRoutes)
router.use("/dashboard", dashboardRoutes)

export default router
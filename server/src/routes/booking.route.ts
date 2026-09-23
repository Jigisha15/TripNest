import { Router } from "express";
import { createBooking, deleteBooking, getBooking, updateBooking, verifyBookingPayment } from "../controllers/booking.controller";

const router = Router()

router.get("/get", getBooking)
router.post("/create", createBooking)
router.post("/verify", verifyBookingPayment)
router.patch("/update/:booking_id", updateBooking)
router.delete("/delete/:booking_id", deleteBooking)

export default router
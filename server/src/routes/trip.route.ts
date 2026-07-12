import { Router } from "express";
import { createTrip, deleteTrip, getTrip, updateTrip } from "../controllers/trip.controller";

const router = Router()

router.get("/get", getTrip)
router.post("/create", createTrip)
router.patch("/update/:trip_id", updateTrip)
router.delete("/delete/:trip_id", deleteTrip)

export default router
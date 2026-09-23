import { Router } from "express";
import { createItinerary, deleteItinerary, updateItinerary, getItinerary } from "../controllers/itinerary.controller";

const router = Router()

router.get("/get", getItinerary)
router.post("/create", createItinerary)
router.patch("/update/:trip_id", updateItinerary)
router.delete("/delete/:trip_id", deleteItinerary)

export default router
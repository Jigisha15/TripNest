import { Router } from "express";
import { createItinerary, deleteItinerary, updateItinerary, getItinerary } from "../controllers/itinerary.controller";

const router = Router()

router.get("/get", getItinerary)
router.post("/create", createItinerary)
router.patch("/update/:itinerary_id", updateItinerary)
router.delete("/delete/:itinerary_id", deleteItinerary)


export default router
import { Router } from "express";
import { deleteTripImage, getTripImages, postTripImage } from "../controllers/trip-images.controller";

const router = Router()

router.get("/get", getTripImages)
router.post("/post-iamge", postTripImage)
router.delete("/delete/:trip_image_id", deleteTripImage)

export default router
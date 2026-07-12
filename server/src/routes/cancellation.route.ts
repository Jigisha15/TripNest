import { Router } from "express";
import { createCancellation, getCancellation, updateCancellation, deleteCancellation } from "../controllers/cancellation.controller";

const router = Router()

router.get("/get", getCancellation)
router.post("/create", createCancellation)
router.patch("/update/:cancellation_id", updateCancellation)
router.patch("/delete/:cancellation_id", deleteCancellation)

export default router
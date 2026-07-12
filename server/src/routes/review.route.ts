import { Router } from "express";
import { getReviews, createReview, updateReview, deleteReview } from "../controllers/review.controller";

const router = Router()

router.get("/get", getReviews)
router.post("/create", createReview)
router.patch("/update/:review_id", updateReview)
router.delete("/delete/:review_id", deleteReview)

export default router
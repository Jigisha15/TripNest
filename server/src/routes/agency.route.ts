import { Router } from "express";
import { deleteAgency, getAgency, registerAgency, updateAgency } from "../controllers/agency.controller";

const router = Router()

router.get("/get", getAgency)
router.post("/create", registerAgency)
router.patch("/update/:agency_id", updateAgency)
router.delete("/delete/:agency_id", deleteAgency)

export default router
import { Router } from "express";
import { deleteUser, getUsers, updateUser } from "../controllers/user.controller";

const router = Router()

router.get("/get", getUsers)
router.patch("/update/:user_id", updateUser)
router.delete("/delete/:user_id", deleteUser)

export default router
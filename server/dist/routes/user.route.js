"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get("/get", user_controller_1.getUsers);
router.patch("/update/:user_id", user_controller_1.updateUser);
router.delete("/delete/:user_id", user_controller_1.deleteUser);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trip_images_controller_1 = require("../controllers/trip-images.controller");
const router = (0, express_1.Router)();
router.get("/get", trip_images_controller_1.getTripImages);
router.post("/post-iamge", trip_images_controller_1.postTripImage);
router.delete("/delete/:trip_image_id", trip_images_controller_1.deleteTripImage);
exports.default = router;

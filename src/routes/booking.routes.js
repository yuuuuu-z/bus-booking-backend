import express from "express";
import {
  createBooking,
  deleteBooking,
  getTrips,
  verifyPayment,
  checkIn,
} from "../controllers/booking.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getTrips);
router.post("/", protect, createBooking);
router.get("/verify/:bookingId", protect, verifyPayment);
router.get("/check-in/:token", checkIn);
router.delete("/:id", protect, deleteBooking);

export default router;

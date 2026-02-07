import express from "express";
import {
  createBooking,
  deleteBooking,
  getTrips,
  verifyPayment,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getTrips);
router.post("/", createBooking);
router.get("/verify/:bookingId", verifyPayment);
router.delete("/:id", deleteBooking);

export default router;

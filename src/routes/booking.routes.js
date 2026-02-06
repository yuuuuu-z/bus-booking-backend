import express from "express";
import {
  createBooking,
  deleteBooking,
  getTrips,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getTrips);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

export default router;

import { Router } from "express";
import {
  getCheckoutSession,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  createBooking,
} from "../controllers/bookingController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const router = Router();

router.use(protect);

router.get("/checkout-session/:tourID", getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);

router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;

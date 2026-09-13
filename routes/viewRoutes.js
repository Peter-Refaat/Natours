import { Router } from "express";
import {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
} from "../controllers/viewsController.js";
import { isLoggedIn, protect } from "../controllers/authController.js";
import { createBookingCheckout } from "../controllers/bookingController.js";

const router = Router();
router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", createBookingCheckout, isLoggedIn, getTour);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/signup", isLoggedIn, getSignupForm);
router.get("/me", protect, getAccount);

export default router;

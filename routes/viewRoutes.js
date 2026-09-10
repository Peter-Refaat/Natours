import { Router } from "express";
import {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
} from "../controllers/viewsController.js";
import { isLoggedIn } from "../controllers/authController.js";

const router = Router();
router.use(isLoggedIn);
router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", getLoginForm);
router.get("/signup", getSignupForm);

export default router;

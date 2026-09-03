import { Router } from "express";
import {
  createReview,
  getAllReviews,
  getReview,
} from "../controllers/reviewController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").get(getReview);

export default router;

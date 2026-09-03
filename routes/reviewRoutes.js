import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
  setTourUserIDs,
} from "../controllers/reviewController.js";

import { protect, restrictTo } from "../controllers/authController.js";

const router = Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIDs, createReview);

router
  .route("/:id")
  .get(getReview)
  .delete(restrictTo("user", "admin"), deleteReview)
  .patch(restrictTo("user", "admin"), updateReview);

export default router;

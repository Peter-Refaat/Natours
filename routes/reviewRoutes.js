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

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourUserIDs, createReview);

router.route("/:id").get(getReview).delete(deleteReview).patch(updateReview);

export default router;

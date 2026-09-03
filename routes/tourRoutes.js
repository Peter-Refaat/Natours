import { Router } from "express";
import {
  aliasTopTours,
  getAllTours,
  getToursStats,
  getMonthlyPlan,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} from "../controllers/tourController.js";
import { protect, restrictTo } from "../controllers/authController.js";
import { createReview } from "../controllers/reviewController.js";

const router = Router();

// router.param("id", tourController.checkID);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protect, getAllTours).post(createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// TODO: doesn't make much sense, to be changed
router
  .route("/:tourID/reviews")
  .post(protect, restrictTo("user"), createReview);

export default router;

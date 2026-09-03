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
import reviewRouter from "./reviewRoutes.js";

const router = Router();

// router.param("id", tourController.checkID);

router.use("/:tourID/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getToursStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

export default router;

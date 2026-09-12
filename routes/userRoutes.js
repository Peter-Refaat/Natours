import { Router } from "express";

import {
  updateMe,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} from "../controllers/userController.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  logout,
} from "../controllers/authController.js";

const router = Router({ mergeParams: true });

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// protects all routes coming after this point (because middlewares run in sequence)
router.use(protect);

router.patch("/updateMyPassword", updatePassword);

router.get("/me", getMe, getUser);
router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);

// restricts all routes coming after this point (because middlewares run in sequence)
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
